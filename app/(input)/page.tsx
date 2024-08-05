"use client"

import * as z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';
import { divideByParagraphs } from '@/lib/divide-paragraphs';

export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false);
  // const [script, setScript] = useState<string | null>(null);

  const formSchena = z.object({
    prompt: z.string().min(1)
  });

  const form = useForm<z.infer<typeof formSchena>>({
    resolver: zodResolver(formSchena),
    defaultValues: {
      prompt: "",
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchena> ) => {
    setDisabled(true)

    //Generate script
    try {
      const response = await fetch('/api/generateScript', {
        method: 'POST',
        body: JSON.stringify(values.prompt),
      })

      const script = await response.json();

      //Divide script by paragraphs
      const paragraphs = divideByParagraphs(script);
      
      const audio = await fetch("/api/generateAudio", {
        method: "POST",
        body: JSON.stringify(paragraphs)
      });
      console.log(await audio.json())

      setDisabled(false)
    } catch(err) {
      console.log(err)
    }

  }

  const handleGenerateAudio = async (values: z.infer<typeof formSchena> ) => {
    setDisabled(true)
    //Generate an audio using replicate
    try {
      const response = await fetch("/api/generateAudio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(values.prompt)
      });

      if(!response.ok) {
        throw new Error('Failed to fetch audio data');
      }
      const data = await response.json();
      //Download the audio file returned by replicate and save it inside the /temp folder
      try {
        const response = await fetch("/api/downloadAudio", {
          method: "POST",
          body: JSON.stringify({
            videoUrl: data,
            outputFileName: "1.mp3"
          })
        });

        if(!response.ok) {
          throw new Error('Failed to download audio');
        }

        const path = await response.json();

        console.log(path)
        // setAudioUrl(path)
      } catch(error) {
        console.log(error)
      }
      
    } catch(error) {
      console.log(error)
    }
    setDisabled(false)
  }

  return (
    <main>
      <h1>Create a youtube video by a prompt</h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField 
        name="prompt"
        render={({ field }) => (
          <FormItem>
            <FormControl>
            <Input disabled={disabled} {...field} placeholder="Prompt goes here:" type="text" />
            </FormControl>
          </FormItem>
        )}
      />
        
        <Button disabled={disabled} type="submit">Submit</Button>
      </form>
      <>
        {
          audioUrl && (
            <audio controls>
              <source src={audioUrl} />
            </audio>
          )
        }
      </>
    </Form>
    </main>
  );
}
