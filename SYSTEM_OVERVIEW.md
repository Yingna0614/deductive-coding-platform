# System Architecture Overview

## 🏗️ Overall Architecture

The LLM-assisted deductive coding platform adopts a modern web application architecture, built on Next.js, integrating large language model APIs to provide intelligent text coding solutions for qualitative research.

## 🔄 Workflow

### 1. Document Upload Phase
```
User uploads text document + CSV code framework
           ↓
    File parsing and validation
           ↓
    Data storage to LocalStorage
           ↓
    Navigate to coding interface
```

### 2. Intelligent Coding Phase
```
User selects text segment
           ↓
    Get context information
           ↓
    Call OpenRouter API
           ↓
    Parse AI suggestions
           ↓
    User selects and applies codes
           ↓
    Update coding statistics
```

### 3. Result Export Phase
```
Complete coding work
           ↓
    Generate coding results
           ↓
    Select export format
           ↓
    Download coding file
```

## 🧩 Core Components

### Frontend Component Architecture
```
App Layout
├── Home Page (Document Upload)
│   ├── File Upload Component
│   ├── CSV Parser
│   └── Navigation
└── Coding Page (Coding Interface)
    ├── Text Highlighter
    ├── Multi-Code Selector
    │   ├── Manual Code Selection
    │   ├── AI Suggestions Engine
    │   └── Code Application Logic
    ├── Coding Statistics
    └── Export Dialog
```

### AI Integration Architecture
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

## 🔧 Technology Stack Details

### Frontend Technologies
- **Next.js 14**: Provides SSR/SSG, routing, API routes and other features
- **React 18**: Component-based UI development with Hooks and concurrent features
- **TypeScript**: Provides type safety and reduces runtime errors
- **Tailwind CSS**: Atomic CSS for rapid responsive interface development

### UI Component Library
- **Radix UI**: Provides accessible base components
- **Lucide React**: Modern icon library
- **Custom Components**: Specialized components for coding scenarios

### State Management
- **React Hooks**: useState, useEffect, useRef, etc.
- **LocalStorage**: Client-side data persistence
- **Context API**: Global state management (e.g., themes)

### AI Integration
- **OpenRouter API**: Unified LLM access interface
- **GPT-4o-mini**: Cost-effective language model
- **Custom Prompt Engineering**: Optimized prompts for coding tasks

## 📊 Data Flow

### Input Data
```
Text documents (.txt, .md, .docx)
           ↓
    File API reading
           ↓
    Text content storage
```

```
CSV code framework
           ↓
    Custom CSV parser
           ↓
    Structured code data
```

### Processing Data
```
Selected text + context
           ↓
    Prompt construction
           ↓
    LLM API call
           ↓
    JSON response parsing
           ↓
    Suggestion list generation
```

### Output Data
```
Coding results
           ↓
    Statistical information
           ↓
    Export format conversion
           ↓
    File download
```

## 🔐 Security Architecture

### API Key Management
```
Environment variables (.env.local)
           ↓
    API_CONFIG module
           ↓
    Usage in components
           ↓
    API calls
```

### Data Security
- **Client-side processing**: Sensitive documents are not uploaded to servers
- **Environment isolation**: Development/production environment separation
- **Git ignore**: Sensitive files are not committed to version control

## 🚀 Deployment Architecture

### Development Environment
```
Local development server (npm run dev)
           ↓
    Hot reload + development tools
           ↓
    Local testing
```

### Production Environment
```
Static export (npm run build)
           ↓
    CDN deployment
           ↓
    Environment variable configuration
           ↓
    Production operation
```

## 📈 Performance Optimization

### Frontend Optimization
- **Code splitting**: Next.js automatic code splitting
- **Image optimization**: Next.js Image component
- **CSS optimization**: Tailwind CSS on-demand loading
- **Caching strategy**: LocalStorage caching

### API Optimization
- **Request deduplication**: Avoid duplicate API calls
- **Error handling**: Comprehensive error retry mechanisms
- **Response caching**: Client-side API response caching

## 🔄 Scalability Design

### Modular Architecture
- **Component reusability**: Highly reusable UI components
- **Plugin architecture**: Easily extensible AI model integration
- **Configuration management**: Flexible configuration management system

### Future Extensions
- **Multi-language support**: i18n internationalization
- **Multi-model support**: Integration with more LLM providers
- **Collaboration features**: Multi-user collaborative coding
- **Cloud storage**: Integration with cloud storage services

## 🛠️ Development Toolchain

### Development Tools
- **TypeScript**: Type checking and intelligent suggestions
- **ESLint**: Code quality checking
- **Prettier**: Code formatting
- **Git**: Version control

### Build Tools
- **Next.js**: Built-in build and optimization
- **PostCSS**: CSS processing
- **Webpack**: Module bundling (built into Next.js)

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: React component testing
- **Cypress**: End-to-end testing (optional)

## 📋 Monitoring and Logging

### Development Monitoring
- **Console logging**: Detailed debugging information
- **Error boundaries**: React error handling
- **Performance monitoring**: Development tools integration

### Production Monitoring
- **Error tracking**: Client-side error collection
- **Performance metrics**: Page load times
- **User behavior**: Usage analytics

---

This system architecture design ensures the platform's scalability, maintainability, and user experience, providing a powerful and flexible coding tool for qualitative research.