import { ReactRenderer } from '@tiptap/react'
import tippy, { GetReferenceClientRect, Instance } from 'tippy.js'
import { VariableList } from './variable-list'
import { SuggestionOptions } from '@tiptap/suggestion'

export const suggestions: Omit<SuggestionOptions, 'editor'> = {
  items: ({ query }) => {
    return [query.toLowerCase()]
  },

  render: () => {
    let component: ReactRenderer<any>
    let popup: Instance[] | null = null

    return {
      onStart: (props) => {
        component = new ReactRenderer(VariableList, {
          props,
          editor: props.editor,
        })

        if (!props.clientRect) {
          return
        }

        popup = tippy('body', {
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: 'manual',
          placement: 'bottom-start',
        })
      },

      onUpdate(props) {
        component.updateProps(props)

        if (!props.clientRect) {
          return
        }

        popup?.[0]?.setProps({
          getReferenceClientRect: props.clientRect as GetReferenceClientRect,
        })
      },

      onKeyDown(props) {
        if (props.event.key === 'Escape') {
          popup?.[0].hide()

          return true
        }

        return component.ref?.onKeyDown(props)
      },

      onExit() {
        popup?.[0].destroy()
        component.destroy()
      },
    }
  },
}
