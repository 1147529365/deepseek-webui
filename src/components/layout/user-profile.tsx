'use client';

import { useState, useEffect, useRef } from 'react';
import { Avatar, Menu, message, Button, Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import {
    UserOutlined,
    SettingOutlined,
    MessageOutlined,
    LogoutOutlined,
    UpOutlined,
    LoginOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth-store';
import styles from '@/styles/layout/user-profile.module.css';

export function UserProfile() {
    const { user, isAuthenticated, logout } = useAuthStore();
    const router = useRouter();
    const [menuVisible, setMenuVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef(null);

    // 解决水合不匹配问题
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleMenuClick = ({ key }: { key: string }) => {
        switch (key) {
            case 'settings':
                router.push('/settings');
                break;
            case 'contact':
                message.info('联系我们: vx: jgn0206');
                break;
            case 'logout':
                logout();
                message.success('已退出登录');
                break;
            default:
                break;
        }
        setMenuVisible(false);
    };

    const menuItems: MenuProps['items'] = [
        {
            key: 'user-info',
            label: (
                <div className={styles.userInfo}>
                    <Avatar size={64} icon={<UserOutlined />} className={styles.largeAvatar} />
                    <div className={styles.userName}>{user?.username || '用户'}</div>
                </div>
            ),
            style: { height: 'auto' },
            type: 'group',
        },
        { type: 'divider' },
        {
            key: 'settings',
            label: '系统设置',
            icon: <SettingOutlined />,
        },
        {
            key: 'contact',
            label: 'vx: jgn0206',
            icon: <MessageOutlined />,
        },
        { type: 'divider' },
        {
            key: 'logout',
            label: '退出登录',
            icon: <LogoutOutlined />,
            danger: true,
        },
    ];

    // 处理登录按钮点击
    const handleLoginClick = () => {
        // 调用全局方法显示登录弹窗
        if (typeof window !== 'undefined' && (window as any).showLoginModal) {
            (window as any).showLoginModal();
        }
    };

    // 防止水合不匹配
    if (!mounted) {
        return <div className={styles.container}></div>;
    }

    if (!isAuthenticated) {
        return (
            <div className={styles.container}>
                <div className={styles.loginButton}>
                    <Button
                        type="text"
                        icon={<LoginOutlined />}
                        onClick={handleLoginClick}
                        className={styles.fullWidthButton}
                    >
                        登录/注册
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <Dropdown
                menu={{
                    items: menuItems,
                    onClick: handleMenuClick,
                    className: styles.menu,
                }}
                placement="topLeft"
                trigger={['click']}
                open={menuVisible}
                onOpenChange={setMenuVisible}
                overlayClassName={styles.dropdown}
            >
                <div className={styles.userButton} ref={buttonRef}>
                    <Avatar
                        icon={<UserOutlined />}
                        className={styles.avatar}
                    />
                    <div className={styles.userInfo}>
                        <div className={styles.nameAndIcon}>
                            <span className={styles.name}>{user?.username || '未登录'}</span>
                            <UpOutlined
                                className={`${styles.icon} ${menuVisible ? styles.iconRotated : ''}`}
                            />
                        </div>
                    </div>
                </div>
            </Dropdown>
        </div>
    );
} 