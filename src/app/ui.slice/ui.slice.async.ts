import { createAsyncThunk } from "@reduxjs/toolkit";
import { Chapter, supabase } from "../supabaseClient";
import { StringGradients } from "antd/es/progress/progress";
import { OmitProps } from "antd/es/transfer/ListBody";

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
    "ui/updateChapterTitle", 
    async (payload: {chapterId: string, newTitle: string}) => {
           const { data: updatedChapter } = await supabase
            .from('chapters')
            .update({ title: payload.newTitle })
            .eq('chapter_id', payload.chapterId)
            .select()

            return updatedChapter
    }
)

export const upsertItemText = createAsyncThunk(
    "ui/updateItemText", 
    async (payload: {itemId: string, newText: string, field: string}) => {
           const { data: updatedChapter } = await supabase
            .from('items')
            .update({ [payload.field]: payload.newText})
            .eq("id", payload.itemId)
            .select()

            return updatedChapter
    }
)