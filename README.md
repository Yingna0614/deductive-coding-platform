# LLM-Assisted Deductive Coding Platform

An intelligent deductive coding platform integrated with large language models, specifically designed for text coding work in qualitative research. This platform combines traditional deductive coding methods with modern AI technology to provide intelligent code suggestions and efficient coding workflows.

## Demo

Watch this demo video to see the platform in action:

[![Demo Video](https://img.shields.io/badge/📹%20Watch%20Demo-Video%20Tutorial-blue?style=for-the-badge)](https://drive.google.com/file/d/1aF98gdU9aN3VLKR3KpopifQ1b3hZdGwc/view?usp=sharing)

> **Note**: Click the button above to view the complete demonstration of the LLM-Assisted Deductive Coding Platform.


## Core Features

### Multi-format Document Support
- **Text Document Upload**: Supports various formats of text files
- **CSV Code Framework**: Supports uploading CSV files containing code and definition columns
- **Sample Data**: Provides complete sample texts and code frameworks

### AI Intelligent Suggestions
- **OpenRouter Integration**: Uses OpenRouter API to access multiple LLM models
- **Context Awareness**: Provides suggestions based on selected text and surrounding context
- **Code Matching**: Intelligently matches relevant codes from the code framework
- **Explanations**: Provides detailed explanations and confidence scores for each suggestion

### Interactive Coding
- **Text Highlighting**: Intuitive text selection and coding interface
- **Multi-code Selection**: Supports applying multiple codes to the same text segment
- **Real-time Preview**: Instant viewing of coding results and statistics
- **Undo/Redo**: Complete operation history management

### Data Management
- **Coding Statistics**: Real-time display of coding progress and distribution
- **Result Export**: Supports multiple formats for exporting coding results
- **Data Persistence**: Automatically saves coding progress and results

## Quick Start

### Installation Steps

1. **Clone Repository**
```bash
git clone https://github.com/Yingna0614/llm-assisted-deductive-coding.git
cd llm-assisted-deductive-coding
```

2. **Install Dependencies**
```bash
npm install
# or
pnpm install
```

3. **Configure Environment Variables**
Create `.env.local` file:
```bash
NEXT_PUBLIC_OPENROUTER_API_KEY=your_openrouter_api_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SITE_NAME=YourAppName
```

4. **Start Development Server**
```bash
npm run dev
# or
pnpm dev
```

## User Guide

### Step 1: Upload Documents
1. Upload your text document on the homepage (supports .txt, .md, etc.)
2. Upload CSV format code framework file, ensuring it contains the following columns:
   - `code`: Code name
   - `definition`: Code definition

### Step 2: Start Coding
1. Enter the coding interface
2. Select the text segment that needs coding
3. Click "Get AI Suggestions" to get intelligent suggestions
4. Select applicable codes and apply them

### Step 3: Export Results
1. After completing coding, click the export button
2. Select export format (JSON, CSV, etc.)
3. Download coding results

## Technical Architecture

### Frontend Technology Stack
- **Next.js 14**: React full-stack framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI component library
- **Lucide React**: Modern icon library

### AI Integration
- **OpenRouter API**: Unified LLM access interface
- **GPT-4o-mini**: Primary language model used

### Data Management
- **LocalStorage**: Client-side data persistence
- **CSV Parsing**: Custom CSV processing logic
- **JSON Export**: Structured data export

## Project Structure

```
llm-assisted-deductive-coding/
├── app/                    # Next.js App Router
│   ├── page.tsx           # Homepage (Document Upload)
│   ├── coding/            # Coding Interface
│   │   └── page.tsx       # Coding Page
│   ├── layout.tsx         # Root Layout
│   └── globals.css        # Global Styles
├── components/            # React Components
│   ├── ui/               # Base UI Components
│   ├── multi-code-selector.tsx  # Multi-Code Selector
│   ├── text-highlighter.tsx     # Text Highlighter
│   ├── coding-stats.tsx         # Coding Statistics
│   └── export-dialog.tsx        # Export Dialog
├── lib/                   # Utility Libraries
│   ├── api-config.ts      # API Configuration
│   └── utils.ts           # Common Utility Functions
├── hooks/                 # Custom React Hooks
├── public/                # Static Assets
├── sample-codes.csv       # Sample Code Framework
├── sample_text.txt        # Sample Text
└── README.md             # Project Documentation
```

## Security Considerations

### API Key Management
- Use environment variables to store sensitive information
- `.env.local` file is ignored by Git
- Support for production environment variable configuration

### Data Privacy
- All data processing is performed on the client side
- Sensitive documents uploaded by users are not stored
- API calls are only used to obtain code suggestions

## Development Guide

### Adding New Code Frameworks
1. Create CSV file containing `code` and `definition` columns
2. Update file type validation in `app/page.tsx`
3. Test CSV parsing functionality

### Customizing AI Models
1. Configure new API endpoints in `lib/api-config.ts`
2. Update model parameters in `components/multi-code-selector.tsx`
3. Adjust prompts to adapt to new models

### Extending Export Formats
1. Add new formats in `components/export-dialog.tsx`
2. Implement corresponding data conversion logic
3. Update UI to support new format selection

## Sample Data

### Code Framework Example (sample-codes.csv)
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

### Text Example (sample_text.txt)
Contains a complete interview about leadership and organizational culture, covering all code categories.


## Contact

- Project Link: [https://github.com/Yingna0614/llm-assisted-deductive-coding](https://github.com/Yingna0614/llm-assisted-deductive-coding)
- Issue Reports: [Issues](https://github.com/Yingna0614/llm-assisted-deductive-coding/issues)

---

**Note**: Please ensure you have a valid OpenRouter API key before using this platform and comply with relevant terms of use and privacy policies.
