'use client';

import { MemoizedMarkdown } from '@/components/chat/memoized-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { CircleStop, Send } from 'lucide-react';

export default function Page() {
  const { messages, input, setInput, append, stop, isLoading, } = useChat();

  return (
    <main className="h-full">
      {/* Scrollable chat container */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex max-w-screen-md mb-4 mx-auto",
              message.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            <div
              className={cn(
                "prose",
                message.role === 'user'
                  ? 'rounded-xl py-3 px-5 bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted rounded-2xl p-5 my-8'
              )}
            >
              <MemoizedMarkdown id={message.id} content={message.content} />
            </div>
          </div>
        ))}
      </div>

      {/* Fixed input container */}
      <div className="sticky bottom-0 mx-auto bg-background max-w-screen-md pb-8 flex flex-row gap-2">
        <Input
          value={input}
          onChange={event => {
            setInput(event.target.value);
          }}
          onKeyDown={async event => {
            if (event.key === 'Enter') {
              append({ content: input, role: 'user' });
            }
          }}
          placeholder="Type your message..."
          className="w-full h-12"
        />
        <Button
          onClick={async () => {
            if (isLoading) stop();
            else append({ content: input, role: 'user' });
          }}
          className='h-12 [&_svg]:h-5 [&_svg]:w-5'
        >
          {isLoading ? <CircleStop /> : <Send />}
        </Button>
      </div>
    </main>
  );
}