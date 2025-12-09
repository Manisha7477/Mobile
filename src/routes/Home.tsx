import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface IHomeProps {
  accessToken: string // Add the accessToken property here
}

const Home: React.FunctionComponent<IHomeProps> = ({}) => {
  const navigate = useNavigate()

  useEffect(() => {
    navigate("my-dashboard")
  }, [])

  return <></>
}

export default Home
