import { createSlice } from "@reduxjs/toolkit"
import { ItemType, ItemV2 } from "../supabaseClient"
import { ItemsState } from "./item.slice.interface"

const initialState: ItemsState = {
  itemsV2: [],
  loadingItems: [],
  errorItems: {},

  activeFocusSide: "outline",
  activeFocusIndex: null
}

export const itemsSlice = createSlice({
  "name": "items",
  initialState,
  reducers: {
    setActiveFocusIndex(state, action: { payload: number | null }) {
      state.activeFocusIndex = action.payload
    },
    setActiveFocus(state, action: { payload: { side: "outline" | "final" | null, index: number | null } }) {
      state.activeFocusSide = action.payload.side;
      state.activeFocusIndex = action.payload.index
    },
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
    updateLockedState(state, action: { payload: { item: ItemV2, newLocked: boolean } }) {
      state.itemsV2.forEach((i: ItemV2) => {
        if (i.item_id === action.payload.item.item_id) {
          i["locked"] = action.payload.newLocked
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
    updateItemType: (state, action: {
      payload: {
        item: ItemV2,
        newType: ItemType
      }
    }) => {
      state.itemsV2.forEach((i: ItemV2) => {
        if (i.item_id === action.payload.item.item_id) {
          i['type'] = action.payload.newType
          i['outline'] = action.payload.item.outline
          i['final'] = action.payload.item.final
          return
        }
      })
    },
    setErrorParagraph: (state, action: { payload: { paragraphId: string, errorCode: string } }) => {
      state.errorItems[action.payload.paragraphId] = action.payload.errorCode
    },
    resolveErrorParagraph: (state, action: {payload: string})=> {
      delete state.errorItems[action.payload]
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
    }
  }
})

export default itemsSlice.reducer
export const { setItemsV2, updateItemV2, updateItemsV2, updateItemType, updateItemTextV2, setItemToLoad, stopItemFromLoading, setActiveFocus, setActiveFocusIndex, updateLockedState, setErrorParagraph, resolveErrorParagraph } = itemsSlice.actions