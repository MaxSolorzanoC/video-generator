import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

async function generateAudio(prompt: string) {
  try {
      const output = await replicate.run(
        "lee101/guided-text-to-speech:fc0617a394340824a7dd1aa78f76e92c061449abd48e67ee9dbe30a6448c8be2", 
        { 
          input: {
            voice: 'A male speaker with a veri motivating voice, expresses a lot of emotions and catches the user attention.',
            prompt,
          } 
        }
      );
      console.log("Generated audio:", output);
      return output;
      // Do something with the output, such as saving the audio file
  } catch (error) {
      console.error("Error generating audio:", error);
  }
}

export async function POST(req: NextRequest) {
    const paragraphs = await req.json();

    if (!paragraphs) {
        throw new Error('Missing input field in the request body')
    }

    for (let i = 0; i < paragraphs.length; i++) {
      await generateAudio(paragraphs[i])
    }

    return NextResponse.json({paragraphs: paragraphs}, {status: 200});
}
