import { HiExclamation } from "react-icons/hi"
import { IUser } from "@/utils/types"

interface IAccessWrapperProps {
  user: IUser | null
  accessRole: boolean
  children: React.ReactNode
}

const AccessWrapper: React.FC<IAccessWrapperProps> = ({
  user,
  accessRole,
  children,
}) => {
  // Check for roleName instead of role
  if (!user || !(user.role || user.roleName) || !accessRole) {
    console.log("AccessWrapper Blocked:", {
      user,
      role: user?.role || user?.roleName,
      accessRole,
    })

    return (
      <div className="w-full items-center justify-center pt-24 md:pt-48 lg:pt-54">
        <div className="font-bold text-3xl px-6 text-center flex items-center justify-center">
          <HiExclamation className="w-10 h-10 text-error" />
        </div>
        <div className="px-6 text-lg text-center">Not Authorized</div>
      </div>
    )
  }

  return <div className="w-full">{children}</div>
}

export default AccessWrapper
