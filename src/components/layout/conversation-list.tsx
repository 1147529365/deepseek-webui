'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button, List, Tooltip, Empty, Modal } from 'antd';
import { MessageOutlined, PlusOutlined, EditOutlined, DeleteOutlined, ClearOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import styles from '@/styles/layout/conversation-list.module.css';
import { useChatStore } from '@/lib/store/chat-store';
import { useConversationStore } from '@/lib/store/conversation-store';
import { Conversation } from '@/lib/store/conversation-store';

// 辅助函数：格式化日期
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  
  if (date.toDateString() === today.toDateString()) {
    return '今天';
  } else if (date.toDateString() === yesterday.toDateString()) {
    return '昨天';
  } else if (date > lastWeek) {
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return dayNames[date.getDay()];
  } else if (date.getFullYear() === today.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  } else {
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  }
};

// 辅助函数：获取时间分组的key
const getTimeGroupKey = (timestamp: number): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const thisYear = new Date();
  thisYear.setDate(1);
  thisYear.setMonth(0);
  
  if (date.toDateString() === today.toDateString()) {
    return 'today';
  } else if (date >= sevenDaysAgo && date < today) {
    return 'last7days';
  } else if (date >= thirtyDaysAgo && date < sevenDaysAgo) {
    return 'last30days';
  } else if (date >= thisYear && date < thirtyDaysAgo) {
    return 'thisYear';
  } else {
    return 'older';
  }
};

// 辅助函数：获取时间组标题
const getTimeGroupTitle = (key: string): string => {
  switch (key) {
    case 'today': return '今天';
    case 'last7days': return '最近一周';
    case 'last30days': return '最近一个月';
    case 'thisYear': return '今年';
    case 'older': return '更早';
    default: return '';
  }
};

