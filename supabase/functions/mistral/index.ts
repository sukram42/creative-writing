// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import MistralClient from 'https://esm.sh/@mistralai/mistralai'
import { corsHeaders } from '../_shared/cors.ts'


const getErrorResponse = (error) => {
  return new Response(JSON.stringify({ error: error.message }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 400,
  })
}

Deno.serve(async (req: Request) => {
  // This is needed if you're planning to invoke your function from a browser.
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const content = await req.json()

  const mistral_key = Deno.env.get("MISTRAL_API_KEY")
  const mistral_client = new MistralClient(mistral_key);


  try {
    // Create a Supabase client with the Auth context of the logged in user.
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default.
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default.
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      // Create client with Auth context of the user that called the function.
      // This way your row-level-security (RLS) policies are applied.
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get prompt
    const { data: prompt } = await supabaseClient
      .from("prompts")
      .select("*")
      .eq("id", "outline2text")

    // Get the paragraph
    const {
      data
    } = await supabaseClient
      .from('items')
      .select("*")
      .eq("item_id", content.paragraph)

    // Create prompt
    console.log(prompt[0].model_name)
    const finalPrompt = prompt[0].prompt.replace("${outline}", data[0].outline)

    // const Create the response
    const chatResponse = await mistral_client.chat({
      model: prompt[0].model_name,
      temperature: prompt[0].temperature,
      messages: [{ role: 'system', content: finalPrompt }],
    });

    // Update the  item
    const { error } = await supabaseClient
      .from('items')
      .update({ final: chatResponse.choices[0].message.content })
      .eq("item_id", content.paragraph)
      .select()

    if (error) return getErrorResponse(error)

    return new Response(JSON.stringify({ result: chatResponse.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    if (error) return getErrorResponse(error)
  }
})