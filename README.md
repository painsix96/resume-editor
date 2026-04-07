# 一页简历 | One-Page Resume

[English](#english) | [中文](#中文)

---

## 中文

### 📝 项目简介

**一页简历**是一个现代化的在线简历编辑器，帮助用户轻松创建专业、美观的单页简历。支持实时预览、多种模块自定义、PDF导出等功能。

### ✨ 核心功能

#### 🎨 简历编辑
- **个人信息管理**：姓名、职位、联系方式、地址等基本信息编辑
- **多模块支持**：个人总结、工作经验、教育背景、技能、项目经验、自定义模块
- **富文本编辑**：支持富文本格式，包括加粗、斜体、列表、链接等
- **模块拖拽排序**：通过拖拽调整模块顺序，灵活组织简历内容
- **实时预览**：编辑内容实时同步到预览区，所见即所得

#### 📄 简历管理
- **多简历支持**：创建、删除、重命名多份简历
- **本地存储**：数据自动保存到浏览器本地存储，无需担心数据丢失
- **智能压缩**：一键智能压缩功能，将简历内容优化到一页

#### 📤 导出功能
- **PDF导出**：一键导出高质量PDF格式简历
- **完美排版**：导出的PDF保持原有排版和样式

#### 🎯 用户体验
- **响应式设计**：完美适配桌面端、平板和手机设备
- **深色编辑区**：专业的深色主题编辑界面
- **直观操作**：简洁明了的操作界面，上手即用

### 🚀 快速开始

#### 在线使用
直接访问：[https://painsix96.github.io/resume-editor/](https://painsix96.github.io/resume-editor/)

#### 本地运行
```bash
# 克隆项目
git clone https://github.com/painsix96/resume-editor.git

# 进入项目目录
cd resume-editor

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 📖 使用指南

#### 1. 创建简历
- 点击"新建简历"按钮创建新的简历
- 在下拉菜单中切换不同的简历
- 使用"重命名"按钮修改简历名称
- 使用"删除简历"按钮删除不需要的简历

#### 2. 编辑内容
- 点击任意模块卡片展开编辑区域
- 填写或修改相应的内容
- 使用富文本编辑器进行格式化
- 点击"保存"按钮保存修改

#### 3. 添加模块
- 点击"新增模块"按钮
- 选择要添加的模块类型：
  - 个人总结
  - 工作经验
  - 教育背景
  - 技能
  - 项目经验
  - 自定义模块

#### 4. 调整顺序
- 收起所有模块（点击模块标题折叠）
- 拖拽模块卡片到目标位置
- 释放鼠标完成排序

#### 5. 导出PDF
- 确认预览区内容无误
- 点击"导出PDF"按钮
- 等待PDF生成并自动下载

#### 6. 智能压缩
- 如果简历内容超过一页
- 点击"智能一页"按钮
- 系统会自动压缩内容到一页

### 💡 使用技巧

1. **定期保存**：虽然系统会自动保存，但建议在重要修改后手动保存
2. **模块命名**：可以自定义模块名称，让简历更具个性化
3. **内容精简**：保持内容简洁，突出重点信息
4. **格式统一**：使用统一的格式和风格，提升专业度
5. **预览检查**：导出前仔细检查预览效果

### 🛠️ 技术栈

- **前端框架**：React 18
- **构建工具**：Vite
- **拖拽功能**：react-dnd
- **富文本编辑**：react-quill
- **PDF导出**：html2pdf.js
- **图标库**：react-icons
- **样式方案**：CSS Variables + Flexbox/Grid

### 📁 项目结构

```
resume-editor/
├── public/              # 静态资源
│   ├── favicon.svg     # 网站图标
│   └── logo.svg        # Logo图标
├── src/                # 源代码
│   ├── App.jsx         # 主应用组件
│   ├── main.jsx        # 应用入口
│   └── index.css       # 全局样式
├── index.html          # HTML模板
├── package.json        # 项目配置
└── vite.config.js      # Vite配置
```

### 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. Fork本项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### 📄 许可证

本项目采用 MIT 许可证

---

## English

### 📝 Introduction

**One-Page Resume** is a modern online resume editor that helps users easily create professional and beautiful single-page resumes. It supports real-time preview, multiple module customization, PDF export, and more.

### ✨ Core Features

#### 🎨 Resume Editing
- **Personal Information Management**: Edit basic information such as name, position, contact details, and address
- **Multiple Module Support**: Personal summary, work experience, education, skills, project experience, and custom modules
- **Rich Text Editing**: Support for rich text formatting including bold, italic, lists, links, etc.
- **Module Drag & Drop Sorting**: Adjust module order by dragging to flexibly organize resume content
- **Real-time Preview**: Edit content syncs to preview area in real-time, what you see is what you get

#### 📄 Resume Management
- **Multiple Resume Support**: Create, delete, and rename multiple resumes
- **Local Storage**: Data automatically saves to browser local storage, no need to worry about data loss
- **Smart Compression**: One-click smart compression to optimize resume content to one page

#### 📤 Export Features
- **PDF Export**: One-click export to high-quality PDF format
- **Perfect Formatting**: Exported PDF maintains original layout and styling

#### 🎯 User Experience
- **Responsive Design**: Perfect adaptation to desktop, tablet, and mobile devices
- **Dark Edit Area**: Professional dark-themed editing interface
- **Intuitive Operation**: Clean and clear operation interface, ready to use immediately

### 🚀 Quick Start

#### Online Usage
Visit directly: [https://painsix96.github.io/resume-editor/](https://painsix96.github.io/resume-editor/)

#### Local Development
```bash
# Clone the project
git clone https://github.com/painsix96/resume-editor.git

# Navigate to project directory
cd resume-editor

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### 📖 User Guide

#### 1. Create Resume
- Click "新建简历" (New Resume) button to create a new resume
- Switch between different resumes in the dropdown menu
- Use "重命名" (Rename) button to modify resume name
- Use "删除简历" (Delete Resume) button to remove unwanted resumes

#### 2. Edit Content
- Click any module card to expand the editing area
- Fill in or modify the corresponding content
- Use the rich text editor for formatting
- Click "保存" (Save) button to save changes

#### 3. Add Modules
- Click "新增模块" (Add Module) button
- Select the module type to add:
  - Personal Summary (个人总结)
  - Work Experience (工作经验)
  - Education (教育背景)
  - Skills (技能)
  - Project Experience (项目经验)
  - Custom Module (自定义模块)

#### 4. Adjust Order
- Collapse all modules (click module title to fold)
- Drag module card to target position
- Release mouse to complete sorting

#### 5. Export PDF
- Confirm preview content is correct
- Click "导出PDF" (Export PDF) button
- Wait for PDF generation and automatic download

#### 6. Smart Compression
- If resume content exceeds one page
- Click "智能一页" (Smart One Page) button
- System will automatically compress content to one page

### 💡 Tips

1. **Regular Saving**: Although the system auto-saves, it's recommended to manually save after important changes
2. **Module Naming**: Customize module names to make your resume more personalized
3. **Content Conciseness**: Keep content concise and highlight key information
4. **Format Consistency**: Use consistent formatting and style to enhance professionalism
5. **Preview Check**: Carefully check preview effect before exporting

### 🛠️ Tech Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite
- **Drag & Drop**: react-dnd
- **Rich Text Editor**: react-quill
- **PDF Export**: html2pdf.js
- **Icon Library**: react-icons
- **Styling**: CSS Variables + Flexbox/Grid

### 📁 Project Structure

```
resume-editor/
├── public/              # Static assets
│   ├── favicon.svg     # Website icon
│   └── logo.svg        # Logo icon
├── src/                # Source code
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Project configuration
└── vite.config.js      # Vite configuration
```

### 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork this project
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

### 📄 License

This project is licensed under the MIT License

---

Made with ❤️ by [painsix96](https://github.com/painsix96)
