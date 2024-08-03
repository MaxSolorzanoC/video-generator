"use client"

import * as z from 'zod';
import axios from 'axios';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from 'react';

export default function Home() {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [disabled, setDisabled] = useState<boolean>(false)

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
    try {
      const res = await fetch('/api/generateVideo', {
        method: 'POST',
        body: JSON.stringify(values.prompt),
      })
      const data = await res.json();
      console.log(data)
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleGenerateAudio = async (values: z.infer<typeof formSchena> ) => {
    setDisabled(true)
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
      console.log(data)
      setAudioUrl(data)
    } catch(error) {
      console.log(error)
    }
    setDisabled(false)
  }

  return (
    <main>
      <h1>Create a youtube video by a prompt</h1>
      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleGenerateAudio)}>
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
