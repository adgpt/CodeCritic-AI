# CodeCritic-AI

## About

CodeCritic-AI is an intelligent code review assistant that provides instant, AI-powered feedback on your code. Built with modern web technologies, it helps developers identify potential issues, suggest improvements, and maintain high code quality standards.

## Development Approach

This project embraces modern development practices, including the use of AI assistance in its creation. While AI tools were utilized to enhance the development process, all code and features have been carefully reviewed, modified, and validated with human intervention to ensure quality, security, and optimal functionality.

## Features

- Real-time code analysis and feedback with AI-powered insights
- Secure authentication with Google and GitHub OAuth via Supabase
- Modern, intuitive interface built with shadcn-ui and Tailwind CSS
- Code editor with syntax highlighting for common programming languages
- Error and warning detection in code analysis

## Getting Started

### Prerequisites

Before you begin, ensure you have Node.js and npm installed on your system. We recommend using [nvm](https://github.com/nvm-sh/nvm#installing-and-updating) for managing Node.js versions.

### Local Development

Follow these steps to set up the project locally:

```sh
# Step 1: Clone the repository
git clone https://github.com/adgpt/CodeCritic-AI.git

# Step 2: Navigate to the project directory
cd CodeCritic-AI

# Step 3: Install dependencies
npm install

# Step 4: Configure environment variables
cp .env.example .env
# Update .env with your API keys

# Step 5: Start the development server
npm run dev
```

## Environment Configuration

This project requires several environment variables to be set up for proper functionality. Create a `.env` file in the root directory using `.env.example` as a template:

```sh
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

- `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`: Get these from your Supabase project settings
- `VITE_GEMINI_API_KEY`: Obtain from Google AI Studio

## Development Options

### Using Your Preferred IDE

You can work with any IDE of your choice. After cloning the repository, you can make changes and push them directly to the repository.

### Direct GitHub Editing

- Navigate to the desired file(s)
- Click the "Edit" button (pencil icon)
- Make your changes and commit them

## Technology Stack

CodeCritic-AI is built with modern, robust technologies:

- **Vite** - Next Generation Frontend Tooling
- **TypeScript** - For type-safe code
- **React** - UI Component Library
- **shadcn-ui** - Beautiful UI Components
- **Tailwind CSS** - Utility-first CSS Framework

## Deployment

You can deploy this project using popular hosting platforms like:

- Vercel
- Netlify
- GitHub Pages
- AWS Amplify

Each platform offers straightforward deployment processes - choose the one that best fits your needs.

## Contributing

Contributions are welcome! Feel free to submit issues and enhancement requests.

## Future Updates

We are continuously working to enhance CodeCritic-AI. Here are some planned features:

- **User Profile Management** - Personalized settings and preferences for code review experience
- **Code Review History** - Track and manage your code review history and improvements over time
- **Language-Specific Linting** - Custom linting rules and best practices for different programming languages
- **Team Collaboration** - Enhanced features for team-based code reviews and feedback sharing
- **Performance Optimization** - Improved analysis speed and resource utilization
- **Integration Ecosystem** - Support for additional version control systems and IDE plugins
