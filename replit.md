# 24kamera.uz - Smart Camera and Electronics Platform

## Overview

24kamera.uz is a comprehensive e-commerce platform specializing in security cameras, solar panels, and electronic systems. The application serves the Uzbekistan market with multilingual support (Uzbek, Russian, English) and features an AI-powered assistant called Jarvis for customer support and product recommendations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React Query for server state, React Context for client state
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Runtime**: Node.js with Express.js REST API
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Session Management**: Express sessions with PostgreSQL store
- **AI Integration**: Dual AI provider support (OpenAI GPT-4o and X.AI Grok-2)

### Monorepo Structure
```
├── client/          # React frontend application
├── server/          # Express.js backend API
├── shared/          # Shared TypeScript schemas and types
├── migrations/      # Database migration files
└── attached_assets/ # Static assets and brand logos
```

## Key Components

### Database Schema
The application uses PostgreSQL with Drizzle ORM for type-safe database operations:
- **Users**: Authentication and user management
- **Products**: Product catalog with categories, brands, and features
- **Cart Items**: Session-based shopping cart functionality
- **Chat Messages**: AI assistant conversation history
- **Articles**: News and blog content management
- **Advertisements**: Dynamic promotional content
- **Masters**: Service provider directory with regional filtering
- **Password Recovery Brands**: Brand-specific technical support contacts

### AI Assistant (Jarvis)
- Primary integration with OpenAI GPT-4o for customer support
- Secondary integration with X.AI Grok-2 for specialized camera recommendations
- Multilingual support for Uzbek, Russian, and English
- Context-aware responses for security camera and electronics expertise
- Session-based conversation history

### E-commerce Features
- Product catalog with advanced filtering by category and brand
- Shopping cart with session persistence
- Multi-brand support (Hikvision, Dahua, HiLook, HiWatch, EZVIZ, Imou, TP-Link, TVT)
- Dynamic product image mapping based on model numbers
- Price formatting and inventory management

### Content Management
- Dynamic advertisements with carousel display
- News/articles system for company updates
- Service provider (masters) directory with regional filtering
- Brand-specific technical support contact system

## Data Flow

### Client-Server Communication
1. Frontend makes API requests to Express.js backend
2. Backend validates requests and interacts with PostgreSQL database
3. Drizzle ORM provides type-safe database operations
4. Response data flows back through React Query for state management

### AI Integration Flow
1. User sends chat message to Jarvis
2. Backend routes to appropriate AI provider (OpenAI or X.AI)
3. AI response is processed and stored in chat history
4. Frontend displays conversation with typing indicators

### Session Management
- Session-based cart persistence without requiring user authentication
- PostgreSQL session store for scalability
- Cross-request state maintenance for shopping experience

## External Dependencies

### Core Dependencies
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle with automatic migrations
- **UI Components**: Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with PostCSS processing
- **State Management**: TanStack React Query for server state

### AI Services
- **OpenAI API**: Primary AI assistant using GPT-4o model
- **X.AI API**: Secondary AI for specialized camera recommendations using Grok-2

### Development Tools
- **TypeScript**: Full-stack type safety
- **ESBuild**: Production bundling for server code
- **Vite**: Development server with HMR and build optimization

## Deployment Strategy

### Environment Configuration
- Development: Local development with Vite dev server and tsx
- Production: Built static assets served by Express with ESBuild bundling
- Database: PostgreSQL with SSL support in production

### Build Process
1. Frontend: Vite builds React app to `dist/public`
2. Backend: ESBuild bundles server code to `dist/index.js`
3. Database: Drizzle migrations applied automatically

### Hosting Platform
- **Platform**: Replit with autoscale deployment
- **Port Configuration**: Internal port 5000, external port 80
- **Asset Management**: Static assets served from build directory

## Changelog

```
Changelog:
- June 13, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```