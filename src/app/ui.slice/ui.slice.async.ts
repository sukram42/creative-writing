import { createAsyncThunk } from "@reduxjs/toolkit";
import { Chapter, supabase } from "../supabaseClient";
import { StringGradients } from "antd/es/progress/progress";

export const getChaptersByProject = createAsyncThunk(
    "ui/getChaptersByProject",
    async (projectId: string) => {
        let { data: chapters } = await supabase
            .from('chapters')
            .select('*')
            .eq('project', projectId)

        let items = await Promise.all(chapters.map(async (chapter: Chapter) => {
            let { data: items } = await supabase
                .from("items")
                .select("*")
                .eq("chapter", chapter.chapter_id)
            return {[chapter.chapter_id]: items}

        })).then(items=>{
            return items.reduce((a: any[], b: any[])=>({...a, ...b}), {})
        })

        return {chapters, items}
    }
)

export const upsertChapterTitle = createAsyncThunk(
    "ui/updateChapter", 
    async (payload: {chapterId: string, newTitle: string}) => {
           const { data: updatedChapter } = await supabase
            .from('chapters')
            .update({ title: payload.newTitle })
            .eq('chapter_id', payload.chapterId)
            .select()

            return updatedChapter
    }
)