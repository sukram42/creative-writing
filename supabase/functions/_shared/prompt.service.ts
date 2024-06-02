import handlebars from "https://esm.sh/handlebars"

export class Prompt {
    private template;
    public prompt;

    constructor(prompt) {
        this.prompt = prompt
        this.template = handlebars.compile(prompt.prompt)
    }

    render(input) {
        let a = this.template(input)
        console.error("======================")
        console.error(a)
        console.error("======================")
        return a
    }
}