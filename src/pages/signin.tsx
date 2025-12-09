import { AppConfig } from "@/utils/AppConfig"
import Meta from "@/layout/Meta"
import { useEffect, useState } from "react"
import SignInForm from "@/navigation/SignInForm"

const Signin = () => {
  const [isSSR, setIsSSR] = useState(false)

  useEffect(() => {
    setIsSSR(true)
  }, [])

  return (
    <>
      <Meta />
      {isSSR && (
        <div className="min-h-screen  px-4 md:px-10 bg-primary">
          <div className="flex min-h-screen items-center justify-center">
            <div className="mx-auto w-3/4 text-center">
              {/* <div className="flex items-center justify-center">
                {AppConfig.logoPath && (
                  <img
                    className="mr-2 h-10 w-auto"
                    src={AppConfig.logoPath}
                    alt="app-logo"
                  />
                )}
              </div> */}
              <div className="text-center text-xl my-4 text-base-100">
                <div className="text-center text-xl my-4 text-base-100">
                  {AppConfig.siteName}
                </div>
              </div>
              {/* <div className="my-4">{MetaData.description}</div> */}
              <div className="flex items-center justify-center">
                <SignInForm />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Signin
