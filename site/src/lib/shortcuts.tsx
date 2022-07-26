import { createShortcut as _createShortcut } from "@solid-primitives/keyboard"
import { ReactiveSet } from '@solid-primitives/set'
import { useIsRouting, useNavigate } from "solid-app-router"
import { createEffect, createSignal, onMount } from "solid-js"
import { Portal } from "solid-js/web"
import { JSX } from "solid-js/web/types/jsx"

export const isTyping = new ReactiveSet()

export const createShortcut: typeof _createShortcut = (...params) => {
  createEffect(() => {
    if (useIsRouting()) isTyping.clear()
  })

  const oldCallback = params[1]
  params[1] = () => {
    if (isTyping.size == 0 && !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) oldCallback()
  }
  params[2] = {
    ...params[2],
    preventDefault: false
  }
  return _createShortcut(...params)
}

export function activeStateListener(input: InputEvent) {
  const target = input.target as HTMLInputElement | HTMLTextAreaElement
  if (target.value != '') {
    isTyping.add(target)
  } else {
    isTyping.delete(target)
  }
}

const popups: JSX.Element[] = []
export const [popup, setPopup] = createSignal<false | 'goto'>(false)

export function Popup(props: {
  children: JSX.Element
  callback: (event: Event & {
    submitter: HTMLElement;
  } & {
    currentTarget: HTMLFormElement;
    target: Element;
  },data: FormData) => void
}) {
  let formElm: HTMLFormElement
  const form = <form ref={formElm} class="putInCenter" onSubmit={(e) => {
    e.preventDefault()
    props.callback(e,new FormData(formElm))
  }}>
    {props.children}
  </form>
  onMount(() => {
    const input: HTMLInputElement | HTMLTextAreaElement | undefined = formElm
      .querySelector('input,textarea')
    input.focus()
  })
  return form
}

//createEffect(() => {
//  if (popup() == 'goto') {
//    let input: HTMLInputElement
//    <Portal>
//      <form class="putInCenter" onSubmit={
//        (e) => {
//          e.preventDefault()
//          navigate(`/letter/${input.value}`)
//        }
//      }>
//        <input type="number" ref={input} min='0' max='9999999' placeholder="Enter a letter ID"/>
//      </form>
//    </Portal>
//    input.focus()
//    createShortcut(['Escape'], () => {
//      setPopup(false)
//    })
//  }
//})