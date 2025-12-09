import React from "react"
import { useLocation } from "react-router-dom"

export const classNames = (...classes: string[]) =>
  classes.filter(Boolean).join(" ")

export const useQuery = () => {
  const { search } = useLocation()

  return React.useMemo(() => new URLSearchParams(search), [search])
}
