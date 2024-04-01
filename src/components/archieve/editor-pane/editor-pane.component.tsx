import { EditorComponent } from '../editor/editor.component'
import { useRef, useState } from 'react'

export function EditorPaneComponent() {

    const firstEditor = useRef()

    let initialBlocks = [
        {
            id: "12iM3lqzcm",
            type: "image",
            data: {
                text1:
                    "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text.",
                text2:
                    "Hey nochmal"
            }
        }]
    const [blocks, setBlocks] = useState(initialBlocks)

    const update = (data) => {
        setBlocks(data);
        firstEditor.current?.updateEditor()
    }
    return <>
        <EditorComponent blocks={blocks} identifier={"editor1"} onChange={(data) => { update(data.blocks) }} />
    </>
}