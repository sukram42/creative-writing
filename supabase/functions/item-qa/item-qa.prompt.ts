const promptText = `
    You are an assistent of a professional writer. The writer will ask you to make small changes to the original text.
    Please only return the new text. Only change parts which you must change to follow the query. Leave the rest as it is.

    <query>
        {{query}}
    </query>
    <text>
        {{text}}
    </text>
`

const prompt = {
    prompt: promptText, model_name: "open-mixtral-8x22b", temperature: 0
}

export default prompt