import { IUser } from "@/utils/types"
import { create } from "zustand"

// type User = {
//   name: string;
//   role: string;
// };

type Store = {
  user: IUser | null
  setUser: (user: null | IUser) => void
  userId: number | null
  setUserId: (userId: null | number) => void
  token: string | null
  refreshToken: string | null
  login: (token: string, refreshToken: string) => void
  logout: () => void
}
export const useUserStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  token: null,
  refreshToken: null,
  userId: null,
  setUserId: (userId) => set({ userId }),

  login: (token, refreshToken) => set({ token, refreshToken }),

  logout: () => set({ user: null, token: null, refreshToken: null }),
}))

export default useUserStore
