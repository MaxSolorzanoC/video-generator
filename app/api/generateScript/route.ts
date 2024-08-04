// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';
import { countWords } from '@/lib/count-words';

import * as z from 'zod';

import { generateObject, generateText, tool } from 'ai'

const openai = createOpenAI({
    baseURL: 'https://api.openai.com/v1',
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const prompt = await req.json();

  //  // Get a language model
   const model = openai('gpt-4o-mini')

  //  //Generate script
    const response = await generateText({
        model,
        prompt: `Generate a concise 156 word long video script covering the key points of the topic. The script should only include the content to be read in the voiceover, don't include scene descriptions. The script must be divided in paragraphs (2 sentences each). The topic is: ${prompt}`,
        tools: {
          wordCounter: tool({
            description: 'Count the number of words in a string',
            parameters: z.object({
              text: z.string().describe('The text to which we want to count its words'),
            }),
            execute: async ({ text }) => ({
              text,
              wordCount: countWords(text)
            }),
          }),
        },
        toolChoice: "auto",
    });

    const script = response.toolResults[0].result.text;

  return NextResponse.json(script, { status: 200 });
}