import { createAsyncThunk } from "@reduxjs/toolkit";
import { ItemV2, supabase } from "../supabaseClient";
import { setItemToLoad, stopItemFromLoading, updateItemTextV2 } from "../items.slice/item.slice";
import { rmParagraphFromLoading } from "../ui.slice/ui.slice";


export const outline2textCompletion = createAsyncThunk(
    "ui/testEdgeFunctions",
    async (payload: { paragraph: ItemV2, project_id: string }, thunkAPI) => {

        thunkAPI.dispatch(setItemToLoad(payload.paragraph.item_id))

        const { data } = await supabase.functions.invoke('mistral', {
            body: { paragraph: payload.paragraph.item_id, project_id: payload.project_id },
        })

        thunkAPI.dispatch(updateItemTextV2({
            field: "final",
            item: payload.paragraph,
            newText: data.result
        }))
        thunkAPI.dispatch(stopItemFromLoading(payload.paragraph.item_id))
    }
)