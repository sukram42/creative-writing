// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

import { corsHeaders } from '../_shared/cors.ts'
import { Prompt } from '../_shared/prompt.service.ts'
import { MistralLLM as LLM } from '../_shared/llm.ts'

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
  const llm = new LLM(mistral_key)

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
    const { data: prompts } = await supabaseClient
      .from("prompts")
      .select("*")

    let outlinePrompt
    let feedbackPrompt
    let incorporateFeedbackPrompt

    prompts.forEach(function (p) {
      switch (p.id) {
        case "outline2text":
          outlinePrompt = new Prompt(p)
          break;
        case "feedback":
          feedbackPrompt = new Prompt(p)
          break;
        case "incorporateFeedback":
          incorporateFeedbackPrompt = new Prompt(p)
      }
    })

    const {
      data
    } = await supabaseClient
      .from('items_v2')
      .select("*")
      .eq("item_id", content.paragraph)

    // Get project
    let {
      data: project
    } = await supabaseClient.from("projects").select("*").eq("project_id", content.project_id)

    project = project[0]

    let {
      data: items
    } = await supabaseClient.from("items_v2")
      .select("*")
      .eq("project_id", content.project_id)

    items = items.sort((a, b) => a.rank - b.rank)
    const itemsBefore = items.filter(i => i.rank <= data[0].rank)
    const chapter = itemsBefore.filter(i => i.type == "H1").splice(-1)[0]

    const initialParagraph = await Promise.resolve()
      .then(() => outlinePrompt.render({ project: project, item: data[0], input: { paragraph_before: itemsBefore.splice(-1)[0].final, header: chapter.outline } }))
      .then(prompt => llm.chatPrompt(prompt))
      .then(result => result.choices[0].message.content)

    const finalParagraph = await Promise.resolve()
      .then((paragraph) => feedbackPrompt.render({ project: project, item: data[0], input: { paragraph } }))
      .then(prompt => llm.chatPrompt(prompt))
      .then(result => result.choices[0].message.content)

      .then((feedback) => incorporateFeedbackPrompt.render({ project: project, item: data[0], input: { feedback, paragraph: initialParagraph } }))
      .then(prompt => llm.chatPrompt(prompt))
      .then(result => result.choices[0].message.content)
      
    // Update the  item
    const { error } = await supabaseClient
      .from('items_v2')
      .update({ final: finalParagraph })
      .eq("item_id", content.paragraph)
      .select()

    if (error) return getErrorResponse(error)

    return new Response(JSON.stringify({ result: finalParagraph }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    if (error) return getErrorResponse(error)
  }
})