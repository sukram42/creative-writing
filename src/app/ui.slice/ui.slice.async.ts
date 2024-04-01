import { createAsyncThunk } from "@reduxjs/toolkit";
import { Chapter, Item, supabase } from "../supabaseClient";
import { StringGradients } from "antd/es/progress/progress";
import { OmitProps } from "antd/es/transfer/ListBody";
import { createECDH } from "crypto";

export const getChaptersByProject = createAsyncThunk(
    "ui/getChaptersByProject",
    async (projectId: string) => {
        let { data: chapters } = await supabase
            .from('chapters')
            .select('*')
            .order("index")
            .eq('project', projectId)

        let items = await Promise.all(chapters.map(async (chapter: Chapter) => {
            let { data: items } = await supabase
                .from("items")
                .select("*")
                .eq("chapter", chapter.chapter_id)
                .order("rank_in_chapter")
            return { [chapter.chapter_id]: items }

        })).then(items => {
            return items.reduce((a: any[], b: any[]) => ({ ...a, ...b }), {})
        })

        return { chapters, items }
    }
)

export const upsertChapterTitle = createAsyncThunk(
    "ui/updateChapterTitle",
    async (payload: { chapterId: string, newTitle: string }) => {
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
    async (payload: { itemId: string, newText: string, field: string }) => {
        const { data: updatedChapter } = await supabase
            .from('items')
            .update({ [payload.field]: payload.newText })
            .eq("item_id", payload.itemId)
            .select()

        return updatedChapter
    }
)

export const upsertNewChapter = createAsyncThunk(
    "ui/upsertNewChapter",
    async (payload: { index: number, chapter: Chapter }, thunkAPI) => {
        // Update all of the ranks
        let { data: incrementData, error: incrementError } = await supabase
            .rpc('incrementchapterindex', {
                minrank: payload.index,
                project_id: payload.chapter.project
            })
        
        if (incrementError) console.error(incrementError)
        else console.log(incrementData)

        const { data, error } = await supabase
            .from('chapters')
            .upsert(payload.chapter)
            .select()
        if (error) console.error(error)
        else console.log(data)

        thunkAPI.dispatch(getChaptersByProject(payload.chapter.project!))
        return data
    }
)

export const upsertNewItem = createAsyncThunk(
    "ui/upsertNewItem",
    async (payload: { index: number, item: Item, project_id: string }, thunkAPI) => {
 
        let { data: incrementData, error: incrementError } = await supabase
            .rpc('incrementitemindex', {
                minrank: payload.index,
                chapter_id: payload.item.chapter
            })
        
        if (incrementError) console.error(incrementError)
        else console.log(incrementData)

        const { data, error } = await supabase
            .from('items')
            .upsert(payload.item)
            .select()
            .order("rank_in_chapter")
        if (error) console.error(error)
        else console.log(data)
        

        
        thunkAPI.dispatch(getChaptersByProject(payload.project_id))
    }

)