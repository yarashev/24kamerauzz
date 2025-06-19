# 24kamera.uz - Camera & Electronics E-commerce Platform

## Overview

This is a full-stack e-commerce application for 24kamera.uz, specializing in security cameras, solar panels, and electronic devices. The platform provides a comprehensive solution for selling security equipment with features like AI-powered customer support (Jarvis), product catalog management, cart functionality, master craftsman directory, and password recovery services.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend:

- **Frontend**: React 18 with TypeScript, built using Vite
- **Backend**: Express.js with TypeScript, running on Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS with shadcn/ui components
- **Development Environment**: Replit with auto-deployment

## Key Components

### Frontend Architecture
- **Framework**: React 18 with functional components and hooks
- **State Management**: TanStack React Query for server state, React Context for global state (cart, language)
- **Routing**: Wouter for client-side routing
- **UI Library**: Custom component library built on top of Radix UI primitives
- **Internationalization**: Custom translation system supporting Uzbek, Russian, and English
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Backend Architecture
- **API**: RESTful API built with Express.js
- **Database Layer**: Drizzle ORM with PostgreSQL
- **AI Integration**: 
  - OpenAI GPT-4o for customer support
  - X.AI Grok-2 as alternative AI provider
- **Session Management**: Express sessions with PostgreSQL store
- **File Structure**: Modular approach with separate routes, storage, and database modules

### Database Schema
The application uses PostgreSQL with the following main entities:
- **Users**: Authentication and user management
- **Products**: Product catalog with categories, brands, and features
- **Cart Items**: Shopping cart functionality with session-based storage
- **Chat Messages**: AI chat history storage
- **Articles**: News and blog content
- **Advertisements**: Promotional content management
- **Masters**: Directory of installation specialists
- **Password Recovery Brands**: Brand-specific support information

## Data Flow

1. **Client Requests**: Frontend makes API calls using TanStack React Query
2. **API Processing**: Express.js routes handle requests and validate data
3. **Database Operations**: Drizzle ORM manages database interactions
4. **AI Integration**: Chat requests are processed through OpenAI or Grok APIs
5. **Response Handling**: Data is returned to frontend and cached appropriately

## External Dependencies

### Core Dependencies
- **Drizzle ORM**: Database ORM and migrations
- **OpenAI API**: Primary AI service for Jarvis assistant
- **X.AI Grok API**: Alternative AI service
- **Radix UI**: Headless UI component primitives
- **TanStack React Query**: Server state management
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **ESBuild**: Backend bundling for production
- **TSX**: TypeScript execution for development

## Deployment Strategy

The application is configured for Replit deployment with:

- **Development**: `npm run dev` - Runs Express server with Vite middleware
- **Build**: `npm run build` - Builds frontend and bundles backend
- **Production**: `npm run start` - Serves built application
- **Database**: PostgreSQL provisioned through Replit
- **Auto-scaling**: Configured for Replit's autoscale deployment target

### Environment Configuration
- **Development**: Vite dev server with HMR and error overlay
- **Production**: Optimized builds with static file serving
- **Database Migrations**: Drizzle migrations managed through `npm run db:push`

## Changelog

- June 19, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.