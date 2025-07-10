# Flow AI - AI-Powered Task Management App

[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue)](https://github.com/atharva-patil-23/FlowAI)

An intelligent task management application that leverages AI to revolutionize how teams organize, prioritize, and collaborate on projects. Built with the MERN stack and integrated with OpenAI's powerful API for smart task assistance.

## 🚀 Features

### 🤖 AI-Powered Task Management

- **Intelligent Task Suggestions**: Get AI-generated task recommendations based on project context
- **Smart Prioritization**: Automatic task ranking using AI analysis of urgency and importance
- **AI-Driven Categorization**: Automatically organize tasks into relevant categories
- **Deadline Prediction**: Smart deadline suggestions based on task complexity and historical data
- **Workflow Optimization**: AI-powered suggestions for improving team productivity

### 🔄 Real-Time Collaboration

- **Live Updates**: See changes instantly as team members update tasks
- **Multi-User Support**: Concurrent editing and collaboration capabilities
- **Shared Projects**: Seamless project sharing across team members
- **Real-Time Notifications**: Stay updated on project changes and deadlines

### 📊 Smart Dashboard

- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI Components**: Clean, intuitive interface built with React
- **Task Analytics**: Visual insights into productivity and task completion
- **Progress Tracking**: Real-time project progress monitoring

### 🎯 Enhanced Productivity

- **Intelligent Descriptions**: AI-generated task descriptions and context
- **Time Estimates**: Smart time prediction for task completion
- **Task Dependencies**: Manage complex project relationships
- **Priority Matrix**: Visual task prioritization system

## 🛠️ Tech Stack

### Frontend

- **React.js** - Modern UI library for building interactive interfaces
- **Modern UI Components** - Responsive and accessible design system
- **Socket.IO Client** - Real-time communication

### Backend

- **Node.js** - Server-side JavaScript runtime
- **Express.js** - Web application framework
- **Socket.IO** - Real-time bidirectional communication
- **OpenAI API** - AI-powered features and intelligence

### Database

- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling for Node.js

### AI Integration

- **OpenAI GPT Models** - Natural language processing and task intelligence
- **Custom AI Algorithms** - Tailored task prioritization and categorization

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- OpenAI API key

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/atharva-patil-23/FlowAI
   cd flow-ai
   ```

2. **Install dependencies**

   ```bash
   # Install server dependencies
   npm install

   # Install client dependencies
   cd client
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. **Run the application**

   ```bash
   # Run both server and client concurrently
   npm run dev

   # Or run separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

5. **Access the application**
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000`

## 📁 Project Structure

```
flow-ai/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Utility functions
│   └── public/
├── server/                # Node.js backend
│   ├── controllers/       # Request handlers
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   └── utils/            # Server utilities
├── config/               # Configuration files
└── docs/                 # Documentation
```

## 🔧 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Tasks

- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/ai-suggest` - Get AI task suggestions

### Projects

- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact

Your Name - anpatil.1223@gmail.com

Project Link: [https://github.com/atharva-patil-23/FlowAI](https://github.com/atharva-patil-23/FlowAI)

---
