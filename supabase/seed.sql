
--
-- Data for Name: prompts; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."prompts" ("id", "prompt", "temperature", "model_name") VALUES
	('outline2text', 'Take a deep breath and imagine that you are an assistant helping to write professional texts. You are tasked to return a paragraph based on the following outline without adding any additional facts:

\n\n 
${outline}
\n\n

The document the paragraph will be part of is called: ${documentTitle}

This is a description of the purpose of the document: 
\n
${description}
\n\n

The paragraph needs to be grammatically correct and maintain the sequence of the bullet points.
The paragraph should furthermore follow this description:
\n
${paragraphDefinition}
\n\n

The tone of the paragraph should follow this description:
\n
${languageDescription}
\n\n

The paragraph must be written in the ${outputLanguage} language. Do not add any translation.

Do not add any new information that is not already present in the bullet point.
If you need more information to write the paragraph, please indicate this by including the tag ''<b>[NEED MORE INFO: specific question about the missing information]</b>'' in your response. 


\n\n ${outputLanguage} Paragraph:', 0.9, 'open-mixtral-8x22b');

