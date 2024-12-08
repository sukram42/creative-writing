import { setActiveFocus } from "../app/items.slice/item.slice"
import { createNewItem, deleteItemAsyncV2, updateItemLocked } from "../app/items.slice/item.slice.async"
import { store } from "../app/store"
import { ItemV2 } from "../app/supabaseClient"
import { setStep } from "../app/ui.slice/ui.slice"
import { Views } from "../app/ui.slice/view.states"



export const handleKeyDownInEditor = ((e, index: number, item: ItemV2, view: Views) => {
    if (e.ctrlKey && e.key === "l") {
        store.dispatch(updateItemLocked({ item: item, newLocked: !item.locked }))
        e.preventDefault()
    }
    if (e.ctrlKey && e.key === "Enter") {
        store.dispatch(createNewItem({ idx: index + 1, type: "PARAGRAPH" }))
        store.dispatch(setActiveFocus({ side: view, index: index! + 1 }))
    }
    if (e.ctrlKey && e.key === "Backspace" && e.target.getHTML() === "<p><br></p>") {
        store.dispatch(deleteItemAsyncV2(item))
        store.dispatch(setActiveFocus({ side: view, index: index! - 1 }))
    }
    if (e.ctrlKey && e.altKey && e.key == "ArrowDown") {
        store.dispatch(setActiveFocus({ side: view, index: index! + 1 }))
    }
    if (e.ctrlKey && e.altKey && e.key == "ArrowUp") {
        store.dispatch(setActiveFocus({ side: view, index: index! - 1 }))
    }

    if (view == "idea") {
        if (e.ctrlKey && e.altKey && e.key == "ArrowRight") {
            store.dispatch(setActiveFocus({ side: "outline", index: index! }))
        }
    } else if (view == "outline") {
        if (e.ctrlKey && e.altKey && e.key == "ArrowRight") {
            console.log(store.getState().ui.step)
            if (store.getState().ui.step === "outlining") {
                store.dispatch(setStep("finalizing"))
            }
            store.dispatch(setActiveFocus({ side: "final", index: index! }))
        }
        if (e.ctrlKey && e.altKey && e.key == "ArrowLeft") {
            if (store.getState().ui.step === "finalizing") {
                store.dispatch(setStep("outlining"))
            }
            store.dispatch(setActiveFocus({ side: "idea", index: index }))
        }
    } else if (view == "final") {
        if (e.ctrlKey && e.altKey && e.key == "ArrowLeft") {
            store.dispatch(setActiveFocus({ side: "outline", index: index }))
        }
    }
})