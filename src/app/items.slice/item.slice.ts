import { createSlice } from "@reduxjs/toolkit"
import { ItemV2 } from "../supabaseClient"
import { ItemsState } from "./item.slice.interface"

const initialState: ItemsState = {
  itemsV2: [],
}

export const itemsSlice = createSlice({
  "name": "items",
  initialState,
  reducers: {
    setItemsV2(state, action: { payload: { items: ItemV2[] } }) {
      state.itemsV2 = action.payload.items;
    },
    updateItemV2(state, action: { payload: { item: ItemV2 } }) {
      state.itemsV2.forEach((i: ItemV2) => {
        if (i.item_id === action.payload.item.item_id) {
          i = action.payload.item
          return
        }
      })
    },
    updateItemsV2(state, action: { payload: { items: ItemV2[] } }) {
      state.itemsV2 = action.payload.items
    },

    updateItemTextV2: (state, action: {
      payload: {
        item: ItemV2,
        newText: string,
        field: "final" | "outline"
      }
    }) => {
      state.itemsV2.forEach((i: ItemV2) => {
        if (i.item_id === action.payload.item.item_id) {
          i[action.payload.field] = action.payload.newText
          return
        }
      })
    },
    setItemToLoad: (state, action: { payload: string }) => {
      let data = new Set(state.loadingItems)
      data.add(action.payload)
      state.loadingItems = [...data]
    },
    stopItemFromLoading: (state, action: { payload: string }) => {
      let data = new Set(state.loadingItems)
      data.delete(action.payload)
      state.loadingItems = [...data]
    },
  }
})

export default itemsSlice.reducer
export const { setItemsV2, updateItemV2, updateItemsV2, updateItemTextV2, setItemToLoad, stopItemFromLoading } = itemsSlice.actions