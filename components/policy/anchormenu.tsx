"use client";

import { useEffect } from 'react';
import Link from 'next/link';

export default function AnchorMenu() {
    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('h2[id], h3[id]');
            const navLinks = document.querySelectorAll('aside nav ul li a');

            let activeSection: Element | null = null;
            const threshold = 100; // 100px below the top

            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= threshold) {
                    activeSection = section;
                }
            });

            if (activeSection) {
                const id = (activeSection as HTMLElement).getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.add('text-gray-600', 'dark:text-gray-300');
                    link.classList.remove('font-semibold', 'text-black', 'dark:text-white');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.remove('text-gray-600', 'dark:text-gray-300');
                        link.classList.add('font-semibold', 'text-black', 'dark:text-white');
                    }
                });
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call to set the active link based on the initial scroll position

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <aside className="hidden sm:block sm:min-w-16 w-1/4 sticky top-24 h-screen px-8">
            <h2 className='font-semibold text-lg mb-4'>On this Page</h2>
            <nav className='flex flex-col'>
                <ul className='space-y-3'>
                    <li><Link href="#copyright" className="block">Copyright Policy</Link></li>
                    <li><Link href="#termsofuse" className="block">Terms of Use</Link></li>
                    <li><Link href="#privacy" className="block">Privacy Policy</Link></li>
                    <li><Link href="#collecteddata" className="ml-3 block">Collected Data</Link></li>
                    <li><Link href="#datause" className="ml-3 block">Data Use</Link></li>
                    <li><Link href="#modifications" className="block">Modifications</Link></li>
                    <li><Link href="#contact" className="block">Contact Us</Link></li>
                </ul>
            </nav>
        </aside>
    );
}