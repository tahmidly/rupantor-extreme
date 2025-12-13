# হিজাব স্টোর | Bengali Hijab Store

A complete e-commerce website for selling hijabs to Bangladeshi customers, built with Next.js, Firebase Authentication, Neon PostgreSQL, and Cloudinary.

## Features

- **Bengali Language Support** - Full Bengali and English bilingual support
- **Firebase Authentication** - Secure user authentication with email/password
- **Product Search** - Search products by name in Bengali or English
- **Product Management** - Admin dashboard for adding, editing, and deleting products
- **Cloudinary Integration** - Image upload and management
- **Neon Database** - PostgreSQL database for storing products and users
- **Admin Protection** - Only admin users can access the dashboard
- **Responsive Design** - Mobile-first design with beautiful UI

## Setup Instructions

### 1. Environment Variables

Add these environment variables to your Vercel project via the **"Vars"** section in the v0 sidebar:

#### Firebase (Required)

**Get these from Firebase Console:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project → Click gear icon → Project settings
3. Under "General" tab, scroll to "Your apps" section
4. Copy the config values:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
FIREBASE_PROJECT_ID=your_project_id
\`\`\`

**Get Firebase Private Key (Service Account):**
1. In Firebase Console → Project Settings
2. Go to **"Service accounts"** tab
3. Click **"Generate new private key"** button
4. Download the JSON file
5. Open the JSON file and copy these values:

\`\`\`
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
\`\`\`

\`\`\`
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n
\`\`\`

**Important:** For `FIREBASE_PRIVATE_KEY`:
- Copy the ENTIRE value from the JSON including `-----BEGIN PRIVATE KEY-----` and `-----END PRIVATE KEY-----`
- Keep the `\n` characters exactly as they appear (don't replace with actual line breaks)
- The value should look like one long string with `\n` in it

#### Cloudinary (Required)

1. Go to [Cloudinary](https://cloudinary.com/) and create a free account
2. Go to **Settings → Upload**
3. Create an **unsigned upload preset**
4. Copy these values from your dashboard:

\`\`\`
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
\`\`\`

#### Neon Database (Already configured)
Your Neon database is already connected via the integration.

### 2. Run Database Migration

The SQL script in `scripts/001_create_tables.sql` needs to be executed to create the necessary tables. You can run it directly from v0.

### 3. Enable Firebase Authentication

1. Go to Firebase Console → Authentication
2. Click "Get started" if not already enabled
3. Go to "Sign-in method" tab
4. Enable **Email/Password** provider
5. Save

### 4. Make Your First Admin User

After signing up, you need to manually set your user as admin:

1. Sign up through the website at `/sign-in`
2. Find your Firebase UID in Firebase Console → Authentication → Users
3. Run this SQL query in your Neon dashboard:

\`\`\`sql
UPDATE users SET is_admin = true WHERE firebase_uid = 'your-firebase-uid';
\`\`\`

## Usage

- **Public Site**: Browse and search products at the homepage
- **Product Details**: Click any product to view full details
- **Admin Dashboard**: Access at `/admin` (requires admin user)
- **Sign In**: Access at `/sign-in` to create account or login

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Database**: Neon PostgreSQL
- **Authentication**: Firebase Auth
- **Image Storage**: Cloudinary
- **UI**: Tailwind CSS + shadcn/ui
- **Fonts**: Noto Sans Bengali for Bengali text support
