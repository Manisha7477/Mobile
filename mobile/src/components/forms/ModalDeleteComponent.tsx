import Loading from "@/navigation/Loading"

import { useState } from "react"

import api from "@/api/axiosInstance"

interface IModalDeleteComponentProps {
  showDeleteModal: boolean
  handleCloseDeleteModal: Function
  handleSuccessCloseDeleteModal: Function
  itemId: number
  itemName?: string // Changed to optional
  fieldName1?: string
  fieldName2?: string
  apiNameUrl: string
  idKey?: string // ✅ NEW: Accept dynamic key name like "AreaId"
  width?: string
  height?: string
}

const ModalDeleteComponent: React.FunctionComponent<
  IModalDeleteComponentProps
> = ({
  showDeleteModal,
  handleCloseDeleteModal,
  handleSuccessCloseDeleteModal,
  itemId,
  itemName,
  fieldName1,
  fieldName2,
  apiNameUrl,
  idKey, // ✅ add this
  width = "w-6/12 max-w-5xl",
  height = "",
}) => {
  const [loading, setLoading] = useState(false)

  const confirmDelete = async () => {
    setLoading(true)
    const key = idKey || "id" // fallback in case key not passed

    try {
      await api.delete(`/${apiNameUrl}`, {
        params: { [key]: itemId }, // ✅ dynamic key: AreaId, LineId, etc.
      })
      handleSuccessCloseDeleteModal(false)
    } catch (error) {
      console.error("Delete error:", error)
    } finally {
      setLoading(false)
    }
  }

  console.log("itemid:", itemId)
  return (
    <>
      <input
        type="checkbox"
        className="modal-toggle hidden"
        defaultChecked={showDeleteModal}
      />
      <div className="modal modal-middle">
        <div className={`modal-box ${width} ${height}`}>
          <h3 className="font-bold text-lg text-error mb-2">Delete</h3>
          {itemName && (
            <h3 className="font-bold text-lg">
              {`${itemName} - ${itemId}`}
              {fieldName1 && `(${fieldName1})`}
            </h3>
          )}
          <div className="py-4">Are you sure do you want to delete ?</div>
          {loading && <Loading />}
          <div className="modal-action">
            <button
              className="btn btn-error btn-outline btn-sm text-base-100"
              onClick={() => handleCloseDeleteModal(false)}
              disabled={loading}
            >
              Close
            </button>
            <button
              className="btn btn-primary btn-outline btn-sm text-base-100"
              onClick={confirmDelete}
              disabled={loading}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ModalDeleteComponent
