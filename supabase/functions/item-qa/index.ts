// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

import { corsHeaders } from '../_shared/cors.ts'
import { MistralLLM as LLM } from '../_shared/llm.ts'
import { Prompt } from "../_shared/prompt.service.ts"

import prompt from "./item-qa.prompt.ts"

Deno.serve(async (req) => {

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  const content = await req.json()

  console.log("content", content)

  const mistral_key = Deno.env.get("MISTRAL_API_KEY")
  const llm = new LLM(mistral_key)

  const initialParagraph = await Promise.resolve()
    .then(() => new Prompt(prompt).render({
      type: content.type, text: content.text, query: content.query
    }))
    .then((newPrompt) => {
      console.log(newPrompt)
      return newPrompt
    })
    .then((newPrompt) => llm.chatPrompt(newPrompt))
    .then(result => result.choices[0].message.content)

  console.log(initialParagraph)

  return new Response(
    JSON.stringify({ result: initialParagraph }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/item-qa' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
