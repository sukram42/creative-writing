import { createAsyncThunk } from "@reduxjs/toolkit";
import { Chapter, Item, supabase } from "../supabaseClient";
import { locallyRemoveChapter, locallyUpdateChapterTitle, setLoadChapter, setLoadingProjects, updateChapters, updateItems, updateProjects } from "./ui.slice";
import { RootState } from "../store";


export const getChaptersByProject = createAsyncThunk(
    "ui/getChaptersByProject",
    async (projectId: string, thunkAPI) => {
        thunkAPI.dispatch(setLoadChapter(true))
        const { data: chapters } = await supabase
            .from('chapters')
            .select('*')
            .order("index")
            .eq('project', projectId)

        if (!chapters) return
        const items = await Promise.all(chapters.map(async (chapter: Chapter) => {
            const { data: items } = await supabase
                .from("items")
                .select("*")
                .eq("chapter", chapter.chapter_id)
                .order("rank_in_chapter")
            return { [chapter.chapter_id]: items }

        })).then(items => {
            thunkAPI.dispatch(setLoadChapter(false))
            return items.reduce((a, b) => ({ ...a, ...b }), {})
        })

        return { chapters, items }
    }
)

export const upsertChapterTitle = createAsyncThunk(
    "ui/updateChapterTitle",
    async (payload: { chapterId: string, newTitle: string }, thunkAPI) => {

        const state = thunkAPI.getState() as RootState

        const oldTitle = (state.ui.chapters.filter(c => c.chapter_id === payload.chapterId)[0] as Chapter).title
        thunkAPI.dispatch(locallyUpdateChapterTitle(payload))

        const { data: updatedChapter, error } = await supabase
            .from('chapters')
            .update({ title: payload.newTitle })
            .eq('chapter_id', payload.chapterId)
            .select()

        if (error) {
            thunkAPI.dispatch(locallyUpdateChapterTitle({ ...payload, newTitle: oldTitle || "" }))
        }

        return updatedChapter
    }
)

export const deleteChapter = createAsyncThunk(
    "ui/deleteChapter",
    async (payload: string, thunkAPI) => {
        const state = thunkAPI.getState() as RootState
        const oldItems = state.ui.items
        const oldChapter = [...state.ui.chapters]

        thunkAPI.dispatch(locallyRemoveChapter(payload))

        supabase.from("chapters")
            .delete()
            .eq("chapter_id", payload)
            .then((data) => {
                console.log("delete")
                if (data.error) {
                    thunkAPI.dispatch(updateChapters({ chapters: oldChapter }))
                    thunkAPI.dispatch(updateItems({ items: oldItems[payload], chapter: payload }))
                }
            })

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

export const loadProjects = createAsyncThunk(
    "ui/loadProjects",
    async (_0, thunkAPI) => {

        thunkAPI.dispatch(setLoadingProjects(true))
        const { data: projects } = await supabase.from("projects").select()
        thunkAPI.dispatch(updateProjects(projects))
        thunkAPI.dispatch(setLoadingProjects(false))
    }
)

export const upsertNewChapter = createAsyncThunk(
    "ui/upsertNewChapter",
    async (payload: { index: number, chapter: Partial<Chapter> }, thunkAPI) => {
        // Update all of the ranks
        const { error: incrementError } = await supabase
            .rpc('incrementchapterindex', {
                minrank: payload.index,
                project_id: payload.chapter.project
            })

        if (incrementError) console.error(incrementError)

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
    async (payload: { index: number, item: Partial<Item>, project_id: string }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState
        console.log("upsert", payload)
        if (!payload.item.item_id) return

        let itemsBefore = state.ui.items[payload.item.chapter!]
        let newItems = [...itemsBefore]
        newItems.splice(payload.index, 0, payload.item)

        console.log("test", newItems)
        thunkAPI.dispatch(updateItems({
            chapter: payload.item.chapter!,
            items: newItems
        }))

        const { data: incrementData, error: incrementError } = await supabase
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

        let itemsFinal = [...itemsBefore]
        itemsFinal.splice(payload.index, 0, data![0])

        thunkAPI.dispatch(updateItems({
            chapter: payload.item.chapter!,
            items: itemsFinal
        }))
    }
)


export const deleteItem = createAsyncThunk(
    "ui/deleteItem",
    async (payload: Item, thunkAPI) => {
        const chapter = (thunkAPI.getState() as RootState).ui.items[payload.chapter]
        const newChapter = chapter.filter((elem) => elem.item_id !== payload.item_id)

        console.log("Delete Item", payload.item_id, newChapter)

        thunkAPI.dispatch(updateItems({ items: newChapter, chapter: payload.chapter }))

        supabase.from("items")
            .delete()
            .eq("item_id", payload.item_id)
            .then((data) => {
                if (data.error) {
                    thunkAPI.dispatch(updateItems({ items: chapter, chapter: payload.chapter }))
                }
            })
            .then(() => supabase
                .rpc('decrementitemindex', {
                    minrank: payload.rank_in_chapter + 1,
                    chapter_id: payload.chapter
                }))
    })



export const testEdgeFunctions = createAsyncThunk(
    "ui/testEdgeFunctions",
    async (payload: { paragraph: string }) => {

        const {data} = await supabase.functions.invoke('mistral', {
            body: { paragraph: payload.paragraph },
        })
        console.log("daten", data)
        // Update the data
    }
)