
import "./one-item-already.component.scss"
import { Arrow } from "./arrow";
import { StepsType } from "../../app/ui.slice/view.states";
import { ReactNode } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { setStep } from "../../app/ui.slice/ui.slice";

interface ArrowProps {
    step: StepsType
}
export function OneItemAlready(props: ArrowProps) {

    const dispatch = useDispatch<AppDispatch>()

    const getDescription = (content: { title: string, description: ReactNode }) => {
        return <div className="stepDescription">
            <div>{content.title}</div>
            <div>{content.description}</div>
        </div>
    }

    const getDescriptionByStep = (step: StepsType) => {
        const descriptionIdea = {
            title: `Idea`,
            description: <p>This column here is your <b>place for ideas!</b> Start by defining your <b>red thread</b>. These ideas you then can use to create the paragraph outline on the right. </p>
        }
        const descriptionOutlineForOutlining = {
            title: `Outline`,
            description: <p>The outline here is the heart of your text. Define the content as detailed as needed in bullet points. These points then will be used for the generation of the final paragraph. <br /><br /> The generation of the paragraph will happen in the <a onClick={() => dispatch(setStep("finalizing"))}><b>finalizing step</b>!</a></p>
        }
        const descriptionOutlineForFinalizing = {
            title: `Outline`,
            description: <p>The outline here is the one you wrote before in the outlining step. Now it is time to generate the final paragraph. Whenever you update the outline here, the paragraph on the right is regenerated.</p>
        }
        const descriptionFinal = {
            title: `Paragraph`,
            description: "In this column you will see the final generated paragraph. Feel free to refine and perfectionize it here! "
        }
        switch (step) {
            case "outlining":
                return <div className="indication">
                    {getDescription(descriptionIdea)}
                    {getDescription(descriptionOutlineForOutlining)}
                </div >

            case "finalizing":
                return <div className="indication">
                    {getDescription(descriptionOutlineForFinalizing)}
                    {getDescription(descriptionFinal)}
                </div>
        }

    }
    const getArrowByStep = (step: StepsType) => {
        switch (step) {
            case "outlining":
                return <div className="indication">
                    <div><Arrow transform="scale(1.3, 0.8) rotate(0)" /></div>
                    <div><Arrow transform="scale(-1,1.2) rotate(20)" /></div>
                </div>

            case "finalizing":
                return <div className="indication">
                    <div><Arrow transform="scale(0.8, 0.8) rotate(30)" /></div>
                    <div><Arrow transform="scale(-1.3, 0.8) rotate(20)" /></div>
                </div>
        }

    }
    return <div className="oneItemAlready">
        {getArrowByStep(props.step)}
        {getDescriptionByStep(props.step)}
    </div >
}