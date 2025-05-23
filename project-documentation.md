# DeepSeek WebUI 项目文档

## 目录
1. [项目概述](#项目概述)
2. [技术栈](#技术栈)
3. [项目结构](#项目结构)
4. [功能模块](#功能模块)
5. [开发指南](#开发指南)
6. [部署说明](#部署说明)

## 项目概述

DeepSeek WebUI 是一个基于 DeepSeek 大语言模型的现代化 Web 交互界面。该项目支持语义识别和自定义 API 调用，提供了丰富的功能模块和用户友好的界面。

### 主要特点
- 支持多轮对话
- 自定义函数调用
- 模型参数控制
- 提示词模板管理
- 多会话管理
- 对话历史导出/导入

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **开发语言**: TypeScript
- **UI 框架**: Ant Design
- **样式方案**: Tailwind CSS
- **状态管理**: Zustand
- **本地存储**: localStorage

## 项目结构

### 1. 应用主目录 (src/app)

#### 1.1 根布局文件 (layout.tsx)
```typescript
// 主要功能：
- 定义应用的基本布局结构
- 设置全局字体（Inter）
- 配置页面元数据（标题和描述）
- 集成 Ant Design 组件库
- 实现路由守卫
- 设置页面重新验证时间（1小时）
```

#### 1.2 首页文件 (page.tsx)
```typescript
// 主要功能：
- 设置页面动态行为
- 实现自动重定向到聊天页面
- 配置运行时环境
```

#### 1.3 主布局文件 ((main)/layout.tsx)
```typescript
// 主要功能：
- 包装主布局组件
- 提供页面内容容器
```

### 2. 布局组件 (src/components/layout)

#### 2.1 主布局组件 (main-layout.tsx)
```typescript
// 主要功能：
- 实现应用的主布局结构
- 包含侧边栏和内容区域
- 集成导航菜单和余额显示
- 使用 Ant Design 的 Layout 组件
- 实现响应式布局
```

#### 2.2 导航菜单组件 (nav-menu.tsx)
```typescript
// 主要功能：
- 实现应用的导航菜单
- 提供页面导航功能
```

#### 2.3 面包屑组件 (breadcrumb.tsx)
```typescript
// 主要功能：
- 显示当前页面位置
- 提供导航路径
```

#### 2.4 余额显示组件 (balance-display.tsx)
```typescript
// 主要功能：
- 显示用户余额信息
- 提供余额查询功能
```

#### 2.5 路由守卫组件 (route-guard.tsx)
```typescript
// 主要功能：
- 实现路由访问控制
- 检查用户权限
- 处理未授权访问
```

### 3. 主要功能模块

#### 3.1 聊天模块 (src/app/(main)/chat)
- 实现聊天界面
- 处理消息发送和接收
- 显示聊天历史

#### 3.2 设置模块 (src/app/(main)/settings)
- 系统设置界面
- API 配置
- 用户偏好设置

#### 3.3 模板模块 (src/app/(main)/templates)
- 提示词模板管理
- 模板创建和编辑
- 模板使用

#### 3.4 工作流模块 (src/app/(main)/workflows)
- 工作流定义
- 流程管理
- 任务执行

#### 3.5 函数模块 (src/app/(main)/functions)
- 函数定义
- API 调用配置
- 函数测试

### 4. 工具库 (src/lib)

#### 4.1 状态管理 (store)
- 全局状态定义
- 状态操作方法
- 持久化存储

#### 4.2 工具函数 (utils)
- 通用工具方法
- 数据处理函数
- 格式化工具

#### 4.3 API 相关 (api)
- API 调用封装
- 请求处理
- 错误处理

### 5. 样式文件

#### 5.1 全局样式 (globals.css)
- 基础样式定义
- 全局变量
- 重置样式

#### 5.2 Ant Design 覆盖样式 (antd-overrides.css)
- 自定义 Ant Design 组件样式
- 主题覆盖
- 组件样式调整

## 功能模块

### 1. 对话功能
- 支持多轮对话
- 代码高亮显示
- Markdown 渲染
- 数学公式渲染
- 多会话管理
- 对话历史导出/导入

### 2. 函数调用功能
- 自定义外部函数配置
- 内置常用 API 函数模板
- 函数参数可视化配置
- 函数测试功能
- 支持多种请求方法
- 参数验证和必填项设置

### 3. 模型控制
- 温度调节
- 采样策略选择
- 最大输出长度控制
- 系统提示词自定义
- 多模型切换

### 4. 高级功能
- 提示词模板库
- API 密钥管理
- 函数配置管理
- 对话历史管理

## 开发指南

### 1. 环境要求
- Node.js 18+
- npm 或 yarn
- TypeScript 5+

### 2. 安装依赖
```bash
npm install
```

### 3. 开发环境启动
```bash
npm run dev
```

### 4. 生产环境构建
```bash
npm run build
```

### 5. 生产环境启动
```bash
npm run start
```

## 部署说明

### 1. Vercel 部署
1. Fork 项目到 GitHub
2. 在 Vercel 注册并连接 GitHub
3. 导入项目并部署
4. 配置环境变量

### 2. 环境变量配置
- API_KEY: DeepSeek API 密钥
- 其他必要的环境变量

### 3. 注意事项
1. 首次使用需要配置 API Key
2. 函数配置需要正确设置参数
3. 注意 API 调用频率限制
4. 生产环境需要配置正确的环境变量

## 维护和更新

### 1. 代码规范
- 使用 ESLint 进行代码检查
- 遵循 TypeScript 最佳实践
- 保持代码风格一致

### 2. 版本控制
- 使用 Git 进行版本控制
- 遵循语义化版本号
- 保持提交信息清晰

### 3. 文档更新
- 及时更新项目文档
- 记录重要变更
- 维护 API 文档

## 贡献指南

### 1. 提交问题
- 使用 GitHub Issues 提交问题
- 提供详细的复现步骤
- 附上相关日志和截图

### 2. 提交代码
- Fork 项目并创建分支
- 遵循代码规范
- 提交清晰的提交信息
- 创建 Pull Request

### 3. 代码审查
- 确保代码质量
- 测试功能完整性
- 检查性能影响

## 许可证

本项目采用 MIT 许可证。详见 LICENSE 文件。 