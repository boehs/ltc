import { createShortcut as _createShortcut } from "@solid-primitives/keyboard"
import { ReactiveSet } from '@solid-primitives/set'
import { useIsRouting } from "solid-app-router"
import { createEffect, createSignal, onMount, Show } from "solid-js"
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

export const [activePopup, setActivePopup] = createSignal<false | JSX.Element>(false)

export function PopupPortal() {
  createEffect(() => {
    if (activePopup()) {
      _createShortcut(["Escape"], () => {
        setActivePopup(false)
      })
    }
  })
  return <Show when={activePopup()}>
    {activePopup()}
  </Show>
}

function _Popup(props: {
  children: JSX.Element,
  callback: (event: Event & {
    submitter: HTMLElement;
  } & {
    currentTarget: HTMLFormElement;
    target: Element;
  }, data: FormData) => void
}) {
  let formElm: HTMLFormElement
  const form = <form ref={formElm} class="putInCenter popup" onSubmit={(e) => {
    e.preventDefault()
    props.callback(e, new FormData(formElm))
    setActivePopup(false)
  }}>
    {props.children}
  </form>
  return form
}

export function Popup(props: Parameters<typeof _Popup>[0] & {
  shortcut: Parameters<typeof createShortcut>[0]
}) {
  const popup = <_Popup callback={props.callback}>
    {props.children}
  </_Popup>
  createShortcut(props.shortcut, () => {
    setActivePopup(popup)
  })
  createEffect(() => {
    if (activePopup() == popup) {
      const input: HTMLInputElement | HTMLTextAreaElement | undefined = document
        .querySelector('.popup input,.popup textarea')
      input.focus()
      const listenerFn = () => {
        input.value = ''
        input.removeEventListener('onchange',listenerFn)
      }
      input.addEventListener('onchange',listenerFn)
      
    }
  })
  return <></>
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