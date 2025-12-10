import { IUser } from "@/utils/types"
import { create } from "zustand"

// type User = {
//   name: string;
//   role: string;
// };

type Store = {
  firstDependent: number | string | null
  setFirstDependent: (firstDependent: number | string | null) => void
  secondDependent: number | string | null
  setSecondDependent: (secondDependent: number | string | null) => void
  employeeId: string | null
  setEmployeeId: (employeeId: string | null) => void
  clearDependents: () => void
}
export const useDependentStore = create<Store>((set) => ({
  firstDependent: null,
  setFirstDependent: (firstDependent) => set({ firstDependent }),
  secondDependent: null,
  setSecondDependent: (secondDependent) => set({ secondDependent }),
  employeeId: null,
  setEmployeeId: (employeeId) => set({ employeeId }),
  clearDependents: () =>
    set(() => ({
      firstDependent: null,
      secondDependent: null,
    })),
}))
export default useDependentStore
