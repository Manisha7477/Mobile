import axios from "axios"
import Router from "next/router"
import nookies from "nookies"

const PUBLIC_ROUTES = ["/signin", "/forgot-password", "/reset-password" , "/user-register"]

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token)
  })
  failedQueue = []
}

const redirectToSignIn = () => {
  if (typeof window !== "undefined") {
    const path = window.location?.pathname || ""
    if (!PUBLIC_ROUTES.includes(path)) {
      Router.replace("/signin")
    }
  }
}

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: { "Content-Type": "application/json" },
})

// Set token
const { token } = nookies.get(null)
if (token) {
  axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`
}

// Request Interceptor
axiosInstance.interceptors.request.use((config) => {
  const { token } = nookies.get(null)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response Interceptor
axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config
    const status = error?.response?.status

    if (typeof window !== "undefined") {
      const path = window.location?.pathname || ""
      if (PUBLIC_ROUTES.includes(path)) return Promise.reject(error)
    }

    if (status === 401 && !originalRequest._retry) {
      const refreshToken = nookies.get(null)?.refreshToken
      if (!refreshToken) {
        redirectToSignIn()
        return Promise.reject(error)
      }

      originalRequest._retry = true

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
              resolve(axiosInstance(originalRequest))
            },
            reject,
          })
        })
      }

      isRefreshing = true
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/User/refresh-token`,
          { refreshToken }
        )

        const { accessToken, refreshToken: newRefresh } = res.data

        nookies.set(null, "token", accessToken, { path: "/" })
        nookies.set(null, "refreshToken", newRefresh, { path: "/" })

        processQueue(null, accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axiosInstance(originalRequest)
      } catch (err) {
        processQueue(err, null)
        redirectToSignIn()
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
