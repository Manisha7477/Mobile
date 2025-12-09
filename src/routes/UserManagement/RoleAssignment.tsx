import PageHeaderWithSearchAndAdd from "@/navigation/PageHeaderWithSearchAndAdd"
import { ROLE_ASSIGNMENT_HEADER_DATA } from "@/utils/data"
import BasicTable from "@/components/tables/BasicTable"
import { useNavigate } from "react-router-dom"
import { useEffect, useState, useCallback } from "react"
import ModalComponent from "@/components/ModalComponent"
import { startCase } from "lodash"
import axios from "axios"
import nookies from "nookies"
import Loading from "@/navigation/Loading"
import ModalDeleteComponent from "@/components/forms/ModalDeleteComponent"
import { formatDate, formatDateTime } from "@/utils/convert"
import usePagination from "@/components/UsePagination" 
import Pagination from "@/components/Pagination" 
import api from "@/api/axiosInstance"
import { FaSearch } from "react-icons/fa"
import { Plus } from "lucide-react"
interface IRoleAssignmentProps { }

const RoleAssignment: React.FunctionComponent<IRoleAssignmentProps> = ({ }) => {
  const navigate = useNavigate()
  const token = nookies.get(null).accessToken || ""
  const [modal, setModal] = useState(false)
  const [selectedViewUser, setSelectedViewUser] = useState<Record<
    string,
    any
  > | null>(null)
  const [listData, setListData] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalDelete, setDeleteModal] = useState(false)
  const [totalItems, setTotalItems] = useState(0)
  const [searchQuery, setSearchQuery] = useState("") 
  const itemsPerPageOptions = [5, 10, 15, 20, 30, 40, 50]
  const [itemsPerPage, setItemsPerPage] = useState(itemsPerPageOptions[1])

  const {
    currentPage,
    totalPages,
    goToNextPage,
    goToPreviousPage,
    goToPage,
    currentData,
  } = usePagination(totalItems, itemsPerPage)

  // const handleClickViewAction = (infoSelectedRow: Record<string, any>) => {
  //   setSelectedViewUser(infoSelectedRow)
  //   setModal(true)
  // }

  const handleDeleteAction = (infoSelectedRow: Record<string, any>) => {
    setSelectedViewUser(infoSelectedRow)
    setDeleteModal(true)
  }
  // const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
  //   console.log(infoSelectedRow)
  //   navigate(`/user-mapping/configuration?id=${infoSelectedRow.userId}`)
  // }

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

  const fetchAPI = useCallback(async () => {
    setLoading(true)

    try {
      setLoading(true)

      const response = await api.get("/User/GetAllUserdetails", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
        },
      })

      if (response.data) {
        const filteredData = response.data.filter(
          (item: any) => !item.IsDeleted,
        )
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
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase()),
    ),
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
      idKey="UserId" //  this tells the modal to send { UserId: itemId } in params
      apiNameUrl="user/DeleteUserMapping"
    />
  )
  return (
    <div className="sm:ml-10 xl:ml-0 w-full max-w-screen-m mx-auto">
      <div className="border rounded border-base-300">
        <PageHeaderWithSearchAndAdd
          title="User Configuration"
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddClick={() => navigate("/user-management/user-mapping/creation")}
        />
        <div className="overflow-auto h-50 py-1">
          <div className=" screen-height-media w-full">
            {loading ? (
              <Loading />
            ) : (
              currentItems && (
                <>
                  <BasicTable
                    tableHeader={ROLE_ASSIGNMENT_HEADER_DATA}
                    tableData={currentItems}
                    handleDeleteAction={handleDeleteAction}
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                    showAddButton={false}

                  />
                </>
              )
            )}
          </div>
        </div>
        {modalDelete && renderDeleteModal()}
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
    </div>
  )

}
export default RoleAssignment
