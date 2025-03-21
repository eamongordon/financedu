"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const FourFunctionCalculator = () => {
    const [input, setInput] = useState('');

    const handleClick = (value: string) => {
        setInput(input + value);
    };

    const handleClear = () => {
        setInput('');
    };

    const handleDelete = () => {
        setInput(input.slice(0, -1));
    };

    const handleCalculate = () => {
        try {
            setInput(eval(input).toString());
        } catch {
            setInput('Error');
        }
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleCalculate();
        }
    };

    const isError = input === 'Error';

    return (
        <div className='w-full grid grid-cols-4 gap-2'>
            <Input
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className={`col-span-4 ${isError ? 'border-red-500' : ''}`}
            />
            <Button onClick={handleDelete} variant="outline" className='col-span-2'>Delete</Button>
            <Button onClick={handleClear} variant="destructive" className='col-span-2'>Clear</Button>
            <Button onClick={() => handleClick('7')} variant="outline">7</Button>
            <Button onClick={() => handleClick('8')} variant="outline">8</Button>
            <Button onClick={() => handleClick('9')} variant="outline">9</Button>
            <Button onClick={() => handleClick('/')} variant="secondary">/</Button>
            <Button onClick={() => handleClick('4')} variant="outline">4</Button>
            <Button onClick={() => handleClick('5')} variant="outline">5</Button>
            <Button onClick={() => handleClick('6')} variant="outline">6</Button>
            <Button onClick={() => handleClick('*')} variant="secondary">*</Button>
            <Button onClick={() => handleClick('1')} variant="outline">1</Button>
            <Button onClick={() => handleClick('2')} variant="outline">2</Button>
            <Button onClick={() => handleClick('3')} variant="outline">3</Button>
            <Button onClick={() => handleClick('-')} variant="secondary">-</Button>
            <Button onClick={() => handleClick('.')} variant="outline">.</Button>
            <Button onClick={() => handleClick('0')} variant="outline">0</Button>
            <Button onClick={handleCalculate}>=</Button>
            <Button onClick={() => handleClick('+')} variant="secondary">+</Button>
        </div>
    );
};

export default FourFunctionCalculator;