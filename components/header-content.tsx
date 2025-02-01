"use client";

import React, { useState } from 'react';
import { Button, buttonVariants } from './ui/button';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import UserMenu from './user-menu';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Separator } from './ui/separator';

export default function HeaderComp({
  userData
}: {
  userData?: {
    name?: string | null,
    image?: string | null,
    email?: string | null
  }
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const loggedIn = !!userData;
  console.log("userData", userData);

  return (
    <nav className="sticky top-0 z-50 w-full border-b">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 relative flex items-center justify-between h-16 bg-background">
        {/* Logo */}
        <div className="flex-shrink-0 flex flex-row space-x-2">
          <Image height={50} width={200} src="/financedu-logo.svg" alt="Logo" />
        </div>
        {/* Menu items and button */}
        <div className="flex-1 flex items-center justify-end">
          <div className="hidden md:flex space-x-4">
            <Link href="#home" className="text-foreground hover:text-primary px-3 py-2 font-semibold">Home</Link>
            <Link href="#features" className="text-foreground hover:text-primary px-3 py-2 font-semibold">Features</Link>
            <Link href="#contact" className="text-foreground hover:text-primary px-3 py-2 font-semibold">Contact</Link>
            <div className='ml-4 self-center'>
              {loggedIn ? (
                <UserMenu name="Eamon G" email="ekeokigordon@icloud.com" />
              ) : (
                <>
                  <Link href="/login" className={cn(buttonVariants({ variant: "secondary" }), "w-28")}>Log In</Link>
                  <Link href="/signup" className={cn(buttonVariants({ variant: "default" }), "w-28")}>Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Mobile menu button */}
        <div className="absolute inset-y-0 right-0 flex items-center md:hidden">
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
            <Menu size={24} className={isMenuOpen ? 'hidden' : 'block'} />
            {/* Icon when menu is open. */}
            <X size={24} className={isMenuOpen ? 'block' : 'hidden'} />
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden absolute h-screen w-full backdrop-blur-xl bg-background/80`} id="mobile-menu">
        <div className="p-6 space-y-6">
          <div className='flex flex-col gap-4'>
            <Link href="#home" className="text-foreground hover:text-primary block text-base font-semibold">Home</Link>
            <Link href="#features" className="text-foreground hover:text-primary block text-base font-semibold">Features</Link>
            <Link href="#contact" className="text-foreground hover:text-primary block text-base font-semibold">Contact</Link>
          </div>
          <Separator />
          <div className='flex flex-col gap-2'>
            <Link href="/signup" className={cn(buttonVariants({ variant: "default" }), "w-full")}>Sign Up</Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "secondary" }), "w-full")}>Log In</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}