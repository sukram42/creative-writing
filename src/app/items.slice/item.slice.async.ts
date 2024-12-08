import { createAsyncThunk } from "@reduxjs/toolkit";
import { ItemType, ItemV2, supabase } from "../supabaseClient";
import { setItemsV2, updateItemTextV2, updateItemType, updateItemsV2, updateLockedState } from "./item.slice";
import { RootState } from "../store";
import { setLoadProject } from "../ui.slice/ui.slice";
import { v4 } from "uuid";

export const loadItemsV2 = createAsyncThunk(
    "items/loadItems",
    async (payload: string, thunkAPI) => {
        thunkAPI.dispatch(setLoadProject(true))
        const { data, error } = await supabase
            .from("items_v2")
            .select("*")
            .eq("project_id", payload)
            .order("rank", { ascending: true })

        if (error) {
            console.error(error.message)
        } else {
            thunkAPI.dispatch(setItemsV2({ items: data }))
        }
        thunkAPI.dispatch(setLoadProject(false))
    }
)

export const createNewItem = createAsyncThunk(
    "items/createNewItem",

    async (payload: { idx: number, type?: ItemType }, thunkAPI) => {
        const item = {
            version: 0,
            item_id: v4(),
            rank: payload.idx,
            type: payload.type?.toString() || "PARAGRAPH"
        } as ItemV2
        if (payload.type === "H1") {
            item["outline"] = ""
        }

        thunkAPI.dispatch(upsertNewItem(item))

    }
)
export const upsertNewItem = createAsyncThunk(
    "items/upsertNewItem",
    async (payload: Partial<ItemV2>, thunkAPI) => {
        const state = thunkAPI.getState() as RootState

        // if (!payload.item.item_id) return

        let itemsBefore = state.items.itemsV2

        let newItems = [...itemsBefore]
        newItems.splice(payload.rank!, 0, payload as ItemV2)

        payload.project_id = state.ui.activeProject?.project_id
        if (!payload.project_id) return
        thunkAPI.dispatch(updateItemsV2({
            items: newItems
        }))
        const { data, error } = await supabase
            .from('items_v2')
            .upsert(payload)
            .select()
            .order("rank")

        if (error) {
            // Rollback
            console.error(error)
            thunkAPI.dispatch(updateItemsV2({
                items: itemsBefore
            }))
            return
        }
        let itemsFinal = [...itemsBefore]
        itemsFinal.splice(payload.rank!, 0, data![0])

        thunkAPI.dispatch(updateItemsV2({
            items: itemsFinal
        }))
    }
)

export const updateItemTextV2Async = createAsyncThunk(
    "items/updateItemText",
    async (payload: { item: ItemV2, newText: string, field: "final" | "outline" | "idea" }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const beforeItems = state.items.itemsV2

        thunkAPI.dispatch(updateItemTextV2({
            item: payload.item,
            newText: payload.newText,
            field: payload.field
        }))

        const { data: updatedChapter, error } = await supabase
            .from('items_v2')
            .update({ [payload.field]: payload.newText })
            .eq("item_id", payload.item.item_id)
            .select()

        if (error) {
            // Rollback
            console.error(error)
            thunkAPI.dispatch(updateItemsV2({ items: beforeItems }))
            return
        }

        return updatedChapter
    }
)
export const updateItemTypeAsync = createAsyncThunk(
    "items/updateItemType",
    async (payload: { item: ItemV2, newType: ItemType }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const beforeItems = state.items.itemsV2

        thunkAPI.dispatch(updateItemType(payload))

        const { data: updatedItem, error } = await supabase
            .from('items_v2')
            .update({ type: payload.newType })
            .eq("item_id", payload.item.item_id)
            .select()

        if (error) {
            // Rollback
            console.error(error)
            thunkAPI.dispatch(updateItemsV2({ items: beforeItems }))
            return
        }
        else console.log(updatedItem)
        return updatedItem
    }
)
export const updateItemLocked = createAsyncThunk(
    "items/updateItemLocked",
    async (payload: { item: ItemV2, newLocked: boolean }, thunkAPI) => {
        const state = thunkAPI.getState() as RootState;
        const beforeItems = state.items.itemsV2

        thunkAPI.dispatch(updateLockedState(payload))
        const { data: updatedItem, error } = await supabase
            .from('items_v2')
            .update({ locked: payload.newLocked })
            .eq("item_id", payload.item.item_id)
            .select()

        if (error) {
            // Rollback
            console.error(error)
            thunkAPI.dispatch(updateItemsV2({ items: beforeItems }))
            return
        }
        return updatedItem
    }
)
export const deleteItemAsyncV2 = createAsyncThunk(
    "items/deleteItem",
    async (payload: ItemV2, thunkAPI) => {
        const state = (thunkAPI.getState() as RootState)
        const beforeItems = state.items.itemsV2
        const newItems = beforeItems.filter((elem) => elem.item_id !== payload.item_id)

        thunkAPI.dispatch(updateItemsV2({ items: newItems }))

        supabase.from("items_v2")
            .delete()
            .eq("item_id", payload.item_id)
            .then((data) => {
                if (data.error) {
                    thunkAPI.dispatch(updateItemsV2({ items: beforeItems }))
                }
            })
    })
