import { db } from './index';
import { helpCategories, helpArticles } from './schema';

export async function seedHelpData() {
  // Create categories
  const gettingStartedCategory = await db.insert(helpCategories).values({
    slug: 'getting-started',
    name: 'Getting Started',
    description: 'Learn the basics of using Financedu to teach financial literacy',
    order: 1,
    icon: 'Rocket', // Lucide icon name
  }).returning();

  const teacherGuidesCategory = await db.insert(helpCategories).values({
    slug: 'teacher-guides',
    name: 'Teacher Guides',
    description: 'Complete guides for educators using Financedu in their classroom',
    order: 2,
    icon: 'BookOpen', // Lucide icon name
  }).returning();

  const technicalCategory = await db.insert(helpCategories).values({
    slug: 'technical-support',
    name: 'Technical Support',
    description: 'Troubleshooting and technical assistance',
    order: 3,
    icon: 'Wrench', // Lucide icon name
  }).returning();

  // Create articles for Getting Started
  await db.insert(helpArticles).values([
    {
      categoryId: gettingStartedCategory[0].id,
      slug: 'create-account',
      title: 'How to Create Your Financedu Account',
      excerpt: 'Learn how to set up your Financedu account and get started teaching financial literacy.',
      content: `# How to Create Your Financedu Account

Creating your Financedu account is quick and easy. Follow these simple steps to get started:

## Step 1: Visit the Sign-Up Page
Navigate to the Financedu homepage and click the "Sign Up" button in the top right corner.

## Step 2: Choose Your Role
Select whether you're a:
- **Teacher**: Manage classes and assign activities
- **Student**: Complete activities and track progress
- **Parent**: Monitor your child's learning progress

## Step 3: Fill Out Your Information
Provide your basic information including:
- Full name
- Email address
- Password (must be at least 8 characters)

## Step 4: Verify Your Email
Check your email for a verification link and click it to activate your account.

## Step 5: Complete Your Profile
Add additional information like your school, grade level, or subjects you teach.

That's it! You're now ready to start using Financedu to teach and learn financial literacy.`,
      order: 1,
    },
    {
      categoryId: gettingStartedCategory[0].id,
      slug: 'first-steps',
      title: 'Your First Steps with Financedu',
      excerpt: 'A beginner-friendly guide to navigating Financedu and understanding its key features.',
      content: `# Your First Steps with Financedu

Welcome to Financedu! This guide will help you understand the platform and take your first steps toward financial literacy education.

## Understanding the Dashboard
Your dashboard is your home base. Here you'll find:
- Quick access to your courses
- Progress tracking
- Recent activities
- Announcements and updates

## Exploring Courses
Our curriculum is organized into modules and lessons:
- **Modules**: Major topic areas like budgeting, saving, and investing
- **Lessons**: Specific concepts within each module
- **Activities**: Interactive exercises and quizzes

## Getting Help
If you need assistance:
- Check out our Help Center (you're here!)
- Contact our support team
- Join our community forums

Ready to start learning? Head to the Courses section and begin your financial literacy journey!`,
      order: 2,
    }
  ]);

  // Create articles for Teacher Guides
  await db.insert(helpArticles).values([
    {
      categoryId: teacherGuidesCategory[0].id,
      slug: 'classroom-management',
      title: 'Managing Your Virtual Classroom',
      excerpt: 'Learn how to set up and manage your Financedu classroom effectively.',
      content: `# Managing Your Virtual Classroom

Financedu makes it easy to manage your classroom and track student progress. Here's everything you need to know:

## Creating Your Class
1. Navigate to the "Manage" section
2. Click "Create New Class"
3. Enter your class name and details
4. Share the join code with your students

## Adding Students
Students can join your class by:
- Using the class join code
- Being invited via email
- Being added manually by you

## Assigning Activities
To assign activities to your class:
1. Browse the course catalog
2. Select an activity or lesson
3. Click "Assign to Class"
4. Set due dates and instructions

## Tracking Progress
Monitor your students' progress through:
- The gradebook view
- Individual student profiles
- Class performance analytics
- Completion reports

## Best Practices
- Set clear expectations for online learning
- Provide regular feedback
- Use the discussion features to encourage collaboration
- Review progress regularly and adjust instruction as needed`,
      order: 1,
    }
  ]);

  // Create articles for Technical Support
  await db.insert(helpArticles).values([
    {
      categoryId: technicalCategory[0].id,
      slug: 'browser-requirements',
      title: 'Browser Requirements and Troubleshooting',
      excerpt: 'Information about supported browsers and common technical issues.',
      content: `# Browser Requirements and Troubleshooting

To ensure the best experience with Financedu, please use a supported browser and follow these troubleshooting steps if you encounter issues.

## Supported Browsers
Financedu works best with:
- **Chrome** (version 90 or later)
- **Firefox** (version 88 or later)
- **Safari** (version 14 or later)
- **Edge** (version 90 or later)

## Common Issues and Solutions

### Page Won't Load
1. Clear your browser cache and cookies
2. Disable browser extensions temporarily
3. Try an incognito/private browsing window
4. Check your internet connection

### Videos Not Playing
1. Ensure you have a stable internet connection
2. Update your browser to the latest version
3. Enable JavaScript if it's disabled
4. Try a different browser

### Login Problems
1. Double-check your email and password
2. Try resetting your password
3. Clear your browser cache
4. Ensure cookies are enabled

### Still Having Issues?
If these steps don't resolve your problem:
- Contact our support team
- Include details about your browser and operating system
- Describe what you were trying to do when the issue occurred`,
      order: 1,
    }
  ]);

  console.log('Help data seeded successfully!');
}

// Only run if this file is executed directly
if (require.main === module) {
  seedHelpData().catch(console.error);
}
