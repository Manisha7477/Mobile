// import { IUser } from "@/utils/types"

// import Dashboard from "@/routes/LandingPage/Dashboard"

// interface IHomeProps {
//   user: IUser | null
//   accessToken: IUser["accessToken"]

//   isOpenMenu: boolean
// }

// const MyDashboard: React.FunctionComponent<IHomeProps> = ({
//   user,

//   isOpenMenu,
// }) => {
//   switch (user?.role) {
//     case "Admin":
//       return <Dashboard isOpenMenu={isOpenMenu} />
//     // change here to return the correct dashboard component based on user role
//     case "Engineer":
//       return <Dashboard isOpenMenu={false} />
//     case "Operator":
//       return <Dashboard isOpenMenu={false} />
//     case "Manager":
//       return <Dashboard isOpenMenu={false} />
//     default:
//       return (
//         <div className="w-full text-center bg-background">Coming Soon!</div>
//       )
//   }
// }

// export default MyDashboard


import { IUser } from "@/utils/types"

import Dashboard from "@/routes/LandingPage/Dashboard"

interface IHomeProps {
  user: IUser | null

  isOpenMenu: boolean
}

const MyDashboard: React.FunctionComponent<IHomeProps> = ({
  user,

  isOpenMenu,
}) => {
  switch (user?.role) {
    case "Admin":
      return <Dashboard isOpenMenu={isOpenMenu} />
    // change here to return the correct dashboard component based on user role
    case "Engineer":
      return <Dashboard isOpenMenu={false} />
    case "Operator":
      return <Dashboard isOpenMenu={false} />
    case "Manager":
      return <Dashboard isOpenMenu={false} />
    default:
      return (
        <div className="w-full text-center bg-background">Coming Soon!</div>
      )
  }
}

export default MyDashboard