import { useDispatch, useSelector } from "react-redux"
import { getActiveProject, getChapters, getCounter, getItems } from "../../app/ui.slice/ui.slice.selectors"
import { AppDispatch } from "../../app/store"
import { getChaptersByProject } from "../../app/ui.slice/ui.slice.async"
import { useEffect } from "react"
import { ChapterComponent } from "../chapter/chapter.component"

export function TextOutlinePane() {

    const activeProject = useSelector(getActiveProject)

    const items = useSelector(getItems)
    const chapters = useSelector(getChapters)

    const dispatch = useDispatch<AppDispatch>()

    // useEffect(() => store.dispatch(handleAppInit()), []);
    useEffect(() => {
        dispatch(getChaptersByProject(activeProject))
    }, [dispatch])

    return <>
      {chapters.map((c)=><ChapterComponent chapter={c} items={items[c.chapter_id]}></ChapterComponent>)}  
    </>
}