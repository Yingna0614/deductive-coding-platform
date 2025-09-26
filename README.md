# LLM-Assisted Deductive Coding Platform

一个集成了大语言模型的智能演绎编码平台，专为定性研究中的文本编码工作设计。该平台结合了传统演绎编码方法和现代AI技术，提供智能代码建议和高效的编码工作流程。

## 🌟 核心功能

### 📄 多格式文档支持
- **文本文档上传**: 支持多种格式的文本文件
- **CSV代码框架**: 支持上传包含code和definition列的CSV文件
- **示例数据**: 提供完整的示例文本和代码框架

### 🤖 AI智能建议
- **OpenRouter集成**: 使用OpenRouter API访问多种LLM模型
- **上下文感知**: 基于选中的文本和周围上下文提供建议
- **代码匹配**: 智能匹配代码框架中的相关代码
- **解释说明**: 为每个建议提供详细的解释和置信度

### 🎯 交互式编码
- **文本高亮**: 直观的文本选择和编码界面
- **多代码选择**: 支持为同一段文本应用多个代码
- **实时预览**: 即时查看编码结果和统计信息
- **撤销重做**: 完整的操作历史管理

### 📊 数据管理
- **编码统计**: 实时显示编码进度和分布
- **结果导出**: 支持多种格式的编码结果导出
- **数据持久化**: 自动保存编码进度和结果

## 🚀 快速开始

### 环境要求
- Node.js 18+ 
- npm 或 pnpm
- 现代浏览器（Chrome、Firefox、Safari、Edge）

### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/Yingna0614/llm-assisted-deductive-coding.git
cd llm-assisted-deductive-coding
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **配置环境变量**
创建 `.env.local` 文件：
```bash
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=YourAppName
```

4. **启动开发服务器**
```bash
npm run dev
# 或
pnpm dev
```

5. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📖 使用指南

### 第一步：上传文档
1. 在首页上传您的文本文档（支持.txt、.md等格式）
2. 上传CSV格式的代码框架文件，确保包含以下列：
   - `code`: 代码名称
   - `definition`: 代码定义

### 第二步：开始编码
1. 进入编码界面
2. 选择需要编码的文本片段
3. 点击"Get AI Suggestions"获取智能建议
4. 选择适用的代码并应用

### 第三步：导出结果
1. 完成编码后，点击导出按钮
2. 选择导出格式（JSON、CSV等）
3. 下载编码结果

## 🔧 技术架构

### 前端技术栈
- **Next.js 14**: React全栈框架
- **TypeScript**: 类型安全的JavaScript
- **Tailwind CSS**: 实用优先的CSS框架
- **Radix UI**: 无障碍的UI组件库
- **Lucide React**: 现代图标库

### AI集成
- **OpenRouter API**: 统一的LLM访问接口
- **GPT-4o-mini**: 主要使用的语言模型
- **智能提示工程**: 优化的提示词设计

### 数据管理
- **LocalStorage**: 客户端数据持久化
- **CSV解析**: 自定义CSV处理逻辑
- **JSON导出**: 结构化数据导出

## 📁 项目结构

```
llm-assisted-deductive-coding/
├── app/                    # Next.js App Router
│   ├── page.tsx           # 首页（文档上传）
│   ├── coding/            # 编码界面
│   │   └── page.tsx       # 编码页面
│   ├── layout.tsx         # 根布局
│   └── globals.css        # 全局样式
├── components/            # React组件
│   ├── ui/               # 基础UI组件
│   ├── multi-code-selector.tsx  # 多代码选择器
│   ├── text-highlighter.tsx     # 文本高亮器
│   ├── coding-stats.tsx         # 编码统计
│   └── export-dialog.tsx        # 导出对话框
├── lib/                   # 工具库
│   ├── api-config.ts      # API配置
│   └── utils.ts           # 通用工具函数
├── hooks/                 # 自定义React Hooks
├── public/                # 静态资源
├── sample-codes.csv       # 示例代码框架
├── sample_text.txt        # 示例文本
└── README.md             # 项目文档
```

## 🔐 安全考虑

### API密钥管理
- 使用环境变量存储敏感信息
- `.env.local` 文件被Git忽略
- 支持生产环境的环境变量配置

### 数据隐私
- 所有数据处理在客户端进行
- 不存储用户上传的敏感文档
- API调用仅用于获取代码建议

## 🛠️ 开发指南

### 添加新的代码框架
1. 创建CSV文件，包含`code`和`definition`列
2. 在`app/page.tsx`中更新文件类型验证
3. 测试CSV解析功能

### 自定义AI模型
1. 在`lib/api-config.ts`中配置新的API端点
2. 在`components/multi-code-selector.tsx`中更新模型参数
3. 调整提示词以适应新模型

### 扩展导出格式
1. 在`components/export-dialog.tsx`中添加新格式
2. 实现相应的数据转换逻辑
3. 更新UI以支持新格式选择

## 📝 示例数据

### 代码框架示例 (sample-codes.csv)
```csv
code,definition
Leadership,References to leadership behaviors and qualities
Collaboration,Instances of teamwork and cooperation
Innovation,Creative problem-solving and new ideas
Communication,Effective information sharing and dialogue
Problem Solving,Analytical thinking and solution development
Decision Making,Process of choosing between alternatives
Motivation,Factors that drive individual performance
Training,Educational activities and skill development
```

### 文本示例 (sample_text.txt)
包含一个关于领导力和组织文化的完整访谈，涵盖所有代码类别。

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [Next.js](https://nextjs.org/) - React全栈框架
- [OpenRouter](https://openrouter.ai/) - LLM API服务
- [Radix UI](https://www.radix-ui.com/) - 无障碍UI组件
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架

## 📞 联系方式

- 项目链接: [https://github.com/Yingna0614/llm-assisted-deductive-coding](https://github.com/Yingna0614/llm-assisted-deductive-coding)
- 问题反馈: [Issues](https://github.com/Yingna0614/llm-assisted-deductive-coding/issues)

---

**注意**: 使用本平台前请确保您有有效的OpenRouter API密钥，并遵守相关的使用条款和隐私政策。
