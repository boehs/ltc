import { createShortcut as _createShortcut } from "@solid-primitives/keyboard"
import { createSignal, onCleanup } from "solid-js"

export const [isTyping, setIsTyping] = createSignal(new Set())

export const createShortcut: typeof _createShortcut = (...params) => {
    const oldCallback = params[1]
    params[1] = () => {
        if (!isTyping().size) oldCallback()
        else console.log('poo')
    }
    console.log(params)
    return _createShortcut(...params)
}

function activeStateListener(input: HTMLInputElement)  {
    input.value == '' ? setIsTyping((set) => set.add(input)) : setIsTyping((set) => {
        set.delete(input)
        return set
    })
}

export function activeState(form: HTMLFormElement) {
    const inputs = [...form.querySelectorAll('input')]
    inputs.forEach((input) => {
        input.addEventListener('input',() => activeStateListener(input))
    })
    
    onCleanup(() => inputs.forEach(input => input.removeEventListener('input',() => activeStateListener(input))))
}