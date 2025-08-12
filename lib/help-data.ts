export interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  lastUpdated: string;
  readTime: number; // minutes
}

export interface Category {
  slug: string;
  title: string;
  description: string;
  icon: string;
  articles: Article[];
}

// Help center data structure
export const helpCategories: Category[] = [
  {
    slug: 'parent-access',
    title: 'Parent Access',
    description: 'Help for parents monitoring student progress',
    icon: '👨‍👩‍👧‍👦',
    articles: [
      {
        slug: 'setup-parent-monitoring',
        title: 'How to Set Up Parent Access',
        description: 'Learn how to grant parent access to your account',
        content: `
# How to Set Up Parent Access

Parent access allows parents or guardians to monitor their child's progress on Financedu.

## Steps to Set Up Parent Access

1. **Go to Account Settings**
   - Click on your profile in the top right
   - Select "Account Settings"

2. **Navigate to Parent Access**
   - Find the "Parent Access" section
   - Click "Add Parent"

3. **Enter Parent Information**
   - Enter your parent's email address
   - Add their name for identification

4. **Send Invitation**
   - Click "Send Invitation"
   - Your parent will receive an email with a link to grant access

5. **Parent Accepts Invitation**
   - Parent clicks "Grant Access" in the email
   - They can now monitor your progress

## What Parents Can See

- Course progress and completion
- Quiz scores and attempts
- Time spent learning
- Learning streaks and achievements

## Security Note

You can revoke parent access at any time from your account settings.
        `,
        lastUpdated: '2025-08-12',
        readTime: 3
      },
      {
        slug: 'parent-dashboard-guide',
        title: 'Understanding the Parent Dashboard',
        description: 'Navigate your child\'s progress and activity',
        content: `
# Understanding the Parent Dashboard

The parent dashboard provides a comprehensive view of your child's learning progress.

## Dashboard Overview

### Progress Summary
- Overall completion percentage
- Current course status
- Recent activity timeline

### Performance Metrics
- Quiz scores and trends
- Areas of strength and improvement
- Time spent learning each day

### Communication Tools
- Message your child's teacher
- View announcements and updates
- Access progress reports

## How to Use the Dashboard

1. **Check Daily Progress**
   - View today's completed activities
   - See time spent learning

2. **Review Performance**
   - Click on any course to see detailed progress
   - Review quiz results and feedback

3. **Stay Connected**
   - Check for teacher messages
   - View upcoming assignments and deadlines

## Privacy and Access

Parent access respects student privacy while providing necessary oversight for educational support.
        `,
        lastUpdated: '2025-08-10',
        readTime: 4
      }
    ]
  },
  {
    slug: 'teacher-invites',
    title: 'Teacher Invitations',
    description: 'Managing teacher invitations and class access',
    icon: '👩‍🏫',
    articles: [
      {
        slug: 'accept-teacher-invite',
        title: 'Accepting a Teacher Invitation',
        description: 'How to join a class as a teacher',
        content: `
# Accepting a Teacher Invitation

When you receive a teacher invitation email, follow these steps to join the class.

## Steps to Accept Invitation

1. **Check Your Email**
   - Look for an email from Financedu
   - Subject: "Invitation to join class [Class Name] as a teacher"

2. **Click the Invitation Link**
   - Click "Accept Invitation" in the email
   - This will open Financedu in your browser

3. **Sign In or Create Account**
   - If you have an account: Sign in normally
   - If you're new: Create a teacher account

4. **Join the Class**
   - Confirm you want to join the class
   - You'll be redirected to your teacher dashboard

## What Happens Next

- You'll have access to the class roster
- You can view student progress
- You can assign activities and track completion
- You can communicate with students and parents

## Troubleshooting

**Invitation Link Not Working?**
- Make sure you're using the latest email
- Try copying and pasting the URL directly
- Contact the class administrator for a new invitation

**Already Have an Account?**
- Make sure you're signed in to the correct account
- The invitation is tied to the email address it was sent to
        `,
        lastUpdated: '2025-08-11',
        readTime: 2
      }
    ]
  },
  {
    slug: 'password-reset',
    title: 'Password & Security',
    description: 'Account security and password management',
    icon: '🔒',
    articles: [
      {
        slug: 'reset-password',
        title: 'How to Reset Your Password',
        description: 'Step-by-step guide to reset your password',
        content: `
# How to Reset Your Password

If you've forgotten your password or need to change it for security reasons, follow these steps.

## Reset Password from Login Page

1. **Go to the Login Page**
   - Visit financedu.org/login
   - Click "Forgot Password?"

2. **Enter Your Email**
   - Type the email address associated with your account
   - Click "Send Reset Link"

3. **Check Your Email**
   - Look for a password reset email from Financedu
   - Click the "Reset Password" link in the email

4. **Create New Password**
   - Enter your new password
   - Confirm the password
   - Click "Update Password"

## Password Requirements

Your new password must:
- Be at least 8 characters long
- Include at least one uppercase letter
- Include at least one lowercase letter
- Include at least one number
- Include at least one special character

## Security Tips

- Use a unique password for your Financedu account
- Consider using a password manager
- Don't share your password with others
- Change your password regularly

## Still Having Trouble?

If you don't receive the reset email:
- Check your spam/junk folder
- Make sure you're using the correct email address
- Contact support for assistance
        `,
        lastUpdated: '2025-08-09',
        readTime: 2
      }
    ]
  },
  {
    slug: 'getting-started',
    title: 'Getting Started',
    description: 'New user guides and setup',
    icon: '🚀',
    articles: [
      {
        slug: 'account-setup',
        title: 'Setting Up Your Account',
        description: 'Complete guide to creating your Financedu account',
        content: `
# Setting Up Your Account

Welcome to Financedu! Here's how to get started with your new account.

## Creating Your Account

1. **Visit the Sign-Up Page**
   - Go to financedu.org/signup
   - Choose your account type (Student, Teacher, or Parent)

2. **Enter Your Information**
   - Provide your email address
   - Create a secure password
   - Enter your full name

3. **Verify Your Email**
   - Check your email for a verification link
   - Click the link to activate your account

## Completing Your Profile

1. **Add Profile Information**
   - Upload a profile picture (optional)
   - Add your grade level or teaching subject
   - Set your learning preferences

2. **Choose Your Interests**
   - Select financial topics you're interested in
   - This helps us recommend relevant content

3. **Set Learning Goals**
   - Choose how many minutes you want to learn per day
   - Set up reminder notifications

## Next Steps

- Explore the course catalog
- Join a class (if you have a class code)
- Start with beginner-friendly courses
- Connect with teachers or parents if applicable

## Need Help?

- Check out our video tutorials
- Browse other help articles
- Contact our support team
        `,
        lastUpdated: '2025-08-12',
        readTime: 3
      }
    ]
  }
];

// Helper functions
export function getCategoryBySlug(slug: string): Category | undefined {
  return helpCategories.find(category => category.slug === slug);
}

export function getArticleBySlug(categorySlug: string, articleSlug: string): Article | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.articles.find(article => article.slug === articleSlug);
}

export function getAllArticles(): Article[] {
  return helpCategories.flatMap(category => category.articles);
}

export function searchArticles(query: string): Article[] {
  const lowercaseQuery = query.toLowerCase();
  return getAllArticles().filter(article => 
    article.title.toLowerCase().includes(lowercaseQuery) ||
    article.description.toLowerCase().includes(lowercaseQuery) ||
    article.content.toLowerCase().includes(lowercaseQuery)
  );
}
