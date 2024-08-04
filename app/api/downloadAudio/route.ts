import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

interface RequestBody {
  videoUrl: string;
  outputFileName: string;
}


export async function POST(req: Request): Promise<Response> {
  try {
    // Parse the request body
    const body: RequestBody = await req.json();

    const videoUrl = body.videoUrl;
    const outputFileName = body.outputFileName;

    // Ensure a video URL is provided
    if (!videoUrl) {
      return NextResponse.json({ error: 'No video URL provided' }, { status: 400 });
    }

    // Create a unique filename for the downloaded video
    // const tempFileName = `video_${uuidv4()}.mp3`;
    const outputFilePath = path.join('./temp', outputFileName);

    // Download the video using wget
    await new Promise<string>((resolve, reject) => {
      exec(`wget -O ${outputFilePath} "${videoUrl}"`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error downloading ${videoUrl}:`, stderr);
          reject(stderr);
        } else {
          console.log(`Downloaded ${videoUrl} to ${outputFilePath}`);
          resolve(outputFilePath);
        }
      });
    });

    // Return the path of the downloaded file as a response
    return NextResponse.json(outputFilePath);
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
