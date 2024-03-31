import { useDispatch, useSelector } from "react-redux"
import { getCounter } from "../../app/ui.slice/ui.slice.selectors"
import { Button } from "antd"
import { AppDispatch } from "../../app/store"
import { addToCount } from "../../app/ui.slice/ui.slice"

export function TextOutlinePane() {

    const count = useSelector(getCounter)
    const dispatch = useDispatch<AppDispatch>()

    return <>
        content {count}
        <Button onClick={() => { dispatch(addToCount(3)) }}>Test</Button>
    </>
}