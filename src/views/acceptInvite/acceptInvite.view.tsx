import { useNavigate, useSearchParams } from "react-router-dom";

import "./acceptInvite.view.scss"

export const AcceptInvite = () => {

    const [searchParams] = useSearchParams();
    const redirectLink = searchParams.get("redirectLink");
    const email = searchParams.get("email");

    const navigate = useNavigate()

    const returnToMain = () => {
        navigate("/")
    }
    const acceptInvite = () => {
        window.location.href = redirectLink || "";
    };

    return (
        <div className="AcceptInviteView">
            <div className={"header"}>
                <h1>You got invited to Outl<b>ai</b>n</h1>
                <p>Do you {email}, want to be able to create amazing texts???</p>
            </div>
            <div className="buttons">
                <div className="button yesButton" onClick={() => acceptInvite()}>
                    <div>Yes!*</div>
                    <div>*I want to be able to convert my thoughts in
                        amazing texts worth reading!</div>
                </div>
                <div className="button noButton" onClick={() => returnToMain()}>
                    <div>No!*</div>
                    <div>*I don’t want to share my thoughts in a  well written way
                        because there is a chance that people could understand me.</div>
                </div>
                <div className="button maybeButton" onClick={() => returnToMain()}>
                    <div>Maybe!</div>
                    <div>But first I need more information about Outl<b>ai</b>n!</div>
                </div>
            </div>
            <div className="footer">{redirectLink}</div>
        </div>
    )
}