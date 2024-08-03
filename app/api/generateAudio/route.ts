import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(req: NextRequest) {
    const prompt = await req.json();

    if (!prompt) {
        throw new Error('Missing input field in the request body')
    }

    const output = await replicate.run(
      "adirik/styletts2:989cb5ea6d2401314eb30685740cb9f6fd1c9001b8940659b406f952837ab5ac", 
      { 
        input: {
          text: prompt
        } 
      }
    );

    console.log(output);
    return NextResponse.json(output);
}
