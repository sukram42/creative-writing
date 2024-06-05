import { Prompt } from "./prompt.service.ts";
import MistralClient from 'https://esm.sh/@mistralai/mistralai'

interface LLM {

}

export class MistralLLM {
    private client;
    public chat;

    constructor(apiKey: string) {
        this.client = new MistralClient(apiKey);
        this.chat = this.client.chat
    }

    async chatPrompt(prompt: Prompt ) {
        return this.client.chat({
            model: prompt.prompt.model_name,
            temperature: prompt.prompt.temperature,
            messages: [{ role: "system", content: prompt.getMessage()}]
        })
    }
}