'use client';

import { Layout } from 'antd';
import { UserProfile } from './user-profile';
import { ConversationList } from './conversation-list';
import { useEffect } from 'react';
import { useConversationStore } from '@/lib/store/conversation-store';

const { Sider, Content } = Layout;

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { conversations, addConversation } = useConversationStore();

  // 确保至少有一个对话
  useEffect(() => {
    if (conversations.length === 0) {
      addConversation({
        title: '新对话',
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    }
  }, [conversations.length, addConversation]);

  return (
    <Layout className="h-screen">
      <Sider 
        theme="light" 
        className="border-r fixed h-full" 
        width={260}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <h1 className="text-xl font-bold">DeepSeek</h1>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <ConversationList />
            <UserProfile />
          </div>
        </div>
      </Sider>
      <Layout >
        <Content className="h-full overflow-hidden">
          {children}
        </Content>
      </Layout>
    </Layout>
  );
} 