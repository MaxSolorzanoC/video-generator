// app/api/chat/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createOpenAI } from '@ai-sdk/openai';

import * as z from 'zod';

import { generateObject, generateText, tool } from 'ai'

const openai = createOpenAI({
    baseURL: 'https://api.openai.com/v1',
    compatibility: 'strict', // strict mode, enable when using the OpenAI API
    apiKey: process.env.OPENAI_API_KEY,
});

const countWords = (text: string) => {
    return text.split(/\s+/).filter(word => word !== '').length;
}


function divideScriptByParagraphs(script: string): string[] {
  // Split the script into an array of paragraphs by newlines
  const paragraphs = script.split(/\n+/).filter(paragraph => paragraph.trim() !== '');

  return paragraphs;
}

function calculateSnippetsDuration(paragraphs: string[]): string[] {
  //Iterate through the paragraphs and calculate the duration for each of them
  const durations = [];

  paragraphs.map((paragraph) => {
    durations.push()
  })

  return paragraphs;
}

export async function POST(req: NextRequest) {
  if (req.method !== 'POST') {
    return NextResponse.json({ error: 'Method Not Allowed' }, { status: 405 });
  }

  const prompt = await req.json();

  //  // Get a language model
   const model = openai('gpt-4o-mini')

  //  //Generate script
    const script = await generateText({
        model,
        prompt: `Generate a concise video script covering the key points of the topic. The script should only include the content to be read in the voiceover, don't include scene descriptions. The topic is: ${prompt}`,
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
    });

  //   const snippetsSchema = z.object({
  //     snippets: z.array(z.object({
  //       script: z.string(),
  //       duration: z.number(),
  //       prompt: z.string()
  //     })) 
  //   })

  // //   //Using the script, generate an object of video snippets
  //   const snippets = await generateObject({
  //       model,
  //       prompt: ``,
  //       schema: snippetsSchema,
  //       // tools: {
  //       //     wordCounter: tool({
  //       //       description: 'Count the number of words in a string',
  //       //       parameters: z.object({
  //       //         text: z.string().describe('The text to which we want to count its words'),
  //       //       }),
  //       //       execute: async ({ text }) => ({
  //       //         text,
  //       //         wordCount: text.split(/\s+/).filter(word => word !== '').length,
  //       //       }),
  //       //     }),
  //       //   },
  //   });  
  const paragraphs = divideScriptByParagraphs(script.text)

  const snippetsSchema = z.array(z.object({
    script: z.string(),
    duration: z.number(),
    prompt: z.string(),
  }))

  let vidoeSnippets: z.infer <typeof snippetsSchema>;

  return NextResponse.json({ response: paragraphs }, { status: 200 });
}