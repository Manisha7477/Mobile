import { ReactNode, useEffect, useState } from "react"
import Authenticated from "@/templates/Authenticated"
import Unauthenticated from "@/templates/Unauthenticated"
import { useAuth } from "@/contexts/auth"
import Loading from "@/navigation/Loading"

type IMainProps = {
  children: ReactNode
  meta: ReactNode
}

const Main = (props: IMainProps) => {
  const { user, username, loading } = useAuth()
  const [loadedMain, setLoadedMain] = useState(false)

  useEffect(() => {
    if (!loadedMain) setLoadedMain(true)
  }, [loadedMain])

  if (loading) return <Loading />
  if (!user) return <Unauthenticated {...props} />

  return (
    <Authenticated user={user} username={username} meta={props.meta}>
      {/* {props.children} */}
      <div className="container mx-auto px-4">
        {props.children}
      </div>
    </Authenticated>
  )
}

export { Main }
