# Course Platform

A comprehensive learning management system built with Next.js, featuring course creation, enrollment, progress tracking, and payment processing.

## 🚀 Features

### Admin Features
- **Dashboard**: Overview of courses, users, sales, and revenue metrics
- **Course Management**: Create, edit, and organize courses with sections and lessons
- **Content Management**: Upload videos, manage lesson content, and set access permissions
- **Sales Analytics**: Track revenue, customer data, and purchase history
- **User Management**: Role-based access control (Admin/User)

### Student Features
- **Course Catalog**: Browse and discover available courses
- **Enrollment System**: Enroll in courses and track progress
- **Video Learning**: Stream course videos with lesson completion tracking
- **Progress Tracking**: Visual progress indicators and completion status
- **Purchase History**: View transaction history and access purchased content
- **Personal Dashboard**: "My Courses" section with learning progress

### Technical Features
- **Authentication**: Secure user authentication with Clerk
- **Database**: MongoDB with Prisma ORM
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Form Validation**: React Hook Form with Zod schema validation
- **UI Components**: Modern UI with Radix UI and shadcn/ui
- **Real-time Updates**: Optimistic updates and real-time data synchronization

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js 18+ installed
- MongoDB database (local or cloud)
- Clerk account for authentication
- npm or yarn package manager

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd course-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="your-mongodb-connection-string"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
   CLERK_SECRET_KEY="your-clerk-secret-key"
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── (consumers)/       # Student-facing pages
│   ├── admin/             # Admin dashboard and management
│   └── api/               # API routes
├── components/            # Reusable UI components
│   └── ui/               # shadcn/ui components
├── features/             # Feature-based modules
│   ├── courses/          # Course management
│   ├── products/         # Product management
│   └── schemas/          # Zod validation schemas
├── lib/                  # Utility functions
├── permissions/          # Access control logic
├── services/            # External service integrations
└── types/               # TypeScript type definitions
```

## 🗄️ Database Schema

The application uses the following main models:

- **User**: User accounts with role-based access
- **Course**: Course information and metadata
- **CourseSection**: Course sections for organization
- **Lesson**: Individual lessons with video content
- **Product**: Purchasable products linked to courses
- **Purchase**: Transaction records
- **UserCourseAccess**: Enrollment tracking
- **UserLessonComplete**: Progress tracking

## 🚦 Usage

### For Administrators

1. **Access Admin Panel**: Navigate to `/admin` (requires admin role)
2. **Create Courses**: Use the course creation form to add new courses
3. **Manage Content**: Add sections and lessons to your courses
4. **Monitor Sales**: View analytics and customer data in the sales dashboard

### For Students

1. **Browse Courses**: Explore available courses on the homepage
2. **Enroll**: Click on courses to view details and enroll
3. **Learn**: Access course content and track your progress
4. **Track Progress**: Monitor completion status in "My Courses"

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 UI Components

This project uses shadcn/ui components built on top of Radix UI:

- Forms with validation
- Data tables
- Progress indicators
- Alert dialogs
- Cards and layouts
- Navigation components

## 🔐 Authentication & Authorization

- **Authentication**: Handled by Clerk with support for multiple providers
- **Authorization**: Role-based access control (Admin/User)
- **Protected Routes**: Middleware protection for admin and user-specific pages

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues on GitHub
2. Create a new issue with detailed information
3. Provide steps to reproduce any bugs

## 🔮 Future Enhancements

- Payment integration (Stripe)
- Advanced analytics dashboard
- Course certificates
- Discussion forums
- Mobile app
- Offline content download
- Multi-language support

---

**Built with ❤️ using Next.js and modern web technologies**
