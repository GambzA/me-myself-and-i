import type { ReactNode } from 'react'
import { DragDropProvider } from '@dnd-kit/react'
import { useSortable } from '@dnd-kit/react/sortable'
import { move } from '@dnd-kit/helpers'

export interface DragHandleProps {
  ref: (element: Element | null) => void
  handleRef: (element: Element | null) => void
  isDragging: boolean
}

interface SortableListProps<T extends { id: number }> {
  items: T[]
  onReorder: (items: T[]) => void
  className?: string
  trailing?: ReactNode
  children: (item: T, index: number, drag: DragHandleProps) => ReactNode
}

export function SortableList<T extends { id: number }>({
  items,
  onReorder,
  className,
  trailing,
  children,
}: SortableListProps<T>) {
  return (
    <DragDropProvider
      onDragEnd={(event) => {
        if (event.canceled) return
        onReorder(move(items, event) as T[])
      }}
    >
      <div className={className}>
        {items.map((item, index) => (
          <SortableItem key={item.id} id={item.id} index={index}>
            {(drag) => children(item, index, drag)}
          </SortableItem>
        ))}
        {trailing}
      </div>
    </DragDropProvider>
  )
}

function SortableItem({
  id,
  index,
  children,
}: {
  id: number
  index: number
  children: (drag: DragHandleProps) => ReactNode
}) {
  const { ref, handleRef, isDragging } = useSortable({ id, index })
  return <>{children({ ref, handleRef, isDragging })}</>
}
