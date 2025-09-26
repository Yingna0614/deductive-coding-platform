# 系统架构概览

## 🏗️ 整体架构

LLM辅助演绎编码平台采用现代化的Web应用架构，基于Next.js构建，集成了大语言模型API，为定性研究提供智能化的文本编码解决方案。

## 🔄 工作流程

### 1. 文档上传阶段
```
用户上传文本文档 + CSV代码框架
           ↓
    文件解析和验证
           ↓
    数据存储到LocalStorage
           ↓
    跳转到编码界面
```

### 2. 智能编码阶段
```
用户选择文本片段
           ↓
    获取上下文信息
           ↓
    调用OpenRouter API
           ↓
    解析AI建议
           ↓
    用户选择并应用代码
           ↓
    更新编码统计
```

### 3. 结果导出阶段
```
完成编码工作
           ↓
    生成编码结果
           ↓
    选择导出格式
           ↓
    下载编码文件
```

## 🧩 核心组件

### 前端组件架构
```
App Layout
├── Home Page (文档上传)
│   ├── File Upload Component
│   ├── CSV Parser
│   └── Navigation
└── Coding Page (编码界面)
    ├── Text Highlighter
    ├── Multi-Code Selector
    │   ├── Manual Code Selection
    │   ├── AI Suggestions Engine
    │   └── Code Application Logic
    ├── Coding Statistics
    └── Export Dialog
```

### AI集成架构
```
Multi-Code Selector
           ↓
    Prompt Engineering
           ↓
    OpenRouter API Call
           ↓
    Response Parsing
           ↓
    Suggestion Display
```

## 🔧 技术栈详解

### 前端技术
- **Next.js 14**: 提供SSR/SSG、路由、API路由等功能
- **React 18**: 组件化UI开发，支持Hooks和并发特性
- **TypeScript**: 提供类型安全，减少运行时错误
- **Tailwind CSS**: 原子化CSS，快速构建响应式界面

### UI组件库
- **Radix UI**: 提供无障碍的基础组件
- **Lucide React**: 现代图标库
- **自定义组件**: 针对编码场景的专用组件

### 状态管理
- **React Hooks**: useState, useEffect, useRef等
- **LocalStorage**: 客户端数据持久化
- **Context API**: 全局状态管理（如主题）

### AI集成
- **OpenRouter API**: 统一的LLM访问接口
- **GPT-4o-mini**: 成本效益平衡的语言模型
- **自定义提示工程**: 针对编码任务的优化提示

## 📊 数据流

### 输入数据
```
文本文档 (.txt, .md, .docx)
           ↓
    File API 读取
           ↓
    文本内容存储
```

```
CSV代码框架
           ↓
    自定义CSV解析器
           ↓
    结构化代码数据
```

### 处理数据
```
选中文本 + 上下文
           ↓
    提示词构建
           ↓
    LLM API调用
           ↓
    JSON响应解析
           ↓
    建议列表生成
```

### 输出数据
```
编码结果
           ↓
    统计信息
           ↓
    导出格式转换
           ↓
    文件下载
```

## 🔐 安全架构

### API密钥管理
```
环境变量 (.env.local)
           ↓
    API_CONFIG 模块
           ↓
    组件中使用
           ↓
    API调用
```

### 数据安全
- **客户端处理**: 敏感文档不上传到服务器
- **环境隔离**: 开发/生产环境分离
- **Git忽略**: 敏感文件不提交到版本控制

## 🚀 部署架构

### 开发环境
```
本地开发服务器 (npm run dev)
           ↓
    热重载 + 开发工具
           ↓
    本地测试
```

### 生产环境
```
静态导出 (npm run build)
           ↓
    CDN部署
           ↓
    环境变量配置
           ↓
    生产运行
```

## 📈 性能优化

### 前端优化
- **代码分割**: Next.js自动代码分割
- **图片优化**: Next.js Image组件
- **CSS优化**: Tailwind CSS按需加载
- **缓存策略**: LocalStorage缓存

### API优化
- **请求去重**: 避免重复API调用
- **错误处理**: 完善的错误重试机制
- **响应缓存**: 客户端缓存API响应

## 🔄 扩展性设计

### 模块化架构
- **组件复用**: 高度可复用的UI组件
- **插件化**: 易于扩展的AI模型集成
- **配置化**: 灵活的配置管理系统

### 未来扩展
- **多语言支持**: i18n国际化
- **多模型支持**: 集成更多LLM提供商
- **协作功能**: 多用户协作编码
- **云端存储**: 集成云存储服务

## 🛠️ 开发工具链

### 开发工具
- **TypeScript**: 类型检查和智能提示
- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Git**: 版本控制

### 构建工具
- **Next.js**: 内置构建和优化
- **PostCSS**: CSS处理
- **Webpack**: 模块打包（Next.js内置）

### 测试工具
- **Jest**: 单元测试框架
- **React Testing Library**: React组件测试
- **Cypress**: 端到端测试（可选）

## 📋 监控和日志

### 开发监控
- **控制台日志**: 详细的调试信息
- **错误边界**: React错误处理
- **性能监控**: 开发工具集成

### 生产监控
- **错误追踪**: 客户端错误收集
- **性能指标**: 页面加载时间
- **用户行为**: 使用情况分析

---

这个系统架构设计确保了平台的可扩展性、可维护性和用户体验，为定性研究提供了强大而灵活的编码工具。
