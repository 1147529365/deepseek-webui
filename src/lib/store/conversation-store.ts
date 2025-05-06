import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Conversation {
  id: string;
  title: string;
  createdAt: number; // 时间戳
  updatedAt: number; // 时间戳
}

interface ConversationState {
  conversations: Conversation[];
  currentConversationId: string | null;
  addConversation: (conversation: Omit<Conversation, 'id'>) => string;
  updateConversation: (id: string, data: Partial<Conversation>) => void;
  removeConversation: (id: string) => void;
  setCurrentConversation: (id: string) => void;
  getConversation: (id: string) => Conversation | null;
  clearAllConversations: () => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversationId: null,

      addConversation: (conversation) => {
        const id = `conv_${Date.now()}`;
        set((state) => ({
          conversations: [
            ...state.conversations,
            { ...conversation, id }
          ],
          currentConversationId: id
        }));
        return id;
      },

      updateConversation: (id, data) => {
        set((state) => ({
          conversations: state.conversations.map((conv) =>
            conv.id === id
              ? { ...conv, ...data, updatedAt: Date.now() }
              : conv
          )
        }));
      },

      removeConversation: (id) => {
        try {
          // 检查是否是最后一个对话
          const isLastConversation = get().conversations.length <= 1;
          const isCurrentConversation = get().currentConversationId === id;

          // 直接删除（不使用返回对象的方式）
          if (isLastConversation) {
            // 如果是最后一个对话，直接设置空数组和null ID
            set({
              conversations: [],
              currentConversationId: null
            });

            // 强制再次设置一次，确保状态被更新
            setTimeout(() => {
              set({
                conversations: [],
                currentConversationId: null
              });
            }, 10);

            // 删除localStorage中的相关内容
            try {
              // 直接从localStorage中删除相关项
              localStorage.removeItem('conversation-store');
              // 重新设置为初始状态
              localStorage.setItem('conversation-store', JSON.stringify({
                state: {
                  conversations: [],
                  currentConversationId: null
                },
                version: 0
              }));
            } catch (e) {
              console.error('清理localStorage失败:', e);
            }
          } else {
            // 获取当前状态
            const state = get();
            // 过滤掉要删除的对话
            const newConversations = state.conversations.filter(conv => conv.id !== id);

            // 如果删除的是当前对话，则选择第一个作为新的当前对话
            const newCurrentId = isCurrentConversation
              ? (newConversations.length > 0 ? newConversations[0].id : null)
              : state.currentConversationId;

            // 设置新状态
            set({
              conversations: newConversations,
              currentConversationId: newCurrentId
            });
          }
        } catch (error) {
          console.error('删除对话失败:', error);
          // 如果出错，尝试使用最简单的方式强制重置
          set({ conversations: [], currentConversationId: null });
        }
      },

      clearAllConversations: () => {
        try {
          // 直接清空所有对话
          set({
            conversations: [],
            currentConversationId: null
          });

          // 强制再次设置一次，确保状态被更新
          setTimeout(() => {
            set({
              conversations: [],
              currentConversationId: null
            });
          }, 10);

          // 删除localStorage中的相关内容
          try {
            // 直接从localStorage中删除相关项
            localStorage.removeItem('conversation-store');
            localStorage.setItem('conversation-store', JSON.stringify({
              state: {
                conversations: [],
                currentConversationId: null
              },
              version: 0
            }));
          } catch (e) {
            console.error('清理localStorage失败:', e);
          }
        } catch (error) {
          console.error('清空所有对话失败:', error);
          // 如果出错，使用最简单的方式强制重置
          set({ conversations: [], currentConversationId: null });
        }
      },

      setCurrentConversation: (id) => {
        set({ currentConversationId: id });
      },

      getConversation: (id) => {
        return get().conversations.find(conv => conv.id === id) || null;
      }
    }),
    {
      name: 'conversation-store',
      partialize: (state) => ({
        conversations: state.conversations,
        currentConversationId: state.currentConversationId
      })
    }
  )
); 