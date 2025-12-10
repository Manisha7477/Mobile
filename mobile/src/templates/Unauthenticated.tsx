import { ReactNode } from "react"
interface IUnauthenticatedProps {
  children: ReactNode
  meta: React.ReactNode
}

const Unauthenticated = (props: IUnauthenticatedProps) => {
  return (
    <div className="h-full w-full text-base-content">
      {props.meta}
      <div className="min-h-full mx-auto max-w-screen-xl">{props.children}</div>
    </div>
  )
}

export default Unauthenticated