export function ConversationList() {
  const router = useRouter();
  const [editing, setEditing] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const { 
    conversations, 
    currentConversationId, 
    addConversation, 
    updateConversation, 
    removeConversation, 
    setCurrentConversation,
    clearAllConversations 
  } = useConversationStore();
  const { clearMessages } = useChatStore();
  const chatStore = useChatStore.getState();
  
  // 按照时间分组对话
  const groupedConversations = useMemo(() => {
    const groups: Record<string, Conversation[]> = {
      today: [],
      last7days: [],
      last30days: [],
      thisYear: [],
      older: []
    };
    
    // 首先按更新时间排序
    const sortedConversations = [...conversations].sort((a, b) => b.updatedAt - a.updatedAt);
    
    // 然后按时间分组
    sortedConversations.forEach(conv => {
      const groupKey = getTimeGroupKey(conv.updatedAt);
      groups[groupKey].push(conv);
    });
    
    return groups;
  }, [conversations]);
  
  // 监听对话列表变化，如果没有对话则跳转到新对话页面
  useEffect(() => {
    if (conversations.length === 0) {
      // 不要在这里调用clearAllMessages，可能导致正常切换对话时消息被清空
      // 相关的消息清理应该在具体操作（如删除对话）的处理函数中直接调用
      router.push('/new-chat');
    }
  }, [conversations, router]);
  
  // 创建新对话
  const handleNewConversation = () => {
    // 跳转到新对话创建页面
    router.push('/new-chat');
  };
  
  // 切换到指定对话
  const handleSelectConversation = (id: string) => {
    setCurrentConversation(id);
    router.push('/chat');
  };
  
  // 开始编辑对话名称
  const handleStartEdit = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditing(id);
    setEditTitle(title);
  };
  
  // 保存对话名称
  const handleSaveEdit = (id: string, e: React.FocusEvent | React.KeyboardEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      updateConversation(id, { title: editTitle.trim() });
    }
    setEditing(null);
  };
  
  // 处理按键事件
  const handleKeyDown = (id: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit(id, e);
    } else if (e.key === 'Escape') {
      setEditing(null);
    }
  };
  
  // 渲染单个对话项
  const renderConversationItem = (item: Conversation) => (
    <List.Item 
      key={item.id}
      className={`${styles.item} ${item.id === currentConversationId ? styles.activeItem : ''}`}
      onClick={() => handleSelectConversation(item.id)}
    >
      <div className={styles.itemContent}>
        <MessageOutlined className={styles.itemIcon} />
        
        {editing === item.id ? (
          <input
            className={styles.editInput}
            value={editTitle}
            onChange={e => setEditTitle(e.target.value)}
            onBlur={e => handleSaveEdit(item.id, e)}
            onKeyDown={e => handleKeyDown(item.id, e)}
            autoFocus
            onClick={e => e.stopPropagation()}
          />
        ) : (
          <span className={styles.itemTitle}>{item.title}</span>
        )}
      </div>
      
      <div className={styles.itemActions} onClick={e => e.stopPropagation()}>
        <Tooltip title="重命名">
          <Button 
            type="text" 
            size="small" 
            icon={<EditOutlined />} 
            onClick={e => handleStartEdit(item.id, item.title, e)}
            className={styles.actionButton}
          />
        </Tooltip>
        <Tooltip title="删除">
          <Button 
            type="text" 
            size="small" 
            icon={<DeleteOutlined />} 
            onClick={e => handleRemoveConversation(item.id, e)}
            className={styles.actionButton}
            danger
          />
        </Tooltip>
      </div>
    </List.Item>
  );
  // 删除对话
  const handleRemoveConversation = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // 检查是否是最后一个对话
    const isLastConversation = conversations.length <= 1;
    
    // 确认删除
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除此对话吗？${isLastConversation ? '这是最后一个对话，删除后将跳转到新对话页面。' : ''}`,
      okText: '删除',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // 消息处理：先清理消息再删除对话
          if (isLastConversation) {
            // 对于最后一个对话，我们需要完全清理所有存储
            clearMessages();
            
            // 延迟一点时间确保清理完成
            await new Promise(resolve => setTimeout(resolve, 50));
            
            // 强制清理localStorage
            try {
              localStorage.removeItem('chat-store');
              localStorage.removeItem('conversation-store');
              
              // 重新设置为初始状态
              localStorage.setItem('conversation-store', JSON.stringify({
                state: {
                  conversations: [],
                  currentConversationId: null
                },
                version: 0
              }));
              
              localStorage.setItem('chat-store', JSON.stringify({
                state: {
                  messagesByConversation: {},
                  settings: useChatStore.getState().settings
                },
                version: 0
              }));
            } catch (e) {
              console.error('清理localStorage失败:', e);
            }
            
            // 移除对话记录
            removeConversation(id);
            
            // 立即跳转，不等待状态变化触发useEffect
            router.push('/new-chat');
          } else {
            // 不是最后一个对话，正常流程
            clearMessages();
            
            // 先清理消息，再删除对话
            await new Promise(resolve => setTimeout(resolve, 10));
            
            // 获取当前状态，确保删除前知道当前对话是哪个
            const isCurrentConversation = id === currentConversationId;
            
            // 删除对话
            removeConversation(id);
            
            // 如果删除的是当前对话，手动跳转
            if (isCurrentConversation) {
              // 延迟一点执行跳转，确保状态已更新
              setTimeout(() => {
                router.push('/chat');
              }, 10);
            }
          }
        } catch (error) {
          console.error('删除对话失败:', error);
          // 出错时，强制清理本地存储并跳转到新对话页面
          try {
            localStorage.removeItem('chat-store');
            localStorage.removeItem('conversation-store');
          } catch (e) {
            console.error('清理localStorage失败:', e);
          }
          
          router.push('/new-chat');
        }
      }
    });
  };
  const clearAllMessages = () => {
    
    localStorage.removeItem('chat-store');
    localStorage.removeItem('conversation-store');
    router.push('/new-chat');
  };

  // 清空所有对话
  const handleClearAllConversations = () => {
    // 确认删除
    Modal.confirm({
      title: '确认清空',
      content: '确定要清空所有对话吗？此操作不可恢复。',
      okText: '清空',
      cancelText: '取消',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          // 先清空所有消息存储
          clearMessages(); // 使用可用的clearMessages方法
          
          // 延迟一点时间确保清理完成
          await new Promise(resolve => setTimeout(resolve, 50));
          
          // 强制清理localStorage
          try {
            localStorage.removeItem('chat-store');
            
            // 重新设置为初始状态
            localStorage.setItem('chat-store', JSON.stringify({
              state: {
                messages: [],
                settings: useChatStore.getState().settings
              },
              version: 0
            }));
          } catch (e) {
            console.error('清理localStorage失败:', e);
          }
          
          // 清空所有对话
          clearAllConversations();
          
          // 立即跳转，不等待状态变化触发useEffect
          router.push('/new-chat');
        } catch (error) {
          console.error('清空所有对话失败:', error);
          router.push('/new-chat');
        }
      }
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerButtons}>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleNewConversation}
            className={styles.newButton}
          >
            新对话
          </Button>
          
          {conversations.length > 0 && (
            <Tooltip title="清空所有对话">
              <Button
                icon={<ClearOutlined />}
                onClick={handleClearAllConversations}
                danger
                className={styles.clearAllButton}
              />
            </Tooltip>
          )}
        </div>
      </div>
      
      {conversations.length === 0 ? (
        <div className={styles.emptyContainer}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无历史记录"
            className={styles.empty}
          />
        </div>
      ) : (
        <div className={styles.list}>
          {Object.entries(groupedConversations).map(([groupKey, convs]) => {
            if (convs.length === 0) return null;
            
            return (
              <div key={groupKey} className={styles.timeGroup}>
                <div className={styles.timeHeader}>
                  {getTimeGroupTitle(groupKey)}
                </div>
                {convs.map(renderConversationItem)}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 