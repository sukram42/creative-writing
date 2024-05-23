import { createAsyncThunk } from "@reduxjs/toolkit";
import { ItemType, ItemV2, supabase } from "../supabaseClient";
import { setItemsV2, updateItemTextV2, updateItemType, updateItemsV2 } from "./item.slice";
import { RootState } from "../store";

export const loadItemsV2 = createAsyncThunk(
    "items/loadItems",
    async (payload: string, thunkAPI) => {
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
        else console.log(data)

        let itemsFinal = [...itemsBefore]
        itemsFinal.splice(payload.rank!, 0, data![0])

        thunkAPI.dispatch(updateItemsV2({
            items: itemsFinal
        }))
    }
)

export const updateItemTextV2Async = createAsyncThunk(
    "items/updateItemText",
    async (payload: { item: ItemV2, newText: string, field: "final" | "outline" }, thunkAPI) => {
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
        else console.log(updatedChapter)

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
            .update({ type: payload.newType})
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
