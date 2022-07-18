import { createShortcut as _createShortcut } from "@solid-primitives/keyboard"
import { ReactiveSet } from '@solid-primitives/set'
import { useIsRouting } from "solid-app-router"
import { createMemo } from "solid-js"

export const isTyping = new ReactiveSet()

export const createShortcut: typeof _createShortcut = (...params) => {
    createMemo(() => {
        if (useIsRouting()) isTyping.clear()
    }) 
    
    const oldCallback = params[1]
    params[1] = () => {
        if (isTyping.size == 0 && !['INPUT','TEXTAREA'].includes(document.activeElement.tagName) ) oldCallback()
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