import { createAsyncThunk } from "@reduxjs/toolkit";
import { ItemV2, supabase } from "../supabaseClient";
import { resolveErrorParagraph, setErrorParagraph, setItemToLoad, stopItemFromLoading, updateItemTextV2 } from "../items.slice/item.slice";
import { fetchItemVersions } from "../items.slice/item.slice.async";


export const outline2textCompletion = createAsyncThunk(
    "ui/testEdgeFunctions",
    async (payload: { paragraph: ItemV2, project_id: string }, thunkAPI) => {
        thunkAPI.dispatch(resolveErrorParagraph(payload.paragraph.item_id))
        thunkAPI.dispatch(setItemToLoad(payload.paragraph.item_id))

        const { data, error } = await supabase.functions.invoke('mistral', {
            body: { paragraph: payload.paragraph.item_id, project_id: payload.project_id },
        })
        thunkAPI.dispatch(stopItemFromLoading(payload.paragraph.item_id))

        if (error) {
            // Rollback
            thunkAPI.dispatch(setErrorParagraph({ paragraphId: payload.paragraph.item_id, errorCode: "It seems like there was an issue with the generation of the paragraph. Just try it again." }))
            return
        }
        thunkAPI.dispatch(updateItemTextV2({
            field: "final",
            item: payload.paragraph,
            newText: data.result
        }))
        thunkAPI.dispatch(stopItemFromLoading(payload.paragraph.item_id))
        thunkAPI.dispatch(fetchItemVersions(payload.paragraph))
    }
)