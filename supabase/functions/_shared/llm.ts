import { Prompt } from "./prompt.service.ts";
import { Mistral } from 'mistral'
// import {Mistral} from "npm:@mistralai/mistralai"

interface LLM {

}

export class MistralLLM {
    private client;
    public chat;

    constructor(apiKey: string) {
        this.client = new Mistral({apiKey});
        this.chat = this.client.chat
    }

    async chatPrompt(prompt: Prompt) {
        return this.client.chat.complete({
            model: prompt.prompt.model_name,
            temperature: prompt.prompt.temperature,
            messages: [{ role: "system", content: prompt.getMessage() }]
        })
    }
}