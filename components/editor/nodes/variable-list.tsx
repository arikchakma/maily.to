import { Button } from '@/components/ui/button'
import React, {
  forwardRef, useEffect, useImperativeHandle, useState,
} from 'react'

export const VariableList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const selectItem = (index: number) => {
    const item = props.items[index]

    if (item) {
      props.command({ id: item })
    }
  }

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length)
  }

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length)
  }

  const enterHandler = () => {
    selectItem(selectedIndex)
  }

  useEffect(() => setSelectedIndex(0), [props.items])

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: {
      event: KeyboardEvent
    }) => {
      if (event.key === 'ArrowUp') {
        upHandler()
        return true
      }

      if (event.key === 'ArrowDown') {
        downHandler()
        return true
      }

      if (event.key === 'Enter') {
        enterHandler()
        return true
      }

      return false
    },
  }))

  return (
    <div className="z-50 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
      {
        props?.items?.length
          ? props?.items?.map((item: string, index: number) => (
            <Button
              variant="secondary"
              key={index}
              onClick={() => selectItem(index)}
              className="px-2 py-1.5 h-full"

            >
              {item}
            </Button>
          ))
          : <Button variant="secondary"
            className="px-2 py-1.5 h-full"
          >No result</Button>
      }
    </div>
  )
})

VariableList.displayName = 'VariableList'
