import { useAuth } from "@/contexts/auth"
import NotFound from "@/routes/NotFound"
import Profile from "@/routes/Profile"
import Settings from "@/routes/Settings"
import SignOut from "@/routes/SignOut"
import nookies from "nookies"
import { useEffect, useState } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import AccessWrapper from "./AccessWrapper"
import MyDashboard from "./MyDashboard"
import ManageUsers from "./UserManagement/ManageUsers"
import RoleAssignment from "./UserManagement/RoleAssignment"
import RoleAssignmentConfiguration from "./UserManagement/RoleAssignmentConfiguration"
import RolePermission from "./UserManagement/RolePermission"
import UserIdCreation from "./UserManagement/UserIdCreation"
import api from "@/api/axiosInstance"
import AlarmTrace from "./Alarms/AlarmTrace"
import MocDashboard from "@/components/moc/MocDashboard"
import MocRequestCreation from "./MocRequestManagement/MocRequestCreation"
import NextRequestForm from "./MocRequestManagement/NextRequestForm"
import RequestClosure from "@/components/MocClosure/RequestClosure"
import MocViewAll from "@/components/moc/MocViewAll"
import ReviewMocRequest from "@/components/MocReview/ReviewMocRequest"
import HiraReviewMocRequest from "@/components/MocHIRAReview/HiraReviewMocRequest"
import FinalNextReviewForm from "@/components/MocReview/FinalNextReviewForm"
import HiraNextReviewForm from "@/components/MocHIRAReview/HiraNextReviewForm"
import MocApproverMocRequest from "@/components/MocApprover/MocApproverMocRequest"
import MocNextApproverForm from "@/components/MocApprover/MocNextApproverForm"
import MocRequestDetails from "@/components/moc/MocRequestDetails"
import NotificationsPage from "@/components/Notifications/NotificationsPage"
import ReviewerClosure from "@/components/MocClosure/ReviewerClosure"
import ApproverClosure from "@/components/MocClosure/ApproverClosure"
import MocDraftFormCreation from "./MocRequestManagement/MocDraftFormCreation"
import LeaveDashboard from "@/components/LeaveManagement/LeaveDashboard"
import ApprovalLeaveApply from "@/components/LeaveManagement/ApprovalLeaveApply"
import GatePassDashboard from "@/components/GatePass/GatePassDashboard"
import ViewAllGatePass from "@/components/GatePass/ViewAllGatePass"
import OutwardGatePassForm from "@/components/GatePassOutward/OutwardGatePassForm"
import OutwardGatePassApprovalForm from "@/components/GatePassOutward/OutwardGatePassApprovalForm"
import GPCreateReturnable from "@/components/GatePassReturnable/GPCreateReturnable"
import InwardApprovalForm from "@/components/GatePassInward/InwardApprovalForm"
import InwardPrintPreview from "@/components/GatePassInward/InwardPrintPreview"
import InwardGatePassForm from "@/components/GatePassInward/InwardGatePassForm"
import SecurityGatePassVerify from "@/components/GatePass/SecurityGatePassVerify"
import GPReturnableReview from "@/components/GatePassReturnable/GPReturnableReview"
import OutwardGatePassView from "@/components/GatePassOutward/OutwardGatePassView"
import InwardGatePassView from "@/components/GatePassInward/InwardGatePassView"
import OutwardPrintPreview from "@/components/GatePassOutward/OutwardPrintPreview"
import ReturnablePrintPreview from "@/components/GatePassReturnable/ReturnablePrintPreview"
import EditMyProfile from "@/components/MyProfile/EditMyProfile"
import TravelExpenseDashboard from "@/components/TravelExpenseManagement/TravelExpenseDashboard"
import CreateTravelReq from "@/components/TravelExpenseManagement/TravelRequisition/CreateTravelReq"
import CreateExpenseClaim from "@/components/TravelExpenseManagement/ExpenseClaim/CreateExpenseClaim"
import CreateMealAllowance from "@/components/TravelExpenseManagement/Mealallowance/CreateMealAllowance"
import HRDashboard from "@/components/HREmployeePersonalUpdates/HRDashboard"
import ViewSubmittedDash from "../components/HREmployeePersonalUpdates/ViewSubmittedDash"
import EmpAssetSubmitted from "@/components/HREmployeePersonalUpdates/EmpAssetSubmitted"
import AnnualInvestmentPrintPreview from "@/components/MyProfile/AnnualInvestmentPrintPreview"
import Form12CPrintPreview from "@/components/MyProfile/Form12CPrintPreview"
import AssetDeclarationPrintPreview from "@/components/MyProfile/AssetDeclarationPrintPreview"
import ManageUserDash from "./UserManagement/ManageUserDash"
interface INavbarProps {
  isOpenMenu: boolean
}

