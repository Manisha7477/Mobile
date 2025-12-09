import * as React from "react"

type SelectProps = {
  defaultValue?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
}

type TriggerProps = {
  className?: string
  children?: React.ReactNode
}

type ContentProps = {
  children: React.ReactNode
}

type ItemProps = {
  value: string
  children: React.ReactNode
}

const SelectContext = React.createContext<{
  value: string
  setValue: (val: string) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
} | null>(null)

export const Select: React.FC<SelectProps> & {
  Trigger: React.FC<TriggerProps>
  Content: React.FC<ContentProps>
  Item: React.FC<ItemProps>
} = ({ defaultValue = "", onValueChange, children }) => {
  const [value, setValue] = React.useState(defaultValue)
  const [isOpen, setIsOpen] = React.useState(false)
  const selectRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (onValueChange) onValueChange(value)
  }, [value, onValueChange])

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <SelectContext.Provider value={{ value, setValue, isOpen, setIsOpen }}>
      <div ref={selectRef} className="relative inline-block">
        {children}
      </div>
    </SelectContext.Provider>
  )
}

const Trigger: React.FC<TriggerProps> = ({ className = "", children }) => {
  const context = React.useContext(SelectContext)

  if (!context) throw new Error("Trigger must be used within Select")

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    context.setIsOpen(!context.isOpen)
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`flex items-center justify-between min-w-[120px] border px-4 py-2 rounded bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:bg-gray-50 ${className}`}
    >
      <span>{context.value || children || "Select"}</span>
      <span
        className={`ml-2 transition-transform duration-200 ${
          context.isOpen ? "rotate-180" : ""
        }`}
      >
        ▼
      </span>
    </button>
  )
}

Trigger.displayName = "Select.Trigger"
Select.Trigger = Trigger

const Content: React.FC<ContentProps> = ({ children }) => {
  const context = React.useContext(SelectContext)

  if (!context) throw new Error("Content must be used within Select")

  if (!context.isOpen) return null

  return (
    <div className="absolute z-50 mt-1 bg-white border shadow-lg rounded-md min-w-full max-h-60 overflow-auto">
      {children}
    </div>
  )
}

Content.displayName = "Select.Content"
Select.Content = Content

const Item: React.FC<ItemProps> = ({ value, children }) => {
  const context = React.useContext(SelectContext)

  if (!context) throw new Error("Item must be used within Select")

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    context.setValue(value)
    context.setIsOpen(false)
  }

  const isSelected = context.value === value

  return (
    <div
      onClick={handleClick}
      className={`px-4 py-2 text-sm cursor-pointer transition-colors duration-150 ${
        isSelected ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-blue-50"
      }`}
    >
      {children}
    </div>
  )
}

Item.displayName = "Select.Item"
Select.Item = Item

export default Select
