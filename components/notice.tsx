"use client";

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

type NoticeProps = 
    | { persistent: true; storageKey: string; children: React.ReactNode }
    | { persistent?: false; storageKey?: never; children: React.ReactNode };

export function Notice({ children, persistent = false, storageKey }: NoticeProps) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        if (persistent) {
            const storedVisibility = localStorage.getItem(storageKey!);
            if (storedVisibility !== null) {
                setVisible(storedVisibility === 'true');
            }
        }
    }, [persistent, storageKey]);

    const handleClose = () => {
        setVisible(false);
        if (persistent) {
            localStorage.setItem(storageKey!, 'false');
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