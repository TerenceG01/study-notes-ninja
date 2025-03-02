
import { Action, ToasterToast } from "./types"
import { dispatch, TOAST_REMOVE_DELAY } from "./reducer"

// Counter for generating unique IDs
let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Toast = Omit<ToasterToast, "id">

export function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  // Automatically dismiss the toast after TOAST_REMOVE_DELAY
  setTimeout(() => {
    dismiss()
  }, TOAST_REMOVE_DELAY)

  return {
    id: id,
    dismiss,
    update,
  }
}

// Add dismiss method to toast function
toast.dismiss = (toastId?: string) => {
  dispatch({ type: "DISMISS_TOAST", toastId })
}
