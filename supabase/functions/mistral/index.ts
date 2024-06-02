// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import MistralClient from 'https://esm.sh/@mistralai/mistralai'
import { corsHeaders } from '../_shared/cors.ts'
import { Prompt} from '../_shared/prompt.service.ts'

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

    const finalPrompt = outlinePrompt.render({ project: project, item: data[0] })
  
    // const Create the response
    const chatResponse = await mistral_client.chat({
      model: outlinePrompt.prompt.model_name,
      temperature: outlinePrompt.prompt.temperature,
      responseFormat: {type: 'json_object'},
      messages: [{ role: 'system', content: finalPrompt }],
    });
    console.log("First draft:", chatResponse.choices[0].message.content)
    console.log("==================================")
    const finalFeedbackPrompt = feedbackPrompt.render({ project: project, item: data[0] })

    //get feedback
    const feedback = await mistral_client.chat({
      model: feedbackPrompt.prompt.model_name,
      temperature: feedbackPrompt.prompt.temperature,
      messages: [{ role: "system", content: finalFeedbackPrompt }]
    })
    console.log("==================================")
    console.log("Feedback", feedback.choices[0].message.content)

    const finalIncorporateFeedbackPrompt = incorporateFeedbackPrompt.render({ project: project, item: data[0] })

    //get feedback
    const finalParagraph = await mistral_client.chat({
      model: feedbackPrompt.prompt.model_name,
      temperature: feedbackPrompt.prompt.temperature,
      messages: [{ role: "system", content: finalPrompt },
      { role: "assistant", content: chatResponse.choices[0].message.content },
      { role: "user", content: finalIncorporateFeedbackPrompt }
      ]
    })

    console.log("==================================")
    console.log("RESULT /n", finalParagraph.choices[0].message.content)

    // Update the  item
    const { error } = await supabaseClient
      .from('items_v2')
      .update({ final: finalParagraph.choices[0].message.content })
      .eq("item_id", content.paragraph)
      .select()

    if (error) return getErrorResponse(error)

    return new Response(JSON.stringify({ result: finalParagraph.choices[0].message.content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    if (error) return getErrorResponse(error)
  }
})