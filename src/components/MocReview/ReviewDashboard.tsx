// import BasicTable from "@/components/tables/BasicTable";
// import MocHeader from "@/navigation/MocHeader";
// import { MOC_REVIEW_DASHBOARD_DATA } from "@/utils/data";
// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Calendar, MapPin, Filter as FilterIcon } from "lucide-react";
// import MocTopHeader from "../moc/MocTopHeader";
// import ReviewerDashboardTopCard from "@/components/MocReview/ReviewerDashboardTopCard"
// import api from "@/api/axiosInstance"
// // Type for each table row
// interface IMOCTableRow {
//     slNo: number;
//     moc_request_no: string;
//     title: string;
//     station_name: string;
//     created_by: string;
//     date: string;
//     status: string;
//     action: string;
//     mocClosure?: string;
// }

// const ReviewDashboard = () => {
//     const navigate = useNavigate();
//     const [tableData, setTableData] = useState<IMOCTableRow[]>([])
//     const [searchQuery, setSearchQuery] = useState("");
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage, setItemsPerPage] = useState(10);
//     const [modal, setModal] = useState(false);
//     const [modalDelete, setModalDelete] = useState(false);
//     const [loading, setLoading] = useState(false);
//     const itemsPerPageOptions = [5, 10, 15, 20, 30, 40, 50];

//     const totalPages = Math.ceil(tableData.length / itemsPerPage);

//     // Filter Logic
//     const filteredData = tableData.filter((row) =>
//         row.moc_request_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         row.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         row.station_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         row.created_by.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         row.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         row.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         row.slNo.toString().includes(searchQuery)
//     );

//     //for status
//     useEffect(() => {
//         const updated = localStorage.getItem("MOC_UPDATED_STATUS");

//         if (updated) {
//             const { moc_request_no, status } = JSON.parse(updated);

//             console.log("✅ Updating dashboard row:", moc_request_no, status);

//             setTableData(prev =>
//                 prev.map(item =>
//                     item.moc_request_no === moc_request_no
//                         ? { ...item, status }
//                         : item
//                 )
//             );

//             // ✅ clear after applying
//             localStorage.removeItem("MOC_UPDATED_STATUS");
//         }
//     }, []);





//     const storedUser = localStorage.getItem("userData");
//     const parsedUser = storedUser ? JSON.parse(storedUser) : null;
//     const roleName = parsedUser?.roleName;

//     useEffect(() => {
//         const fetchMocData = async () => {
//             try {
//                 setLoading(true);
//                 const userId = parsedUser?.userId;
//                 const res = await api.get(`/api/MOC/GetByUser/${userId}`);
//                 const records = res.data?.data?.data || [];

//                 if (Array.isArray(records)) {
//                     const formatted = records.map((item: any, idx: number) => ({
//                         ...item,
//                         slNo: idx + 1,
//                         action: "",
//                         mocClosure: "",
//                         requestNo: item.moc_request_no
//                     }));

//                     setTableData(formatted);
//                 }
//             } catch (error) {
//                 console.error("Failed to fetch MOC table data:", error);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchMocData();
//     }, []);



//     // Pagination
//     const currentItems = filteredData
//         .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
//         .map((item, index) => ({
//             ...item,
//             serialNumber: (currentPage - 1) * itemsPerPage + index + 1,
//         }));

//     const goToPage = (page: number) => setCurrentPage(page);
//     const goToNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
//     const goToPreviousPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

//     //   const handleClickEditAction = (row: IMOCTableRow) => {
//     //     navigate("/area/review", { state: row });
//     //   };

//     const handleClickEditAction = (infoSelectedRow: Record<string, any>) => {
//         // navigate(`/manage-users/user-creation?id=${infoSelectedRow.userId}`)
//     }

//     const renderModal = () => <div>Modal Content</div>;
//     const renderDeleteModal = () => <div>Delete Modal Content</div>;

//     return (
//         <div className="h-screen flex flex-col overflow-hidden">

//             {/* ---------- PAGE TITLE ---------- */}
//             <div className="p-1 rounded-md mb-2 mt-2">
//                 <MocTopHeader
//                     title="Reviewer Dashboard"
//                     subTitle="Review all details before submission"
//                 />
//             </div>

//             {/* ---------- SUMMARY CARDS ---------- */}
//             <div className="mb-1 rounded-md">
//                 <ReviewerDashboardTopCard />
//             </div>

//             {/* ---------- SECTION HEADER ---------- */}
//             {/* ---------- SECTION HEADER + FILTERS IN ONE LINE ---------- */}
//             <div className="flex-shrink-0 p-2">
//                 <div className="flex items-center gap-2">

//                     {/* <MocHeader title="Pending Reviews" /> */}

//                     <div className="flex items-center gap-3">



//                         <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5 bg-white">
//                             <MapPin size={16} className="text-gray-600" />
//                             <select className="text-sm outline-none bg-transparent">
//                                 <option>All Stations</option>
//                                 <option>Mangalore</option>
//                                 <option>Neriya</option>
//                                 <option>Hassan</option>
//                             </select>
//                         </div>
//                         <div className="flex items-center gap-2 border rounded-lg px-3 py-1.5 bg-white">
//                             <Calendar size={16} className="text-gray-600" />
//                             <select className="text-sm outline-none bg-transparent">
//                                 <option>All Time</option>
//                                 <option>Last 30 days</option>
//                                 <option>Last 7 days</option>
//                             </select>
//                         </div>

//                         <button className="flex items-center gap-2 border rounded-lg px-3 py-1.5 bg-white hover:bg-gray-100 text-sm">
//                             <FilterIcon size={16} className="text-gray-600" />
//                             Filters
//                         </button>

//                     </div>

//                 </div>
//             </div>

//             {/* </div> */}

//             {/* ---------- TABLE ---------- */}
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 <div className="flex-1 overflow-auto">
//                     {loading ? (
//                         <div className="flex items-center justify-center h-full">Loading...</div>
//                     ) : (
//                         <BasicTable
//                             tableHeader={MOC_REVIEW_DASHBOARD_DATA}
//                             tableData={currentItems as any}
//                             handleClickEditAction={handleClickEditAction}
//                             //handleClickReviewAction={(row) => navigate(`/station-operations/moc/review/${row.moc_request_no}`, { state: row })}
//                             handleClickReviewAction={(row) =>
//                                 navigate(
//                                     `/station-operations/moc/MocReview/${encodeURIComponent(
//                                         row.moc_request_no
//                                     )}`,
//                                     { state: row } // optional: pass row data in state
//                                 )
//                             }
//                             searchQuery={searchQuery}
//                             setSearchQuery={setSearchQuery}
//                             currentPage={currentPage}
//                             itemsPerPage={itemsPerPage}
//                             showAddButton={false}
//                         />
//                     )}
//                 </div>
//             </div>



//             {modal && renderModal()}
//             {modalDelete && renderDeleteModal()}
//         </div>
//     );
// };

// export default ReviewDashboard;