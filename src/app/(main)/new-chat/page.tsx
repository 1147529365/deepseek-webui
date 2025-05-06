"use client"
import { useState, useRef, useEffect } from "react"
import { Input, Button, Tooltip, message, Dropdown } from "antd"
import { SendOutlined, AudioOutlined, GlobalOutlined, LoadingOutlined } from "@ant-design/icons"
import { useRouter } from 'next/navigation'
import { useConversationStore } from '@/lib/store/conversation-store'
import { useChatStore } from '@/lib/store/chat-store'
import { useAuthStore } from '@/lib/store/auth-store'

export default function NewChatPage() {
  const [input, setInput] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [language, setLanguage] = useState('中文')
  const inputRef = useRef<any>(null)
  const router = useRouter()
  const { addConversation, setCurrentConversation } = useConversationStore()
  const { addMessage } = useChatStore()
  const { isAuthenticated } = useAuthStore()
  
  // 焦点自动聚焦到输入框
  useEffect(() => {
    if (inputRef.current) {
      setTimeout(() => {
        inputRef.current.focus()
      }, 100)
    }
  }, [])

  // 处理消息发送
  const handleSendMessage = async () => {
    if (!input.trim() || isProcessing) return
    
    if (!isAuthenticated) {
      // 如果未登录，显示登录弹窗
      if (typeof window !== 'undefined' && (window as any).showLoginModal) {
        message.info('请先登录后再发送消息')
        ;(window as any).showLoginModal()
        return
      }
    }

    try {
      setIsProcessing(true)
      
      // 创建新对话，使用用户输入的第一条消息作为标题
      const title = input.trim().length > 30 
        ? input.trim().substring(0, 30) + '...'
        : input.trim()
      
      const conversationId = addConversation({
        title,
        createdAt: Date.now(),
        updatedAt: Date.now()
      })
      
      // 添加用户消息
      addMessage({
        role: 'user',
        content: input.trim(),
        timestamp: Date.now()
      })
      
      // 设置当前对话
      setCurrentConversation(conversationId)
      
      // 清空输入
      setInput('')
      
      // 跳转到聊天页面
      router.push('/chat')
    } catch (error) {
      console.error('创建对话失败', error)
      message.error('创建对话失败，请重试')
    } finally {
      setIsProcessing(false)
    }
  }


  // 处理按键事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+Enter 或 Command+Enter 发送消息
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // 语言选项
  const languageOptions = [
    {
      key: 'zh',
      label: '中文',
      onClick: () => setLanguage('中文')
    },
    {
      key: 'en',
      label: 'English',
      onClick: () => setLanguage('English')
    }
  ]

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white">
      <div className="flex-1 w-full max-w-3xl flex flex-col items-center justify-center px-4">
        {/* Header with logo and title */}
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center mr-3">
            <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
              <path d="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M13.61,6.73 c0.97,0.34,1.85,0.95,2.54,1.75c0.69,0.8,1.18,1.79,1.38,2.84c0.21,1.05,0.15,2.14-0.16,3.16c-0.31,1.02-0.88,1.94-1.64,2.69 c-0.76,0.75-1.69,1.28-2.71,1.55c-1.02,0.27-2.1,0.27-3.12,0c-1.02-0.27-1.95-0.8-2.71-1.55c-0.76-0.75-1.33-1.67-1.64-2.69 c-0.31-1.02-0.37-2.11-0.16-3.16c0.21-1.05,0.69-2.04,1.38-2.84c0.69-0.8,1.57-1.41,2.54-1.75c0.97-0.34,2.01-0.42,3.01-0.24 C11.6,6.31,12.64,6.39,13.61,6.73z M9.5,9.5C9.22,9.5,9,9.72,9,10v4c0,0.28,0.22,0.5,0.5,0.5h5c0.28,0,0.5-0.22,0.5-0.5v-4 c0-0.28-0.22-0.5-0.5-0.5H9.5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-medium">我是 你的私人律师, 很高兴见到你!</h1>
        </div>

        {/* Subtitle */}
        <p className="text-gray-600 text-center mb-8">
          我可以帮你写代码, 读文件, 写作各种创意内容, 请把你的任务交给我吧~
        </p>

        {/* Chat input area */}
        <div className="w-full bg-gray-50 rounded-lg p-3 mb-8">
          <Input.TextArea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="给 DeepSeek 发送消息"
            autoSize={{ minRows: 1, maxRows: 6 }}
            bordered={ false }
            className="bg-transparent"
            onKeyDown={handleKeyDown}
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
            </div>

            {/* Right side buttons */}
            <div className="flex items-center">
              <Tooltip title="发送 (Ctrl+Enter)">
                <Button 
                  type="text" 
                  shape="circle" 
                  icon={isProcessing ? <LoadingOutlined /> : <SendOutlined />} 
                  className={`${input.trim() ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'}`}
                  onClick={handleSendMessage}
                  disabled={!input.trim() || isProcessing}
                />
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full py-4 text-center text-gray-400 text-sm">内容由 AI 生成, 请仔细甄别</footer>
    </div>
  )
}
