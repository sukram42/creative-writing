import React, { ReactNode } from "react";
import { StepsType, Views } from "../../app/ui.slice/view.states";
import { Description } from "./description.component";

export function ParagraphDescription() {
    return <Description
        column={[3]}
        description={`This column shows the final paragraphs. Feel free to update or regenerate the paragraph. Or use the AI to refine it!`}
        header={"Paragraph"}>
    </Description>
}

export function OutlineDescription() {
    return <Description
        column={[2]}
        description={`In this column, you can create the outline for the different paragraphs. How do you want set up your argument?`}
        header={"Outline"}>
    </Description>
}

export function IdeaDescription() {
    return <Description
        column={[1]}
        description={`The column is your idiation space. Scope the main story line of your text.`}
        header={"Rough Idea"}>
    </Description>
}

export function OutliningDescription() {
    return <Description
        column={[1, 2]}
        description={`In this step you can draft the first idea of the text. Start with your ideas in the left column (for ideas). From this you can derive the paragraph outline (the right column).`}
        header={"Outlining"}>
    </Description>
}
export function FinalizingDescription() {
    return <Description
        column={[2, 3]}
        description={`For the finalizing you will see your outline in the left column. The final paragraph will appear on the right side.`}
        header={"Finalizing"}>
    </Description>
}

export const StepDescriptionMapping: Record<StepsType, ReactNode> = {
    "outlining": <OutliningDescription />,
    "finalizing": <FinalizingDescription />
}


export const ViewDescriptionMapping: Record<Views, ReactNode> = {
    final: <ParagraphDescription />,
    idea: <IdeaDescription />,
    outline: <OutlineDescription />

}