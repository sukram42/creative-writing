
INSERT INTO
    auth.users (
        instance_id,
        id,
        aud,
        role,
        email,
        encrypted_password,
        email_confirmed_at,
        recovery_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) (
        select
            '00000000-0000-0000-0000-000000000000',
             uuid('00000000-0000-0000-0000-00000000000' || (ROW_NUMBER() OVER ())),
            'authenticated',
            'authenticated',
            'user' || (ROW_NUMBER() OVER ()) || '@example.com',
            crypt ('password123', gen_salt ('bf')),
            current_timestamp,
            current_timestamp,
            current_timestamp,
            '{"provider":"email","providers":["email"]}',
            '{}',
            current_timestamp,
            current_timestamp,
            '',
            '',
            '',
            ''
        FROM
            generate_series(1, 3)
    );

-- test user email identities
INSERT INTO
    auth.identities (
        id,
        user_id,
        -- New column
        provider_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) (
        select
            uuid_generate_v4 (),
            id,
            -- New column
            id,
            format('{"sub":"%s","email":"%s"}', id :: text, email) :: jsonb,
            'email',
            current_timestamp,
            current_timestamp,
            current_timestamp
        from
            auth.users
    );

--



--
-- Data for Name: prompts; Type: TABLE DATA; Schema: public; Owner: postgres
--
INSERT INTO "public"."prompts" ("id", "prompt", "temperature", "model_name") VALUES
('feedback', 'You are an extremly helpful writing proof reader. You will be provided with the original outline as well as with the resulting paragraph. Please check that there is only information from the outline incorporated to the paragraph.

Please give a constructive feedback to the paragraph. Give advise on how to improve the language of the paragraph.

<outline>
{{item.outline}}
</outline>

<paragraph>
{{input.paragraph}} 
</paragraph>', '1', 'open-mixtral-8x22b'),
('incorporateFeedback', 'Close your eyes and image that you are a helpful assistant which helps me to make a perfect paragraph out of my outline.

I got feedback from another person to my outline.

<outline>
{{item.outline}}
</outline>

<paragraph>
{{input.paragraph}}
</paragraph>

<feedback>
{{input.feedback}}
</feedback>

Please rewrite the paragraph by incorporating the feedback. If there is nothing to be improved, return the original paragraph.
 
The paragraph should follow the language description: 

<language_description>
{{project.language_description}}
</language_description>

Only return the rewritten paragraph. Nothing else.
Please rewrite the paragraph only in {{project.output_language}}.', '0', 'open-mixtral-8x22b'),
('outline2text', 'Take a deep breath and imagine that you are an assistant helping to write professional texts. You are tasked to return a paragraph based on the following outline without adding any additional facts:

<outline>
{{item.outline}}
</outline>

The document the paragraph will be part of is called: {{project.name}}
This is a description of the purpose of the document:

<description>
{{project.description}}
</description>

The paragraph needs to be grammatically correct and maintain the sequence of the bullet points. The paragraph must only consist of the information from the outline.

The paragraph should furthermore follow this description:

<paragraph_description>
{{project.paragraph_definition}}
<paragraph_description>

The tone of the paragraph should follow this description:

<language_description>
{{project.language_description}}
</language_description>

The paragraph must be written in the {{project.output_language}} language. Do not add any translation.

Do not add any new information that is not already present in the bullet point.
If you need more information to write the paragraph, please indicate this by including the tag ''<b>[NEED MORE INFO: specific question about the missing information]</b>'' in your response.
In case the outline does not give any information. Just answer with ''need more info''. Under no cirumstances invent anything.

The paragraph before the paragraph to be written is the following: 
<paragraph_before>
{{input.paragraph_before}}
</paragraph_before>

The paragraph to be written will be part of the following chapter:
<chapter_name>
{{input.header}}
</chapter_name>', '0', 'open-mixtral-8x22b'),
('outline2text_old', 'Take a deep breath and imagine that you are an assistant helping to write professional texts. You are tasked to return a paragraph based on the following outline without adding any additional facts:

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


\n\n ${outputLanguage} Paragraph:', '0.9', 'open-mixtral-8x22b');


--- Test Project
INSERT INTO "public"."projects" ("created_at", "name", "project_id", "created_by", "description", "target_group", "paragraph_definition", "language_description", "output_language") VALUES ('2024-04-27 11:22:34.010843+00', 'Travelsickness in Trains hnmmm u mean anywhere', '7e6183ec-bc0d-4b0d-89cb-2290f1992a95', '00000000-0000-0000-0000-000000000001', 'Travelsickness is a big problem nowadays. This blogarticle shows on where is it coming from? And what can we do? ', 'People with travel sickness. Mainly UI UX designers', 'Tet', 'Test123', 'German');

INSERT INTO "public"."items_v2" ("created_at", "rank", "outline", "final", "item_id", "type", "version", "project_id", "locked") VALUES ('2024-05-25 18:46:46.758265+00', '0', 'This is a new chapter to talk about ', null, 'b4ca6116-5741-4716-a614-6588254f4cda', 'H1', '0', '7e6183ec-bc0d-4b0d-89cb-2290f1992a95', 'false'), ('2024-05-25 18:48:05.06907+00', '1', '<ul><li>Finding a reason for a chapter is pretty difficult</li><li class="ql-indent-1">People spend years in warm countries</li><li class="ql-indent-1">Talking about muse</li><li class="ql-indent-1">and further</li><li class="ql-indent-1">still they dont find a reason for a text</li><li class="ql-indent-1">so how should we?</li></ul>', '<p>In Bezug auf die Schwierigkeit, einen Grund für ein Kapitel zu finden, ist es bemerkenswert, dass Menschen jahrelang in warmen Ländern verbringen und dennoch keinen Grund für einen Text finden. Wie können wir also einen finden? Es geht weiter darum, von der Muse zu sprechen und darüber hinaus. [NEED MORE INFO: Was ist die Zielsetzung des Dokuments "Travelsickness in Trains" und was ist das Thema des Dokuments?] [NEED MORE INFO: Was ist die Bedeutung der Tags "Test" und "Test123"?]</p>', 'cc9faac4-538b-464e-9eef-549be4a04395', 'PARAGRAPH', '0', '7e6183ec-bc0d-4b0d-89cb-2290f1992a95', 'false');

INSERT INTO "public"."chapters" ("chapter_id", "created_at", "title", "descriptions", "project", "index") VALUES ('c63a8061-446e-4a55-8b4e-27167c5424d4', '2024-04-27 11:22:47.889722+00', 'Travelsickness in Trains', '', '7e6183ec-bc0d-4b0d-89cb-2290f1992a95', '0');
