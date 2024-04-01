import EditorJS from "@editorjs/editorjs";
import { useRef, useEffect, useState } from "react";
import { SimpleImage } from "../example.tool";


export function EditorComponent(props) {
    const editor1 = useRef();

    //Initialize editorjs
    useEffect(() => {
        //Initialize editorjs if we don't have a reference
        if (!editor1.current) {
            const editor1 = new EditorJS({
                holder: `editorblock-${props.identifier}`,
                data: { blocks: props.blocks },
                async onChange(api, event) {
                    const data = await api.saver.save();
                    props.onChange(data)
                },
                tools: {
                    image: SimpleImage

                }
            });
            editor1.current = editor1;
        }

    }, []);
    return <>
        <div id={`editorblock-${props.identifier}`} />
    </>
}