# Learning Management System - Design Document

## Table of Contents
1. [System Overview](#system-overview)
2. [Architecture](#architecture)
3. [Technology Stack](#technology-stack)
4. [Data Models](#data-models)
5. [API Design](#api-design)
6. [Frontend Architecture](#frontend-architecture)
7. [Authentication & Authorization](#authentication--authorization)
8. [Payment Integration](#payment-integration)
9. [File Management](#file-management)
10. [State Management](#state-management)
11. [Database Design](#database-design)
12. [Security Considerations](#security-considerations)
13. [Deployment](#deployment)
14. [Implementation Guidelines](#implementation-guidelines)

## System Overview

The Learning Management System (LMS) is a full-stack web application that enables teachers to create and manage online courses, and students to enroll, learn, and track their progress. The system supports video content, text-based lessons, quizzes, and progress tracking with a modern, responsive user interface.

### Key Features
- **Course Management**: Teachers can create, edit, and publish courses with rich content
- **Content Types**: Support for text, video, and quiz content types
- **Progress Tracking**: Real-time progress tracking for students
- **Payment Processing**: Integrated Stripe payment system
- **User Management**: Role-based access control (teachers vs students)
- **File Management**: Video upload and storage via AWS S3
- **Responsive Design**: Modern UI with dark theme support

## Architecture

The system follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   External      │
│   (Next.js)     │◄──►│   (Express.js)  │◄──►│   Services      │
│                 │    │                 │    │                 │
│ - React 19      │    │ - Node.js       │    │ - AWS DynamoDB  │
│ - TypeScript    │    │ - TypeScript    │    │ - AWS S3        │
│ - Tailwind CSS  │    │ - Dynamoose     │    │ - CloudFront    │
│ - Redux Toolkit │    │ - Clerk Auth    │    │ - Stripe        │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Architecture Principles
- **Separation of Concerns**: Clear boundaries between frontend and backend
- **Scalability**: Serverless-ready architecture with AWS services
- **Security**: Authentication at every layer with proper authorization
- **Performance**: Optimized for video streaming and real-time updates

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS with custom design system
- **State Management**: Redux Toolkit with RTK Query
- **Authentication**: Clerk
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Radix UI primitives with custom styling
- **Video Player**: React Player
- **File Upload**: FilePond
- **Drag & Drop**: @hello-pangea/dnd
- **Notifications**: Sonner
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: AWS DynamoDB with Dynamoose ODM
- **Authentication**: Clerk Express middleware
- **File Storage**: AWS S3 with CloudFront CDN
- **Payment Processing**: Stripe
- **Validation**: Built-in validation with error handling
- **Security**: Helmet, CORS, Morgan logging

### External Services
- **Authentication**: Clerk (user management, auth flows)
- **Database**: AWS DynamoDB (NoSQL database)
- **File Storage**: AWS S3 (video and image storage)
- **CDN**: CloudFront (content delivery)
- **Payments**: Stripe (payment processing)
- **Deployment**: AWS Lambda (serverless functions)

## Data Models

### 1. Course Model
```typescript
interface Course {
  courseId: string;           // Primary key (UUID)
  teacherId: string;          // Clerk user ID of teacher
  teacherName: string;        // Display name of teacher
  title: string;              // Course title
  description?: string;       // Course description
  category: string;           // Course category
  image?: string;             // Course thumbnail URL
  price?: number;             // Price in cents (e.g., 4999 = $49.99)
  level: "Beginner" | "Intermediate" | "Advanced";
  status: "Draft" | "Published";
  sections: Section[];        // Course content sections
  enrollments?: Array<{       // Student enrollments
    userId: string;
  }>;
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
}
```

### 2. Section Model
```typescript
interface Section {
  sectionId: string;          // UUID
  sectionTitle: string;       // Section title
  sectionDescription?: string; // Section description
  chapters: Chapter[];        // Chapters within section
}
```

### 3. Chapter Model
```typescript
interface Chapter {
  chapterId: string;          // UUID
  title: string;              // Chapter title
  content: string;            // Text content
  video?: string;             // Video URL (S3/CloudFront)
  type: "Text" | "Quiz" | "Video";
  comments?: Comment[];       // Student comments
}
```

### 4. User Course Progress Model
```typescript
interface UserCourseProgress {
  userId: string;             // Primary key (Clerk user ID)
  courseId: string;           // Range key (course ID)
  enrollmentDate: string;     // ISO timestamp
  overallProgress: number;    // Percentage (0-100)
  sections: SectionProgress[]; // Progress per section
  lastAccessedTimestamp: string; // ISO timestamp
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
}
```

### 5. Transaction Model
```typescript
interface Transaction {
  userId: string;             // Primary key
  transactionId: string;      // Range key (UUID)
  dateTime: string;           // ISO timestamp
  courseId: string;           // Course purchased
  paymentProvider: "stripe";  // Payment method
  amount: number;             // Amount in cents
  createdAt: string;          // ISO timestamp
  updatedAt: string;          // ISO timestamp
}
```

## API Design

### Base URL Structure
```
Production: https://api.example.com
Development: http://localhost:3000
```

### Authentication
All protected endpoints require a valid Clerk JWT token in the Authorization header:
```
Authorization: Bearer <clerk-jwt-token>
```

### API Endpoints

#### Course Management
```
GET    /courses                    # List all courses (public)
GET    /courses/:courseId          # Get specific course (public)
POST   /courses                    # Create new course (teacher only)
PUT    /courses/:courseId          # Update course (owner only)
DELETE /courses/:courseId          # Delete course (owner only)
POST   /courses/:courseId/sections/:sectionId/chapters/:chapterId/get-upload-url  # Get S3 upload URL
```

#### User Management
```
PUT    /users/clerk/:userId        # Update user profile
```

#### Course Progress
```
GET    /users/course-progress/:userId/enrolled-courses     # Get user's enrolled courses
GET    /users/course-progress/:userId/courses/:courseId    # Get course progress
PUT    /users/course-progress/:userId/courses/:courseId    # Update course progress
```

#### Transactions
```
GET    /transactions               # List transactions (user's own)
POST   /transactions               # Create transaction
POST   /transactions/stripe/payment-intent  # Create Stripe payment intent
```

### Response Format
All API responses follow a consistent format:
```typescript
{
  message: string;     // Success/error message
  data?: any;          // Response data (if successful)
  error?: any;         // Error details (if failed)
}
```

## Frontend Architecture

### Directory Structure
```
client/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (dashboard)/       # Protected dashboard routes
│   │   ├── teacher/       # Teacher-specific routes
│   │   └── user/          # Student-specific routes
│   ├── (nondashboard)/    # Public pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── providers.tsx      # Context providers
├── components/            # Reusable components
│   ├── ui/               # Base UI components (Radix)
│   └── *.tsx             # Custom components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
├── state/                # Redux store and API
└── types/                # TypeScript type definitions
```

### Routing Structure
```
/                           # Landing page
/sign-in                    # Authentication
/sign-up                    # Registration
/teacher/courses            # Teacher dashboard
/teacher/courses/[id]       # Course editor
/teacher/profile            # Teacher profile
/teacher/settings           # Teacher settings
/teacher/billing            # Teacher billing
/user/courses               # Student dashboard
/user/courses/[courseId]    # Course viewer
/user/courses/[courseId]/chapters/[chapterId]  # Chapter viewer
/user/profile               # Student profile
/user/settings              # Student settings
/user/billing               # Student billing
```

### Component Architecture

#### Core Components
1. **Layout Components**
   - `AppSidebar`: Navigation sidebar with role-based menu
   - `Navbar`: Top navigation bar
   - `Header`: Page headers with titles and actions

2. **Course Management**
   - `CourseEditor`: Main course editing interface
   - `DroppableComponent`: Drag-and-drop section/chapter management
   - `ChapterModal`: Chapter creation/editing modal
   - `SectionModal`: Section creation/editing modal

3. **Course Viewing**
   - `ChaptersSidebar`: Course navigation sidebar
   - `CourseViewer`: Main course content viewer
   - `VideoPlayer`: Video content player with progress tracking

4. **UI Components**
   - `CustomFormField`: Reusable form field component
   - `CourseCard`: Course display card
   - `TeacherCourseCard`: Teacher-specific course card
   - `Loading`: Loading state component

### State Management

#### Redux Store Structure
```typescript
{
  global: {
    courseEditor: {
      sections: Section[];
      isChapterModalOpen: boolean;
      isSectionModalOpen: boolean;
      selectedSectionIndex: number | null;
      selectedChapterIndex: number | null;
    }
  },
  api: {
    // RTK Query cache and state
  }
}
```

#### RTK Query API Slices
- **Courses**: CRUD operations for course management
- **User Progress**: Course progress tracking
- **Transactions**: Payment and enrollment management
- **User Management**: Profile updates

## Authentication & Authorization

### Authentication Flow
1. **User Registration**: Clerk handles user registration with email/password
2. **User Types**: Users are categorized as "teacher" or "student" via Clerk metadata
3. **JWT Tokens**: Clerk provides JWT tokens for API authentication
4. **Session Management**: Clerk manages user sessions and token refresh

### Authorization Rules
- **Public Access**: Course browsing, authentication pages
- **Teacher Access**: Course creation, editing, deletion (own courses only)
- **Student Access**: Course enrollment, progress tracking, course viewing
- **Admin Access**: System-wide management (future enhancement)

### Role-Based Routing
```typescript
// Middleware checks user type and redirects accordingly
const userType = user.publicMetadata.userType;
if (userType === 'teacher') {
  // Redirect to teacher dashboard
} else if (userType === 'student') {
  // Redirect to student dashboard
}
```

## Payment Integration

### Stripe Integration
1. **Payment Intent Creation**: Server creates Stripe payment intent
2. **Client-Side Payment**: Frontend handles payment with Stripe Elements
3. **Webhook Handling**: Server processes payment confirmations
4. **Enrollment Creation**: Successful payment triggers course enrollment

### Payment Flow
```
1. User selects course → 2. Payment intent created → 3. Payment processed
4. Transaction recorded → 5. User enrolled → 6. Progress initialized
```

### Transaction Management
- All transactions are recorded in DynamoDB
- Payment amounts stored in cents for precision
- Support for multiple payment providers (currently Stripe only)
- Automatic enrollment upon successful payment

## File Management

### Video Upload Process
1. **Upload URL Generation**: Server generates pre-signed S3 URLs
2. **Direct Upload**: Frontend uploads directly to S3
3. **CDN Distribution**: CloudFront serves video content
4. **Progress Tracking**: Upload progress shown to users

### File Storage Structure
```
S3 Bucket/
├── videos/
│   └── {unique-id}/
│       └── {filename}.mp4
├── images/
│   └── courses/
│       └── {course-id}.jpg
└── thumbnails/
    └── {course-id}.jpg
```

### Supported File Types
- **Videos**: MP4, M3U8 (HLS), MPD (DASH)
- **Images**: JPG, PNG, WebP
- **Documents**: PDF (future enhancement)

## State Management

### Redux Toolkit Implementation
```typescript
// Store configuration
const store = configureStore({
  reducer: {
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
```

### RTK Query Features
- **Automatic Caching**: Intelligent cache management
- **Optimistic Updates**: Immediate UI updates
- **Background Refetching**: Automatic data synchronization
- **Error Handling**: Centralized error management
- **Loading States**: Built-in loading state management

### Custom Hooks
- `useCourseProgressData`: Course progress management
- `useUploadVideo`: Video upload handling
- `useAuth`: Authentication state management

## Database Design

### DynamoDB Schema Design

#### Primary Keys
- **Course**: `courseId` (String, Hash Key)
- **UserCourseProgress**: `userId` (String, Hash Key) + `courseId` (String, Range Key)
- **Transaction**: `userId` (String, Hash Key) + `transactionId` (String, Range Key)

#### Global Secondary Indexes
- **CourseTransactionsIndex**: For querying transactions by course
- **UserEnrollmentsIndex**: For querying user enrollments (future)

#### Data Access Patterns
1. **Get Course by ID**: Direct get with courseId
2. **List All Courses**: Scan operation with optional filtering
3. **Get User Progress**: Query with userId + courseId
4. **List User Courses**: Query with userId
5. **Get Transactions**: Query with userId or courseId

### Data Consistency
- **Eventual Consistency**: DynamoDB's default consistency model
- **Strong Consistency**: Used for critical operations (payments, enrollments)
- **Batch Operations**: Used for bulk data operations

## Security Considerations

### Authentication Security
- **JWT Validation**: All API requests validate Clerk JWT tokens
- **Token Expiration**: Automatic token refresh handling
- **CORS Configuration**: Proper CORS setup for cross-origin requests

### Data Security
- **Input Validation**: Zod schemas validate all inputs
- **SQL Injection Prevention**: Dynamoose ORM prevents injection attacks
- **XSS Prevention**: React's built-in XSS protection
- **CSRF Protection**: JWT tokens provide CSRF protection

### File Security
- **Pre-signed URLs**: Temporary, secure upload URLs
- **File Type Validation**: Server-side file type checking
- **Access Control**: CloudFront signed URLs for private content (future)

### API Security
- **Rate Limiting**: Implement rate limiting for API endpoints
- **Request Validation**: All requests validated against schemas
- **Error Handling**: Secure error messages without sensitive data exposure

## Deployment

### Environment Configuration
```bash
# Frontend Environment Variables
NEXT_PUBLIC_API_BASE_URL=https://api.example.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_...

# Backend Environment Variables
CLERK_SECRET_KEY=sk_...
STRIPE_SECRET_KEY=sk_...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
S3_BUCKET_NAME=...
CLOUDFRONT_DOMAIN=...
```

### Deployment Architecture
```
Frontend: Vercel/Netlify
Backend: AWS Lambda + API Gateway
Database: AWS DynamoDB
Storage: AWS S3 + CloudFront
Authentication: Clerk
Payments: Stripe
```

### CI/CD Pipeline
1. **Code Push**: Trigger build on main branch
2. **Testing**: Run unit and integration tests
3. **Build**: Build frontend and backend
4. **Deploy**: Deploy to staging/production
5. **Health Check**: Verify deployment success

## Implementation Guidelines

### Development Setup

#### Prerequisites
- Node.js 18+
- AWS Account with DynamoDB, S3, CloudFront
- Clerk Account for authentication
- Stripe Account for payments

#### Installation Steps
```bash
# Clone repository
git clone <repository-url>
cd learning-management

# Install dependencies
cd client && npm install
cd ../server && npm install

# Environment setup
cp .env.example .env
# Configure environment variables

# Start development servers
# Terminal 1: Frontend
cd client && npm run dev

# Terminal 2: Backend
cd server && npm run dev
```

### Code Standards

#### TypeScript Configuration
- Strict mode enabled
- No implicit any
- Proper type definitions for all interfaces
- Consistent naming conventions

#### Component Guidelines
- Functional components with hooks
- Props interface definitions
- Proper error boundaries
- Accessibility considerations

#### API Guidelines
- Consistent error handling
- Proper HTTP status codes
- Input validation with Zod
- Comprehensive logging

### Testing Strategy

#### Frontend Testing
- Unit tests for components
- Integration tests for user flows
- E2E tests for critical paths
- Visual regression testing

#### Backend Testing
- Unit tests for controllers
- Integration tests for API endpoints
- Database testing with test data
- Load testing for performance

### Performance Optimization

#### Frontend
- Code splitting with Next.js
- Image optimization
- Lazy loading for components
- Memoization for expensive operations

#### Backend
- Database query optimization
- Caching strategies
- CDN utilization
- Serverless function optimization

### Monitoring and Logging

#### Application Monitoring
- Error tracking with Sentry
- Performance monitoring
- User analytics
- API usage metrics

#### Infrastructure Monitoring
- AWS CloudWatch metrics
- DynamoDB performance monitoring
- S3 access logs
- CloudFront analytics

This design document provides a comprehensive blueprint for implementing the Learning Management System. The architecture is scalable, secure, and follows modern web development best practices. The modular design allows for easy maintenance and future enhancements.