const AppRouter: React.FunctionComponent<INavbarProps> = ({ isOpenMenu }) => {
  const { user, loading } = useAuth()
  const token = nookies.get(null).accessToken || ""
  const [loadingRoles, setLoadingRoles] = useState(true)
  const [roleMap, setRoleMap] = useState(new Map())

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await api.get("/api/SubMenus")
        console.log("Roles response:", response.data)
        const rolesMap = new Map<string, string[]>()
        response.data.forEach(
          (submenu: {
            subMenuName: string
            subMenuUrl: string
            getRoleList: { roleName: string }[]
          }) => {
            const roleNames = submenu.getRoleList.map((role) => role.roleName)
            const key = submenu.subMenuUrl || submenu.subMenuName
            rolesMap.set(key, roleNames)
          },
        )
        setRoleMap(rolesMap)
      } catch (error) {
        console.error("Error fetching roles:", error)
      } finally {
        setLoadingRoles(false)
      }
    }
    fetchRoles()
  }, [token])

  if (!loading && !loadingRoles) {
    return (
      <div
        className="transition-all duration-300 ease-in-out"
        style={{
          marginLeft: isOpenMenu ? '55px' : '0px'
        }}
      >
        <Routes>
          {/* 👇 Default redirect */}
          {/* <Route path="/" element={<Navigate to="/station-operations/moc" replace />} /> */}
          <Route path="/" />
          <Route
            path="/my-dashboard"
            element={
              <MyDashboard
                user={user}
                isOpenMenu={isOpenMenu}
              />
            }
          />
          <Route
            path="/user-management/manage-user"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/manage-user")
                }
              >
                {/* <ManageUsers /> */}
                <ManageUserDash />
              </AccessWrapper>
            }
          />
          <Route
            path="/user-management/manage-user/user-creation"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/manage-user")
                }
              >
                <UserIdCreation user={user} />
              </AccessWrapper>
            }
          />
           <Route
            path="/user-management/manage-users/edit/:userId"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/manage-user")
                }
              >
               <UserIdCreation user={user} />
              </AccessWrapper>
            }
          />
          <Route
            path="/user-management/user-mapping"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/user-mapping")
                }
              >
                <RoleAssignment />
              </AccessWrapper>
            }
          />
          <Route
            path="/user-management/user-mapping/creation"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/user-mapping")
                }
              >
                <RoleAssignmentConfiguration user={user} />
              </AccessWrapper>
            }
          />
          <Route
            path="/user-management/roles-permissions"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/roles-permissions")
                }
              >
                <RolePermission />
              </AccessWrapper>
            }
          />
          <Route
            path="/"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocDashboard />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocDashboard />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-creation"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocRequestCreation />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/next-request-form"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <NextRequestForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/hira-reviewer/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <HiraReviewMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/hira-next-reviewer"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <HiraNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-closure/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <RequestClosure />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/viewAll"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocViewAll />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocRequestDetails />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/notifications"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <NotificationsPage />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/HiraReview/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <HiraReviewMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/NextHiraReview/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <HiraNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/FinalReview/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <ReviewMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/NextFinalReview/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <FinalNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/approver/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocApproverMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/NextApprover/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocNextApproverForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/Moc/ReviewHiraRequest/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <FinalNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/FinalNextReviewer"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <FinalNextReviewForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/approver"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocApproverMocRequest />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/next-form-approver"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocNextApproverForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/utilities"
            element={
              <AccessWrapper
                user={user}
                accessRole={roleMap.get("/utilities")?.includes(user?.role || "")}
              >
                <RequestClosure />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-closure/creation/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <RequestClosure />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-closure/reviewer/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <ReviewerClosure />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-closure-approver"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <ApproverClosure />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/moc/request-creation/:moc_request_no"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/moc")
                }
              >
                <MocDraftFormCreation />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass"
            element={
              user?.roleName === "Security"
                ? <Navigate to="/station-operations/gate-pass/AllGatePassList" replace />
                : <Navigate to="/station-operations/gate-pass/default" replace />
            }
          />
          <Route
            path="/station-operations/gate-pass/default"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <GatePassDashboard />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/AllGatePassList"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <ViewAllGatePass />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/create-outward"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <OutwardGatePassForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/outward-reviewer/:outward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <OutwardGatePassApprovalForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/create-returnable/:outward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <GPCreateReturnable />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/review-returnable/:outward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <GPReturnableReview />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/outward/preview/:outward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <OutwardPrintPreview />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/returnable/preview/:outward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <ReturnablePrintPreview />
              </AccessWrapper>
            }
          />
          {/*inward Gate-Pass*/}
          <Route
            path="/station-operations/gate-pass/inwardGatepass"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <InwardGatePassForm />
              </AccessWrapper>
            }
          />

          <Route
            path="/station-operations/gate-pass/InwardReviewer/:inward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <InwardApprovalForm />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/inward/preview/:inward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <InwardPrintPreview />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/gate-pass/security-outward-verification/:outward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass") // ✅ check access for gate-pass
                }
              >
                <SecurityGatePassVerify />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/outward/view/:outward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <OutwardGatePassView />
              </AccessWrapper>
            }
          />
          <Route
            path="/station-operations/inward/view/:inward_id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/station-operations/gate-pass")
                }
              >
                <InwardGatePassView />
              </AccessWrapper>
            }
          />
          <Route
            path="/alarms-trace"
            element={
              <AccessWrapper
                user={user}
                accessRole={roleMap
                  .get("/alarms-trace")
                  ?.includes(user?.role || "")}
              >
                <AlarmTrace />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/leave"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/leave")
                }
              >
                <LeaveDashboard />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/leave/leave-approval"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/leave")
                }
              >
                <ApprovalLeaveApply />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/travel-expense"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/travel-expense")
                }
              >
                <TravelExpenseDashboard />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/travel-expense/create-travle-req"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/travel-expense")
                }
              >
                <CreateTravelReq />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/travel-expense/create-expense-claim"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/travel-expense")
                }
              >
                <CreateExpenseClaim />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/travel-expense/create-meal-allowance"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/travel-expense")
                }
              >
                <CreateMealAllowance />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/personal-updates"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/personal-updates")
                }
              >
                <HRDashboard />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/personal-updates/view-submitted"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/personal-updates")
                }
              >
                <ViewSubmittedDash />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/personal-updates/asset-submitted"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/personal-updates")
                }
              >
                <EmpAssetSubmitted />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/annual-investment/view/:id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/personal-updates")
                }
              >
                <AnnualInvestmentPrintPreview />
              </AccessWrapper>
            }
          />

          <Route
            path="/user-management/manage-user/edit-profile/:userId"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/manage-user")
                }
              >
                <EditMyProfile />
              </AccessWrapper>
            }
          />
          <Route
            path="/user-management/manage-user/edit-profile"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/user-management/manage-user")
                }
              >
                <EditMyProfile />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/asset-declaration/print/:id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/personal-updates")
                }
              >
                <AssetDeclarationPrintPreview />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/form12c/view/:id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/personal-updates")
                }
              >
                <Form12CPrintPreview />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/asset-declaration/view/:id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/personal-updates")
                }
              >
                <AssetDeclarationPrintPreview />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/annual-investment/print/:id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/personal-updates")
                }
              >
                <AnnualInvestmentPrintPreview />
              </AccessWrapper>
            }
          />
          <Route
            path="/hr-admin/12-c/print/:id"
            element={
              <AccessWrapper
                user={user}
                accessRole={
                  !!user?.menuSubMenuDetails
                    ?.flatMap(menu => menu.subMenus.map(sub => sub.subMenuUrl))
                    .includes("/hr-admin/personal-updates")
                }
              >
                <Form12CPrintPreview />
              </AccessWrapper>
            }
          />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/logout" element={<SignOut />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    )
  }
  return null
}

export default AppRouter