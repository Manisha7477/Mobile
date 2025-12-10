// //NEW CODE 
import React, { useEffect, useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import nookies from "nookies"
import { startCase } from "lodash"
import { FaSearch } from "react-icons/fa"
import { Plus } from "lucide-react"

import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
import ManageUsersFilterForm from "@/components/forms/ManageUsersFilterForm"
import { initialFormikValues, formValidationSchema } from "@/utils/forms"
import {
  MANAGE_USERS_HEADER_DATA,
  USER_STRUCTURE_HEADER_DATA,
} from "@/utils/data"
import BasicTable from "@/components/tables/BasicTable"
import ModalComponent from "@/components/ModalComponent"
import ModalDeleteComponent from "@/components/forms/ModalDeleteComponent"
import { formatDate, formatDateTime } from "@/utils/convert"
import Loading from "@/navigation/Loading"
import usePagination from "@/components/UsePagination"
import TableHeaderConfig from "@/components/TableHeaderConfig"
import type { ITableHeader } from "@/utils/types"
import api from "@/api/axiosInstance"
import Pagination from "@/components/Pagination"

interface IManageUsersProps {}

const ManageUsers: React.FC<IManageUsersProps> = () => {
  const token = nookies.get(null).accessToken || ""
  const navigate = useNavigate()
  const [modal, setModal] = useState(false)
  const [selectedViewUser, setSelectedViewUser] = useState<Record<string, any> | null>(null)
  const [listData, setListData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalDelete, setDeleteModal] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const itemsPerPageOptions = [5, 10, 15, 20, 30, 40, 50]
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1])
  const [tableHeaderFilter, setTableHeaderFilter] = useState(USER_STRUCTURE_HEADER_DATA)

  const {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    currentData,
  } = usePagination(totalItems, itemsPerPage)

  const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
    navigate(`/user-management/manage-user/user-creation?id=${infoSelectedRow.userId}`)
  }

  const handleClickViewAction = (infoSelectedRow: Record<string, any>) => {
    const { serialNumber, ...rest } = infoSelectedRow
    setSelectedViewUser(rest)
    setModal(true)
  }

  const handleDeleteAction = (infoSelectedRow: Record<string, any>) => {
    setSelectedViewUser(infoSelectedRow)
    setDeleteModal(true)
  }

  const handleCloseModal = (modalStatus: boolean) => {
    setModal(modalStatus)
  }

  const handleCloseDeleteModal = (modalDeleteStatus: boolean) => {
    setDeleteModal(modalDeleteStatus)
  }

  const handleSuccessCloseDeleteModal = (modalDeleteStatus: boolean) => {
    setDeleteModal(modalDeleteStatus)
    fetchAPI()
  }

  const handleVisibleStatus = (itemsUpdatedData: ITableHeader[]) => {
    const filterTableHeader = itemsUpdatedData.filter((item) => item.visible)
    setTableHeaderFilter(filterTableHeader)
  }

  const filterTableHeader = tableHeaderFilter?.filter((item) => item.visible)

  const fetchAPI = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get("/User/get-all")
      console.log("resxasxax",response.data?.data);
      
      if (response.data?.data) {
        const filteredData = response.data?.data.filter((item: any) => !item.IsDeleted)
        setListData(filteredData)
        setTotalItems(filteredData.length)
      }
    } catch (error) {
      console.error("Error fetching user details:", error)
    } finally {
      setLoading(false)
    }
  }, [currentPage, itemsPerPage])

  useEffect(() => {
    fetchAPI()
  }, [fetchAPI])

  // Filter data based on search query BEFORE pagination
  const filteredData = listData.filter((item) =>
    Object.values(item).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  // Apply pagination AFTER filtering
  const currentItems = currentData(filteredData).map((item, index) => ({
    ...item,
    serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
  }))

  const renderDeleteModal = () => (
    <ModalDeleteComponent
      showDeleteModal={modalDelete}
      handleCloseDeleteModal={handleCloseDeleteModal}
      handleSuccessCloseDeleteModal={handleSuccessCloseDeleteModal}
      itemId={selectedViewUser?.userId}
      itemName={selectedViewUser?.userName}
      idKey="UserId"
      apiNameUrl="User/DeleteUserDetails"
    />
  )

  const renderModal = () => (
    <ModalComponent
      showModal={modal}
      handleCloseModal={handleCloseModal}
      title={`User Details(${selectedViewUser?.firstName} ${selectedViewUser?.lastName})`}
    >
      {renderSelectedItems()}
    </ModalComponent>
  )

  const renderSelectedItems = () => {
    return (
      <div className="overflow-x-auto w-full sm:max-w-sm mx-auto">
        <table className="table table-xs border border-base-300">
          <tbody>
            {Object.keys(selectedViewUser ?? {})
              .filter(
                (keyItem) =>
                  ![
                    "isDeleted",
                    "userId",
                    "password",
                    "roleId",
                    "byManager",
                    "byEngineerId",
                    "plantId",
                  ].includes(keyItem)
              )
              .map((keyItem, index) => {
                let value = selectedViewUser![keyItem]
                if (keyItem === "ModifiedBy") {
                  value = value || "NA"
                }
                if (keyItem === "CreationDate" || keyItem === "LastModifiedDate") {
                  value = formatDateTime(value)
                } else if (keyItem === "validFrom" || keyItem === "validTo") {
                  value = formatDate(value)
                } else {
                  value = value?.toString()
                }
                return (
                  <tr key={keyItem + index}>
                    <td className="font-semibold">{startCase(keyItem)}</td>
                    <td>
                      <span className="mr-2">:</span>
                      {value}
                    </td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="sm:ml-10 xl:ml-0 flex flex-col h-full">
      <div>
        {/* Header with Manage Users + Search + Add button */}
        <PageHeaderWithSearchAndAdd
          title="Manage Users"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/user-management/manage-user/user-creation")}
        />
      </div>

      {/* Scrollable table container */}
      <div className="flex-grow overflow-auto border-t border-gray-200">
        <div className="screen-height-media w-full">
          {loading ? (
            <Loading />
          ) : (
            currentItems && (
              <BasicTable
                tableHeader={MANAGE_USERS_HEADER_DATA}
                tableData={currentItems}
                handleClickEditAction={handleClickEditAction}
                handleClickViewAction={handleClickViewAction}
                handleDeleteAction={handleDeleteAction}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                showAddButton={false}
              />
            )
          )}
        </div>
      </div>

      {/* Fixed pagination at bottom */}
      <div className="pt-2 border-t border-gray-200">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          goToNextPage={goToNextPage}
          goToPreviousPage={goToPreviousPage}
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
          itemsPerPageOptions={itemsPerPageOptions}
        />
      </div>

      {modal && renderModal()}
      {modalDelete && renderDeleteModal()}
    </div>
  )
}

export default ManageUsers
