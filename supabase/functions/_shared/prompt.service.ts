import handlebars from "https://esm.sh/handlebars"

export class Prompt {
    private template;
    public prompt;
    private message;

    constructor(prompt) {
        this.prompt = prompt
        this.template = handlebars.compile(prompt.prompt)
    }

    getMessage() {
        if (!this.message) {
            throw Error("The prompt needs to be rendered first.")
        }
        return this.message
    }

    render(input) {
        this.message = this.template(input)
        return this
    }
}