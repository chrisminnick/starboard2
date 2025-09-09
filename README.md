# Starboard Write - MVP

A web application for writers with AI-powered editorial advisors built on the MERN stack.

## Features

### ✅ Implemented in MVP

- **User Authentication** - Registration, login with 7-day free trial
- **Project Management** - Create, edit, delete writing projects
- **Rich Text Editor** - Professional writing environment with formatting tools
- **AI Advisors** - Three specialized AI assistants:
  - **Editor** - Story structure, narrative flow, character development
  - **Copy Editor** - Grammar, style, clarity, technical writing aspects
  - **Reader** - Audience perspective, engagement, accessibility
- **Interactive Features**:
  - Real-time chat with advisors
  - Structured feedback generation
  - Inline comments (planned)
- **Autosave & Versioning** - Automatic saving with version history
- **Export Options** - Export to Markdown and text formats
- **Templates** - Pre-configured setups for novels, blog posts, research papers, screenplays
- **Word Count Tracking** - Real-time word count with goal tracking
- **Responsive Design** - Works on desktop, tablet, and mobile

### 🚧 Future Enhancements (Post-MVP)

- Collaboration between multiple writers
- Expanded advisor roles (research assistant, agent, illustrator)
- Cloud storage and sync
- Multi-language advisor support
- Model selection per advisor role
- PDF and DOCX export
- Advanced inline commenting system
- Plugin integration with external platforms

## Tech Stack

### Backend

- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Rate Limiting** for API protection
- **Helmet** for security headers

### Frontend

- **React 18** with functional components and hooks
- **React Router** for navigation
- **React Quill** for rich text editing
- **Axios** for API communication
- **Lucide React** for icons
- **React Hot Toast** for notifications

### AI Integration

- Mock AI responses (ready for OpenAI integration)
- Configurable advisor personalities and prompts
- Structured feedback system

## Project Structure

```
starboard-write/
├── server/                 # Backend API
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth & validation middleware
│   ├── services/          # AI service & business logic
│   └── server.js          # Express server setup
├── client/                # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── contexts/      # React context providers
│   │   └── App.js         # Main app component
│   └── public/            # Static assets
└── README.md              # This file
```

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Backend Setup

1. **Navigate to server directory:**

   ```bash
   cd server
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment setup:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration:

   ```env
   NODE_ENV=development
   PORT=5001
   CLIENT_URL=http://localhost:3000
   MONGODB_URI=mongodb://localhost:27017/starboard-write
   JWT_SECRET=your_jwt_secret_key
   OPENAI_API_KEY=your_openai_api_key_here  # Optional for MVP
   ```

4. **Start the server:**

   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

### Frontend Setup

1. **Navigate to client directory:**

   ```bash
   cd client
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:5001

## Usage Guide

### Getting Started

1. **Register an Account**

   - Visit http://localhost:3000
   - Click "Create Account"
   - Fill in your details to start your 7-day free trial

2. **Create Your First Project**

   - Click "Start New Project" from the dashboard
   - Choose a template (Novel, Blog Post, Research Paper, Screenplay)
   - Fill in project details and word count goal
   - Click "Create Project"

3. **Writing Environment**

   - Use the rich text editor to write your content
   - Content auto-saves every 2 seconds
   - Word count updates in real-time
   - Export your work using the Download button

4. **Work with AI Advisors**
   - **Chat Tab**: Have conversations with your chosen advisor
   - **Feedback Tab**: Get structured analysis of your writing
   - Switch between Editor, Copy Editor, and Reader advisors
   - Each advisor has specialized knowledge and personality

### AI Advisor Roles

- **Editor**: Focuses on story structure, character development, pacing, and narrative flow
- **Copy Editor**: Reviews grammar, spelling, style consistency, and technical writing aspects
- **Reader**: Provides feedback from target audience perspective on engagement and clarity

## API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/preferences` - Update user preferences

### Projects

- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get specific project
- `PATCH /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `GET /api/projects/:id/export/:format` - Export project

### AI Advisors

- `POST /api/advisors/:projectId/chat` - Chat with advisor
- `POST /api/advisors/:projectId/feedback` - Get structured feedback
- `POST /api/advisors/:projectId/comment` - Add inline comment
- `GET /api/advisors/:projectId/interactions` - Get advisor interactions

## Development

### Running Tests

```bash
# Backend tests
cd server && npm test

# Frontend tests
cd client && npm test
```

### Code Structure

**Backend Architecture:**

- RESTful API design
- MongoDB with Mongoose schemas
- JWT-based authentication
- Modular route organization
- Service layer for business logic

**Frontend Architecture:**

- Component-based React architecture
- Context API for state management
- Custom hooks for API integration
- Responsive CSS with inline styles
- Real-time features with optimistic updates

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please open an issue in the GitHub repository.

---

**MVP Status**: ✅ Complete and ready for testing
**Next Phase**: Cloud deployment and OpenAI integration
