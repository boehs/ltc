import { createShortcut as _createShortcut } from "@solid-primitives/keyboard"
import { ReactiveSet } from '@solid-primitives/set'

export const isTyping = new ReactiveSet()

export const createShortcut: typeof _createShortcut = (...params) => {
    const oldCallback = params[1]
    params[1] = () => {
        if (isTyping.size == 0 && document.activeElement.tagName != 'INPUT') oldCallback()
    }
    params[2] = {
        ...params[2],
        preventDefault: false
    }
    return _createShortcut(...params)
}

export function activeStateListener(input: InputEvent) {
    if (input.target.value != '') {
        isTyping.add(input.target)
    } else {
        isTyping.delete(input.target)
    }
}