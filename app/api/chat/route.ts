import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { findRelevantActivities } from '@/lib/fetchers';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
    system: `You are a friendly and helpful assistant. Always respond in a warm and approachable tone.
    Check your knowledge base before answering any questions.
    Only respond to questions using information from tool calls.
    If no relevant information is found in the tool calls, respond with something like, "I'm sorry, I couldn't find the information you're looking for, but let me know if there's anything else I can help with!"`,
    tools: {
      getInformation: tool({
        description: `get information from your knowledge base to answer questions.`,
        parameters: z.object({
          question: z.string().describe('the users question'),
        }),
        execute: async ({ question }) => findRelevantActivities(question),
      }),
    },
  });

  return result.toDataStreamResponse();
}