import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "@/api/axiosInstance";
import { toast } from "react-toastify";
import CRUDBasicTable from "@/components/tables/CRUDBasicTable";
import ManageUserTopHeader from "./ManageUserTopHeader";
import { MANAGE_USERS_HEADER_DATA } from "@/utils/data";
import { UserDetailsModal } from "@/components/UserDetailsModal";
import { Modal } from "@/components/Modal";
import { HiExclamationCircle } from "react-icons/hi";

const ManageUserDash = () => {
  const navigate = useNavigate();

  const [tableData, setTableData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const currentPage = 1;
  const itemsPerPage = 1000;
console.log("selectedUser",selectedUser);

  // ============================
  // FETCH USERS
  // ============================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/User/get-all`);
      const rows = res.data.data.map((item: any) => ({
        userId: item.userId,
        firstName: item.firstName,
        lastName: item.lastName,
        email: item.email,
        contactPhone: item.contactPhone,
        roleName: item.roleName,
        createdBy:item.createdBy,
        modifiedBy:item.modifiedBy,
      }));
      setTableData(rows);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  // ============================
  // SEARCH
  // ============================
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return tableData.filter((row) =>
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [tableData, searchQuery]);

  // Add Sl No.
  const updatedItems = filteredData.map((item, index) => ({
    ...item,
    slNo: index + 1,
  }));
 const handleEdit = (row: any) => {
  const encodedUserId = encodeURIComponent(row.userId);

  navigate(`/user-management/manage-users/edit/${encodedUserId}`, {
    state: { userData: row },
  });
};

  const handleView = (row: any) => {
    setSelectedUser(row);
    setShowViewModal(true);
  };

  const handleDelete = (row: any) => {
    setSelectedUser(row);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/User/${selectedUser.userId}`);
      toast.success("User deleted");
      setShowDeleteModal(false);
      fetchUsers();
    } catch {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="flex flex-col h-screen overflow-visible">
      {/* HEADER */}
      <ManageUserTopHeader
        title="Admin User Management"
        subTitle="Manage user and new user creation"
        onAddClick={() =>
          navigate("/user-management/manage-user/user-creation")
        }
        showAddButton={true}
      />

      {/* SEARCH */}
      <div className="mb-2 w-1/2">
        <input
          type="text"
          placeholder="Search by ID, name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-2 py-1 mt-2 border rounded"
        />
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="text-center mt-10">Loading...</div>
        ) : (
          <CRUDBasicTable
            tableHeader={MANAGE_USERS_HEADER_DATA}
            tableData={updatedItems}
            handleEdit={handleEdit}
            handleView={handleView}
            handleDelete={handleDelete}
          />
        )}
      </div>

      {/* DELETE CONFIRM MODAL */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 text-warning">
            <HiExclamationCircle className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Delete User</h3>
          </div>
          <p className="mt-4">
            Are you sure you want to delete user "{selectedUser?.firstName}"?
          </p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              className="btn btn-ghost"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button className="btn btn-error" onClick={confirmDelete}>
              Delete
            </button>
          </div>
        </div>
      </Modal>

      {/* VIEW MODAL */}
      <UserDetailsModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        userData={selectedUser}
      />
    </div>
  );
};

export default ManageUserDash;
