'use client';

import { MemoizedMarkdown } from '@/components/chat/memoized-markdown';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useChat } from '@ai-sdk/react';
import { CircleStop, FileText, Send } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const { messages, input, setInput, append, stop, status } = useChat();

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
                message.role === 'user'
                  ? 'rounded-xl py-3 px-5 bg-primary text-primary-foreground font-semibold'
                  : 'bg-muted rounded-2xl p-5 my-8'
              )}
            >
              {message.content.length > 0 ? (
                <>
                  <div className={cn('prose', message.role === 'user' && 'text-primary-foreground')}>
                    <MemoizedMarkdown id={message.id} content={message.content} />
                  </div>
                  {message.role === 'assistant' && message.parts.filter((part) => part.type === "tool-invocation" && part.toolInvocation.state === 'result').length > 0 && (
                    <div className="mt-2 space-y-2">
                      <hr/>
                      <p className='font-semibold text-sm text-muted-foreground'>Related Articles</p>
                      {message.parts.map(part => {
                        if (part.type === "tool-invocation" && part.toolInvocation.state === 'result') {
                          const { title, slug } = part.toolInvocation.result[0];
                          return (
                            <Link
                              key={part.toolInvocation.toolCallId}
                              href={`/activities/${slug}`}
                              className="flex flex-row items-center gap-4"
                            >
                              <div className='size-10 sm:size-12 flex justify-center items-center border rounded-lg'>
                                <FileText strokeWidth={1.5} />
                              </div>
                              <div>
                                <p className='text-base font-semibold'>{title}</p>
                                <p className='text-sm text-muted-foreground'>Article</p>
                              </div>
                            </Link>
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </>
              ) : (
                <BouncingDots />
              )}  
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
            if (status === 'submitted' || status === 'streaming') stop();
            else append({ content: input, role: 'user' });
          }}
          className='h-12 [&_svg]:h-5 [&_svg]:w-5'
        >
          {status === 'submitted' || status === 'streaming' ? <CircleStop /> : <Send />}
        </Button>
      </div>
    </main >
  );
}

function BouncingDots() {
  return (
    <>
      <style jsx>{`
      @keyframes bounceDot {
        0%, 80%, 100% {
          transform: translateY(0);
        }
        40% {
          transform: translateY(-10px);
        }
      }
    `}</style>
      <div className="flex space-x-1">
        <span
          className="size-1.5 bg-muted-foreground rounded-full"
          style={{
            animation: 'bounceDot 1.4s infinite ease-in-out',
            animationDelay: '0s',
          }}
        ></span>
        <span
          className="size-1.5 bg-muted-foreground rounded-full"
          style={{
            animation: 'bounceDot 1.4s infinite ease-in-out',
            animationDelay: '0.2s',
          }}
        ></span>
        <span
          className="size-1.5 bg-muted-foreground rounded-full"
          style={{
            animation: 'bounceDot 1.4s infinite ease-in-out',
            animationDelay: '0.4s',
          }}
        ></span>
      </div>
    </>
  )
}