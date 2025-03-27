"use client";

import React, { useEffect, useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import UserMenu from './user-menu';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Separator } from './ui/separator';
import { type Roles } from '@/lib/db/schema';
import { usePathname } from 'next/navigation';
import { SearchModal } from './search/modal';

export default function HeaderComp({
  userData
}: {
  userData?: {
    firstName?: string | null,
    lastName?: string | null,
    image?: string | null,
    email?: string | null
    roles?: Roles
  }
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loggedIn = !!userData;
  const pathname = usePathname();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleMobileMenuItemClick = (targetPath: string) => {
    if (pathname === targetPath || (targetPath && targetPath.startsWith('/#') && targetPath.substring(0, 1) === pathname)) {
      setIsMenuOpen(false);
    }
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="cursor-pointer flex-shrink-0 flex flex-row space-x-2">
          <Image height={50} width={200} src="/financedu-logo.svg" alt="Logo" />
        </Link>
        {/* Menu items and button */}
        <div className="flex-1 flex items-center justify-end">
          <SearchModal />
          <div className="hidden lg:flex space-x-4">
            <Link href="/courses" className="text-foreground hover:text-primary px-3 py-2 font-semibold">Courses</Link>
            <Link href="/resources" className="text-foreground hover:text-primary px-3 py-2 font-semibold">Resources</Link>
            <Link href="/about" className="text-foreground hover:text-primary px-3 py-2 font-semibold">About</Link>
            <Link href="/donate" className="text-foreground hover:text-primary px-3 py-2 font-semibold">Donate</Link>
            <Link href="/blog" className="text-foreground hover:text-primary px-3 py-2 font-semibold">Blog</Link>
          </div>
          <div className='ml-6 self-center hidden md:flex'>
            {loggedIn ? (
              <UserMenu firstName={userData.firstName ?? undefined} lastName={userData.lastName ?? undefined} email={userData.email!} roles={userData.roles} />
            ) : (
              <div className='flex flex-row gap-2'>
                <Link href="/login" className={cn(buttonVariants({ variant: "secondary" }), "w-28 text-base")}>Log In</Link>
                <Link href="/signup" className={cn(buttonVariants({ variant: "default" }), "w-28 text-base")}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
        {/* Mobile menu button */}
        <div className={cn("absolute inset-y-0 right-2 flex items-center md:flex lg:hidden", loggedIn ? 'md:right-16' : 'md:right-[264px]')}>
          <SearchModal isMobile />
          <Button
            type="button"
            variant="ghost"
            aria-controls="mobile-menu"
            aria-expanded={isMenuOpen}
            className='[&_svg]:size-auto'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {/* Icon when menu is closed. */}
            <Menu strokeWidth={1.5} size={24} className={isMenuOpen ? 'hidden' : 'block'} />
            {/* Icon when menu is open. */}
            <X strokeWidth={1.5} size={24} className={isMenuOpen ? 'block' : 'hidden'} />
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:hidden absolute h-screen w-full backdrop-blur-xl bg-background/80`} id="mobile-menu">
        <div className="p-6 space-y-6">
          <div className='flex flex-col gap-4'>
            <Link href="/courses" className="text-foreground hover:text-primary block text-base font-semibold" onClick={() => handleMobileMenuItemClick('/courses')}>Courses</Link>
            <Link href="/resources" className="text-foreground hover:text-primary block text-base font-semibold" onClick={() => handleMobileMenuItemClick('/resources')}>Resources</Link>
            <Link href="/about" className="text-foreground hover:text-primary block text-base font-semibold" onClick={() => handleMobileMenuItemClick('/about')}>Contact</Link>
            <Link href="/donate" className="text-foreground hover:text-primary block text-base font-semibold" onClick={() => handleMobileMenuItemClick('/donate')}>Donate</Link>
            <Link href="/blog" className="text-foreground hover:text-primary block text-base font-semibold" onClick={() => handleMobileMenuItemClick('/blog')}>Blog</Link>
          </div>
          <Separator />
          <div className='flex flex-col gap-2'>
            {loggedIn ? (
              <UserMenu isMobile firstName={userData.firstName ?? undefined} lastName={userData.lastName ?? undefined} email={userData.email!} roles={userData.roles} />
            ) : (
              <div className='flex flex-col md:flex-row gap-2'>
                <Link href="/login" className={cn(buttonVariants({ variant: "secondary" }), "w-full")}>Log In</Link>
                <Link href="/signup" className={cn(buttonVariants({ variant: "default" }), "w-full")}>Get Started</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}