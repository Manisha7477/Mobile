import { useState } from "react"
import nookies from "nookies"
import { Formik, Form, Field, ErrorMessage, FormikValues } from "formik"
import { useRouter } from "next/router"
import * as Yup from "yup"
import Loading from "@/navigation/Loading"
import api from "../api/axiosInstance"
import { useUserStore } from "../store/user"

const SignInForm: React.FunctionComponent = () => {
  const router = useRouter()
  const [loginErrorMessage, setLoginErrorMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const { setUser } = useUserStore() 

  const onSignIn = async (signInValues: FormikValues) => {
    setLoading(true)
    setLoginErrorMessage("")
    try {
      const response = await api.post("/User/login", {
        username: signInValues.username,
        password: signInValues.password,
      })

      if (response.status === 200 && response.data.statusMessage === "Success") {
        const userData = response.data

        const { accessToken, refreshToken, userId } = userData

        // ⭐ Store tokens in cookies
        nookies.set(null, "token", accessToken, { path: "/", maxAge: 60 * 60 * 24 * 7 })
        nookies.set(null, "refreshToken", refreshToken, { path: "/", maxAge: 60 * 60 * 24 * 7 })
        nookies.set(null, "userId", userId.toString(), { path: "/", maxAge: 60 * 60 * 24 * 7 })

        // ⭐ Store user in Zustand
        setUser(userData)

        // ⭐ Store user in localStorage for persistence
        localStorage.setItem("userData", JSON.stringify(userData))

        // redirect to dashboard
        router.push("/")
      } else {
        setLoginErrorMessage("Invalid username or password.")
      }
    } catch (error: any) {
      setLoginErrorMessage(error?.response?.data?.message || "Incorrect Username or Password!")
    } finally {
      setTimeout(() => setLoading(false), 200)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-2xl px-4 py-6 w-full max-w-sm mx-auto">
      <div className="flex justify-center items-center mb-6">
        <img
          src="/assets/images/companylogo.png"
          className="h-16 md:h-20 cursor-pointer"
          alt="ems"
        />
      </div>
      {loading && <Loading color="text-base-100" />}
      {loginErrorMessage && (
        <div className="text-error text-sm text-left mb-4">{loginErrorMessage}</div>
      )}
      <Formik
        initialValues={{ username: "", password: "" }}
        validationSchema={Yup.object({
          username: Yup.string().required("Username is required."),
          password: Yup.string().required("Password is required."),
        })}
        onSubmit={(values, { setSubmitting }) => {
          onSignIn(values)
          setSubmitting(false)
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="mb-4">
              <label className="block text-gray-700 text-lg font-bold mb-1">Username</label>
              <Field
                type="text"
                name="username"
                placeholder="Enter username"
                className="px-3 w-full py-2 border-2 text-sm font-semibold border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0800a7]"
                disabled={isSubmitting || loading}
              />
              <div className="text-error text-sm mt-1">
                <ErrorMessage name="username" />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-lg font-bold mb-1">Password</label>
              <Field
                type="password"
                name="password"
                placeholder="Enter Password"
                className="px-3 w-full py-2 border-2 text-sm font-semibold border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0800a7]"
                disabled={isSubmitting || loading}
              />
              <div className="text-error text-sm mt-1">
                <ErrorMessage name="password" />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-1">
              <button
                type="submit"
                className="btn btn-warning w-full sm:w-1/2"
                disabled={isSubmitting || loading}
              >
                {loading ? "Logging In..." : "Log In"}
              </button>
              <div className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  className="text-[#0800a7] underline underline-offset-2 font-medium text-sm"
                  disabled={isSubmitting || loading}
                  onClick={() => router.push("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default SignInForm