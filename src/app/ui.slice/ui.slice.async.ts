import { createAsyncThunk } from "@reduxjs/toolkit";
import { Chapter, Item, Project, supabase } from "../supabaseClient";
import { locallyRemoveChapter, locallyUpdateChapterTitle, rmParagraphFromLoading, setItemsV2, setLoadChapter, setLoadingProjects, setParagraphToLoad, setProfile, updateActiveProject, updateChapters, updateItemText, updateItems, updateProjectName, updateProjects } from "./ui.slice";
import { RootState } from "../store";
import create from "@ant-design/icons/lib/components/IconFont";

export const setActiveProject = createAsyncThunk(
    "ui/getActiveProject",
    async (projectId: string, thunkAPI) => {
        const { data: activeProject } = await supabase
            .from("projects").select().eq('project_id', projectId)

        if (!activeProject) return
        thunkAPI.dispatch(updateActiveProject(activeProject[0] as Project))
    }
)

export const updateProjectField = createAsyncThunk(
    "ui/updateProjectField",
    async (payload: { field: string, newValue: string, projectId: string }) => {
        const { data } = await supabase
            .from("projects")
            .update({ [payload.field]: payload.newValue })
            .eq("project_id", payload.projectId)
            .select()
        console.log(data)
        return data
    }
)

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
        thunkAPI.dispatch(updateProjects(projects as Project[]))
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
        if (!payload.item.item_id) return

        let itemsBefore = state.ui.items[payload.item.chapter!]
        let newItems = [...itemsBefore]
        newItems.splice(payload.index, 0, payload.item as Item)

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

export const updateProjectNameAsync = createAsyncThunk(
    "ui/updateProjectNameAsync",
    async (payload: string, thunkAPI) => {
        const state = thunkAPI.getState() as RootState
        const oldProjectName = state.ui.activeProject?.name

        thunkAPI.dispatch(updateProjectName({ name: payload }))

        const { error } = await supabase
            .from('projects')
            .update({ name: payload, project_id: state.ui.activeProject?.project_id })
            .eq('project_id', state.ui.activeProject?.project_id)
            .select()

        if (error) {
            console.error(error)
            thunkAPI.dispatch(updateProjectName({ name: oldProjectName || "" }))
        }

    }
)


export const deleteItem = createAsyncThunk(
    "ui/deleteItem",
    async (payload: Item, thunkAPI) => {
        const chapter = (thunkAPI.getState() as RootState).ui.items[payload.chapter]
        const newChapter = chapter.filter((elem) => elem.item_id !== payload.item_id)


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



export const mistralCompletion = createAsyncThunk(
    "ui/testEdgeFunctions",
    async (payload: { paragraph: Item, project_id: string }, thunkAPI) => {

        thunkAPI.dispatch(setParagraphToLoad(payload.paragraph.item_id))

        const { data } = await supabase.functions.invoke('mistral', {
            body: { paragraph: payload.paragraph.item_id, project_id: payload.project_id },
        })

        thunkAPI.dispatch(updateItemText({
            field: "final",
            item: payload.paragraph,
            newText: data.result
        }))
        thunkAPI.dispatch(rmParagraphFromLoading(payload.paragraph.item_id))
        // Update the data
    }
)

export const deleteProject = createAsyncThunk(
    "ui/deleteProject",
    async (payload: string, thunkAPI) => {
        const state = thunkAPI.getState() as RootState
        const projectsBefore = state.ui.projects

        const projectsAfter = projectsBefore.filter((proj) => proj.project_id !== payload)
        thunkAPI.dispatch(updateProjects(projectsAfter))
        const { error } = await supabase.from("projects").delete()
            .eq('project_id', payload)

        if (error) {
            thunkAPI.dispatch(updateProjects(projectsBefore))
        }

    }
)

export const createProject = createAsyncThunk(
    "ui/createProject",
    async (payload: Partial<Project>) => {

        const { data, error } = await supabase.from("projects").insert(payload).select()
        console.log("Error creating project", error, data)
        return data![0]
    }
)

export const fetchProfile = createAsyncThunk(
    "ui/getProfile",
    async (_0, thunkAPI) => {
        const { data, error } = await supabase.from("profiles").select("*")
        if (error) {
            console.log("Error getting profile", error)
        }
        thunkAPI.dispatch(setProfile(data![0]))
    }
)

export const loadItemsV2 = createAsyncThunk(
    "ui/loadItemsV2",
    async (payload: string, thunkAPI) => {
        const { data, error } = await supabase
            .from("items_v2")
            .select("*")
            .eq("project_id", payload)
            .order("rank", {ascending: true}) 

        console.log(data)
        thunkAPI.dispatch(setItemsV2({items: data}))
    }
)