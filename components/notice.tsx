"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export function Notice({ children, persistent = false }: { children: React.ReactNode, persistent?: boolean }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (persistent) {
            const storedVisibility = localStorage.getItem('noticeVisible');
            if (storedVisibility !== null) {
                setVisible(storedVisibility === 'true');
            }
        }
    }, [persistent]);

    const handleClose = () => {
        setVisible(false);
        if (persistent) {
            localStorage.setItem('noticeVisible', 'false');
        }
    };

    if (!visible) return null;

    return (
        <div className="border-b bg-muted relative h-10">
            {children}
            <Button
                onClick={handleClose}
                variant="ghost"
                className='absolute top-0 right-0 text-muted-foreground hover:bg-inherit'
            >
                <X />
            </Button>
        </div>
    );
}