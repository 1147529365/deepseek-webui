'use client';

import { Modal, Form, Input, Button, message, Tooltip } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';
import styles from '@/styles/auth/login-modal.module.css';

interface LoginModalProps {
    open: boolean;
    onLogin: (values: any) => void;
}

export function LoginModal({ open, onLogin }: LoginModalProps) {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState<'account' | 'phone'>('account');
    
    const handleSubmit = async (values: any) => {
        try {
            setLoading(true);
            // TODO: 实现实际的登录逻辑
            await onLogin(values);
            message.success('登录成功');
        } catch (error) {
            message.error('登录失败，请重试');
        } finally {
            setLoading(false);
        }
    };

    const showMobileLoginNotReady = () => {
        message.info('手机号登录功能正在开发中，敬请期待！');
    };

    return (
        <Modal
            open={open}
            footer={null}
            closable={false}
            maskClosable={false}
            width={420}
            centered
            className={styles.modal}
            wrapClassName={styles.modalContent}
        >
            <div className={styles.header}>
                <h2>欢迎使用 DeepSeek</h2>
                <p>请登录您的账号</p>
            </div>

            <Form
                form={form}
                onFinish={handleSubmit}
                className={styles.form}
                layout="vertical"
            >
                <Form.Item
                    name="username"
                    rules={[{ required: true, message: '请输入用户名' }]}
                    className={styles.formItem}
                >
                    <Input
                        prefix={<UserOutlined className={styles.inputIcon} />}
                        placeholder="用户名"
                        size="large"
                        className={styles.inputWrapper}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: '请输入密码' }]}
                    className={styles.formItem}
                >
                    <Input.Password
                        prefix={<LockOutlined className={styles.inputIcon} />}
                        placeholder="密码"
                        size="large"
                        className={styles.passwordInput}
                    />
                </Form.Item>
                
                <div className={styles.forgotPassword}>
                    <a href="#" onClick={(e) => { e.preventDefault(); message.info('密码找回功能开发中') }}>
                        忘记密码?
                    </a>
                </div>
                
                <Form.Item className={styles.formItem}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        block
                        loading={loading}
                        className={styles.submitButton}
                    >
                        登录
                    </Button>
                </Form.Item>
            </Form>

            <div className={styles.otherLoginOptions}>
                <div className={styles.otherLoginText}>其他登录方式</div>
                <div className={styles.loginMethodButtons}>
                    <Tooltip title="手机号登录功能正在开发中，敬请期待！">
                        <button 
                            type="button" 
                            className={`${styles.loginMethodButton} ${styles.disabledButton}`}
                            onClick={showMobileLoginNotReady}
                        >
                            <MobileOutlined /> 手机号登录
                        </button>
                    </Tooltip>
                    <Tooltip title="更多登录方式正在开发中">
                        <button 
                            type="button" 
                            className={`${styles.loginMethodButton} ${styles.disabledButton}`}
                            onClick={() => message.info('更多登录方式开发中')}
                        >
                            <QuestionCircleOutlined /> 其他方式
                        </button>
                    </Tooltip>
                </div>
            </div>

            <div className={styles.footer}>
                <p>首次登录将自动创建账号</p>
                <p>登录即表示您同意 <a href="#" onClick={(e) => { e.preventDefault(); message.info('用户协议开发中') }}>《用户协议》</a> 和 <a href="#" onClick={(e) => { e.preventDefault(); message.info('隐私政策开发中') }}>《隐私政策》</a></p>
            </div>
        </Modal>
    );
} 