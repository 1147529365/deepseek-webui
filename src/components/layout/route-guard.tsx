'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import { LoginModal } from '@/components/auth/login-modal';

const routes = ['/chat', '/templates', '/settings', '/workflows', '/functions'] as const;
type ValidRoute = typeof routes[number];

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, login } = useAuthStore();
  const [showLogin, setShowLogin] = useState(false);

  useEffect(() => {
    // 如果是根路由，重定向到新对话页面
    if (pathname === '/') {
      router.replace('/new-chat');
    }
  }, [pathname, router]);

  const handleLogin = async (values: any) => {
    // 模拟登录成功
    login({
      id: '1',
      username: values.username || values.phone,
      token: 'mock-token',
    });
    setShowLogin(false);
  };

  // 提供给外部组件调用的显示登录弹窗方法
  const showLoginModal = () => {
    setShowLogin(true);
  };

  // 将 showLoginModal 方法添加到 window 对象以便其他组件调用
  useEffect(() => {
    // 添加全局方法以显示登录弹窗
    (window as any).showLoginModal = showLoginModal;
    
    return () => {
      // 清理全局方法
      delete (window as any).showLoginModal;
    };
  }, []);

  return (
    <>
      {children}
      <LoginModal
        open={showLogin}
        onLogin={handleLogin}
      />
    </>
  );
} 