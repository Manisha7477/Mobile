import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  File,
  FileSpreadsheet,
  FileText,
  Download,
} from "lucide-react";
import { Printer } from "lucide-react";
import MocTopHeader from "./MocTopHeader";
import api from "@/api/axiosInstance";
import TimelineStepCard from "./TimelineStepCard";
import MocRequestCreation from "@/routes/MocRequestManagement/MocRequestCreation";
import NextRequestForm from "@/routes/MocRequestManagement/NextRequestForm";
import MocNextApproverForm from "../MocApprover/MocNextApproverForm";
import ViewMocForm from "./ViewMocForm";
import ParentViewMocForm from "./ParentViewMocForm";
import HiraReviewMocRequest from "../MocHIRAReview/HiraReviewMocRequest";
import ParentViewHiraForm from "./ParentViewHiraForm";
import ViewMocClosure from "./ViewMocClosure";
import MocPreview from "../MocReview/MocPreview";
import FinalNextReviewPriview from "../MocReview/FinalNextReviewPriview";
import MocClosurePreview from "../MocClosure/MocClosurePreview";
interface DocumentItem {
  id: number;
  name: string;
  icon: React.ElementType;
}
interface MocDetails {
  // Basic Info
  moc_request_no: string;
  title: string;
  created_by: string;
  created_by_designation?: string;
  priority: string;
  station_name: string;
  date: string;
  documents: DocumentItem[];

  // Reviewer / Approver Info
  hira_reviewer_name?: string;
  hira_reviewer_designation?: string;
  hira_approved_date?: string | null;
  sic_name?: string;
  sic_approved_date?: string | null;
  approver_name?: string;
  approver_designation?: string;
  approved_date?: string | null;
  submission_date?: string | null;

  // Comments
  comments?: string | null;
  reviewer_comments?: string | null;
  sic_comments?: string | null;
  approver_comments?: string | null;

  // MOC Fields
  modification_type?: string;
  shutdown_required?: string;
  time_limit?: string;
  present_system?: string;
  proposed_change?: string;
  additional_additors_if_any?: string;
  upstream_downstream_impact?: string;
  details_if_any?: string;
  statutory_approval_required?: string;
  statutory_details?: string;
  objectives?: string;
  impact_of_modification?: string;
  consequences_of_non_implementation?: string;
  safety_of_proposed_change?: string;
  health_safety?: string;
  efficiency?: string;
  quality_energy?: string;
  reliability_improvement?: string;
  any_other_aspect?: string;
  hira_attached?: string;
  objectives_of_moc_have_been_met?: string;

  // HIRA Fields
  hira_section?: string;
  hazard_description?: string;
  existing_controls?: string;
  proposed_controls?: string;
  risk_rating_before?: string;
  risk_rating_after?: string;

  // ✅ Additional Fields used in Closure Form
  brief_description?: string;
  moc_initiator_dept?: string;
  executing_dept?: string;
  moc_execution_details?: string;
  hira_recommendation_status?: string;
  revised_operating_procedure?: string;
  training_completed?: string;
  relevant_manuals?: string;
  comments_initiator?: string;
  status?: string;
  job_start_date?: string;
  job_completion_date?: string;
}

const MocRequestDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("MOC Form");
  const [mocDetails, setMocDetails] = useState<MocDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [mocId, setMocId] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showClosurePreview, setShowClosurePreview] = useState(false);
  const [closureData, setClosureData] = useState<any>(null);
  const [closureFormData, setClosureFormData] = useState<any>({});
  // Extract moc_request_no from URL and decode it
  const moc_request_no = decodeURIComponent(
    location.pathname.replace("/station-operations/", "")
  );
  const formatDateTime = (dateString?: string | null): string => {
    if (!dateString) return "-"; // handle null or undefined

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "-"; // handle invalid dates

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${year}-${month}-${day} ${hours}:${minutes} ${ampm}`;
  };
  useEffect(() => {
    const fetchMocDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(
          `/api/MOC/GetMocRequest?moc_request_no=${encodeURIComponent(
            moc_request_no
          )}`
        );

        const record = res.data;
        if (!record) {
          console.warn("⚠️ No MOC record found for request:", moc_request_no);
          setMocDetails(null);
          return;
        }
        setMocId(record.moc_request_id ?? record.id ?? null);

        setMocDetails({
          moc_request_no: record.moc_request_no,
          title: record.title || "-",
          created_by: record.created_by || "-",
          created_by_designation: record.created_by_designation || "",
          priority: record.priority || "-",
          station_name: record.station_name || "-",
          date: record.date || "-",
          documents: [],
          hira_reviewer_name: record.hira_reviewer_name || "",
          hira_reviewer_designation: record.hira_reviewer_designation || "",
          approver_name: record.approver_name || "",
          approver_designation: record.approver_designation || "",
          comments: record.comments || "",
          reviewer_comments: record.reviewer_comments || "",
          approver_comments: record.approver_comments || "",
          modification_type: record.modification_type || "",
          shutdown_required: record.shutdown_required || "",
          time_limit: record.time_limit || "",
          present_system: record.present_system || "",
          proposed_change: record.proposed_change || "",
          additional_additors_if_any: record.additional_additors_if_any || "",
          upstream_downstream_impact: record.upstream_downstream_impact || "",
          details_if_any: record.details_if_any || "",
          statutory_approval_required: record.statutory_approval_required || "",
          statutory_details: record.statutory_details || "",
          objectives: record.objectives || "",
          impact_of_modification: record.impact_of_modification || "",
          consequences_of_non_implementation:
            record.consequences_of_non_implementation || "",
          safety_of_proposed_change: record.safety_of_proposed_change || "",
          health_safety: record.health_safety || "",
          efficiency: record.efficiency || "",
          quality_energy: record.quality_energy || "",
          reliability_improvement: record.reliability_improvement || "",
          any_other_aspect: record.any_other_aspect || "",
          hira_attached: record.hira_attached || "",
          objectives_of_moc_have_been_met:
            record.objectives_of_moc_have_been_met || "",
          hira_section: record.hira_section || "",
          hazard_description: record.hazard_description || "",
          existing_controls: record.existing_controls || "",
          proposed_controls: record.proposed_controls || "",
          risk_rating_before: record.risk_rating_before || "",
          risk_rating_after: record.risk_rating_after || "",
        });
      } catch (err) {
        console.error("🚨 Failed to fetch MOC details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMocDetails();
  }, [moc_request_no]);

  useEffect(() => {
    if (!mocId) {
      setDocuments([]); // ensure documents cleared if no id
      return;
    }
    const controller = new AbortController();
    const fetchDocs = async () => {
      try {
        const documentResponse = await api.get(`/moc/files/by-id/${mocId}`, {
          signal: controller.signal,
        });
        const documentList: DocumentItem[] = documentResponse.data.map((doc: any) => ({
          id: doc.id,
          name: doc.filename,
          icon: File,
        }));
        setDocuments(documentList);
      } catch (err: any) {
        if (err.name === "CanceledError" || err.name === "AbortError") {
          // request was cancelled
          return;
        }
        console.error("Failed to fetch documents:", err);
        setDocuments([]); // degrade gracefully
      }
    };

    fetchDocs();

    return () => {
      controller.abort();
    };
  }, [mocId]);




  const tabs = [
    "MOC Form",
    "HIRA Form",
    "Documents",
    "Approval Timeline",
    "MOC Closure Form",
  ];

  const handlePrintPreview = () => setShowPreview(true);
  const handleBackFromPreview = () => setShowPreview(false);

  const handleClosurePrintPreview = async () => {
    try {
      if (!mocDetails?.moc_request_no) {
        alert("⚠️ MOC Request Number missing.");
        return;
      }

      setLoading(true);

      // ✅ Step 1: Build payload dynamically, matching the form fields
      const payload = {
        moc_request_id: mocId ?? 0,

        // ✅ Basic Info
        moc_request_no: mocDetails?.moc_request_no || "",
        title_of_moc: mocDetails?.title || "",

        // ✅ Descriptions (try multiple fallback sources)
        brief_description:
          mocDetails?.brief_description ||
          mocDetails?.impact_of_modification ||
          mocDetails?.proposed_change ||
          "",

        // ✅ Department Info (taken dynamically)
        moc_initiator_dept:
          mocDetails?.moc_initiator_dept ||
          mocDetails?.created_by_designation ||
          "",
        executing_dept:
          mocDetails?.executing_dept ||
          mocDetails?.station_name ||
          "",

        // ✅ Closure Execution Details
        moc_execution_details: mocDetails?.moc_execution_details || "",

        // ✅ HIRA / Training / Manuals (all dynamic)
        hira_recommendation_status: mocDetails?.hira_recommendation_status || "",
        revised_operating_procedure: mocDetails?.revised_operating_procedure || "",
        training_completed: mocDetails?.training_completed || "",
        relevant_manuals: mocDetails?.relevant_manuals || "",

        // ✅ Comments
        comments_initiator:
          mocDetails?.comments_initiator ||
          mocDetails?.comments ||
          "",

        // ✅ Status & Dates (use current date only if not available)
        status: mocDetails?.status || "draft",
        date: mocDetails?.date || new Date().toISOString().split("T")[0],
        job_start_date:
          mocDetails?.job_start_date || new Date().toISOString().split("T")[0],
        job_completion_date:
          mocDetails?.job_completion_date || new Date().toISOString().split("T")[0],
      };


      console.log("📤 Sending closure payload:", payload);

      // ✅ Step 2: POST to backend
      const res = await api.post("/moc_closures/", payload);

      if (!res?.data) {
        alert("⚠️ No response from closure API.");
        return;
      }

      console.log("✅ Closure created successfully:", res.data);

      // ✅ Step 3: Map backend response data to preview fields
      const record = res.data;

      const mappedData = {
        title_of_moc:
          record.title_of_moc || payload.title_of_moc,
        moc_request_no:
          record.moc_request_no || payload.moc_request_no,
        date: record.date || payload.date,
        brief_description:
          record.brief_description || payload.brief_description,
        moc_initiator_dept:
          record.moc_initiator_dept || payload.moc_initiator_dept,
        executing_dept:
          record.executing_dept || payload.executing_dept,
        moc_execution_details:
          record.moc_execution_details || payload.moc_execution_details,
        job_start_date:
          record.job_start_date || payload.job_start_date,
        job_completion_date:
          record.job_completion_date || payload.job_completion_date,
        hira_recommendation_status:
          record.hira_recommendation_status || payload.hira_recommendation_status,
        revised_operating_procedure:
          record.revised_operating_procedure || payload.revised_operating_procedure,
        training_completed:
          record.training_completed || payload.training_completed,
        relevant_manuals:
          record.relevant_manuals || payload.relevant_manuals,
        comments_initiator:
          record.comments_initiator || payload.comments_initiator,
      };

      console.log("✅ Closure Preview Data:", mappedData);

      // ✅ Step 4: Set preview data and show preview
      setClosureData(mappedData);
      setShowClosurePreview(true);
    } catch (err: any) {
      console.error("🚨 Failed to generate closure preview:", err);
      alert(
        `Failed to generate closure preview. ${err?.response?.status === 404
          ? "Closure API not found (check backend route /moc_closures/)"
          : err?.response?.data?.message || err.message || "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };





  // =====================
  // PREVIEW HANDLER
  // =====================
  if (showPreview && mocDetails) {
    if (activeTab === "HIRA Form") {
      return (
        <FinalNextReviewPriview
          data={{
            title: mocDetails.title,
            mocNo: mocDetails.moc_request_no,
            stationName: mocDetails.station_name,
            date: mocDetails.date,
            //hiraSection: mocDetails.hira_section,
            hazardDescription: mocDetails.hazard_description,
            existingControls: mocDetails.existing_controls,
            proposedControls: mocDetails.proposed_controls,
            riskBefore: mocDetails.risk_rating_before,
            riskAfter: mocDetails.risk_rating_after,
            reviewerName: mocDetails.hira_reviewer_name,
            reviewerDesignation: mocDetails.hira_reviewer_designation,
          } as any}
          onBack={handleBackFromPreview}
        />
      );
    }

    return (
      <MocPreview
        data={{
          title: mocDetails.title,
          mocNo: mocDetails.moc_request_no,
          stationName: mocDetails.station_name,
          date: mocDetails.date,
          priority: mocDetails.priority,
          modificationType: mocDetails.modification_type,
          shutdownRequired: mocDetails.shutdown_required,
          timeLimit: mocDetails.time_limit,
          presentSystem: mocDetails.present_system,
          proposedChange: mocDetails.proposed_change,
          additionalAdditorsIfAny: mocDetails.additional_additors_if_any,
          upstreamDownstreamImpact: mocDetails.upstream_downstream_impact,
          detailsIfAny: mocDetails.details_if_any,
          statutoryApprovalRequired: mocDetails.statutory_approval_required,
          statutoryDetails: mocDetails.statutory_details,
          objectives: mocDetails.objectives,
          impactOfModification: mocDetails.impact_of_modification,
          consequencesOfNonImplementation:
            mocDetails.consequences_of_non_implementation,
          safetyOfProposedChange: mocDetails.safety_of_proposed_change,
          healthSafety: mocDetails.health_safety,
          efficiency: mocDetails.efficiency,
          qualityEnergy: mocDetails.quality_energy,
          reliabilityImprovement: mocDetails.reliability_improvement,
          anyOtherAspect: mocDetails.any_other_aspect,
          hiraAttached: mocDetails.hira_attached,
          objectivesOfMocHaveBeenMet: mocDetails.objectives_of_moc_have_been_met,
          comments1: mocDetails.comments ?? undefined,
          comments2: mocDetails.reviewer_comments ?? undefined,
          comments3: mocDetails.approver_comments ?? undefined,
          preparedByName: mocDetails.created_by,
          preparedByDesignation: mocDetails.created_by_designation,
          reviewedByName: mocDetails.hira_reviewer_name,
          reviewedByDesignation: mocDetails.hira_reviewer_designation,
          approvedByName: mocDetails.approver_name,
          approvedByDesignation: mocDetails.approver_designation,
        }}
        onBack={handleBackFromPreview}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div>Loading details...</div>
      </div>
    );
  }

  if (showClosurePreview && closureData) {
    return (
      <MocClosurePreview
        data={closureData}
        onBack={() => setShowClosurePreview(false)}
      />
    );
  }

  if (!mocDetails) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No MOC details found for this request.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-gray-50">
      <MocTopHeader
        title={mocDetails.moc_request_no}
        subTitle={mocDetails.title}
        showAddButton={false}
      />

      {/* 🔹 Info Row */}
      <div className="grid grid-cols-4 divide-x bg-white rounded-md mt-2 mx-4 shadow">
        <div className="p-3">
          <p className="text-sm text-gray-500">Requestor</p>
          <p className="font-medium text-gray-800">{mocDetails.created_by}</p>
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-500">Priority</p>
          <p className="font-medium text-gray-800">{mocDetails.priority}</p>
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-500">Station</p>
          <p className="font-medium text-gray-800">{mocDetails.station_name}</p>
        </div>
        <div className="p-3">
          <p className="text-sm text-gray-500">Date</p>
          <p className="font-medium text-gray-800">{mocDetails.date}</p>
        </div>
      </div>

      {/* 🔹 Tabs */}
      <div className="flex border-b text-sm font-medium text-gray-500 mt-1 mx-4 bg-white rounded-t-md">
        {tabs.map((tab) => (
          <div
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 cursor-pointer ${activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "hover:text-gray-700"
              }`}
          >
            {tab}
          </div>
        ))}
      </div>

      {/* 🔹 Tab Content */}
      <div className="flex-1 px-8 py-2 mx-4 bg-white rounded-b-md shadow overflow-y-auto">
        {activeTab === "MOC Form" && (
          <div className="relative flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <ParentViewMocForm moc_request_no={mocDetails?.moc_request_no!} />
            </div>

            {/* ✅ Sticky Footer Buttons */}
            <div className="fixed bottom-0 right-0 left-[260px] bg-white border-t shadow-md flex justify-end gap-3 px-6 py-3 z-50">
              <button
                onClick={() => navigate(-1)}
                className="border border-gray-400 hover:bg-gray-200 text-gray-800 text-sm px-5 py-2 rounded-lg transition"
              >
                ← Back
              </button>

              <button
                onClick={handlePrintPreview}
                className="flex items-center gap-2 px-5 py-2 border border-gray-300 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
              >
                <Printer className="w-4 h-4" />
                Print Preview
              </button>
            </div>
          </div>
        )}

        {activeTab === "HIRA Form" && (

          <div className="relative flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              <ParentViewHiraForm moc_request_no={mocDetails?.moc_request_no!} />
            </div>

            {/* ✅ Sticky Footer Buttons */}
            <div className="fixed bottom-0 right-0 left-[260px] bg-white border-t shadow-md flex justify-end gap-3 px-6 py-3 z-50">
              <button
                onClick={() => navigate(-1)}
                className="border border-gray-400 hover:bg-gray-200 text-gray-800 text-sm px-5 py-2 rounded-lg transition"
              >
                ← Back
              </button>

              <button
                onClick={handlePrintPreview}
                className="flex items-center gap-2 px-5 py-2 border border-gray-300 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
              >
                <Printer className="w-4 h-4" />
                Print Preview
              </button>
            </div>
          </div>

        )}

        {/* ✅ Documents Tab */}

        {activeTab === "Documents" && (
          <div>
            <h3 className="text-base font-semibold text-gray-800">
              Attached Documents
            </h3>
            <p className="text-sm text-gray-400 mb-4">
              Supporting documents and revisions
            </p>

            {documents.length > 0 ? (
              <div className="divide-y">
                {documents.map((doc) => {
                  const Icon = doc.icon;
                  return (
                    <div key={doc.id} className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <Icon className="text-blue-600 h-5 w-5" />
                        <span className="text-gray-800 font-medium">
                          {doc.name}
                        </span>
                      </div>
                      <button
                        onClick={async () => {
                          try {
                            const response = await api.get(`/moc/files/download/${doc.id}`, {
                              responseType: 'blob'
                            });

                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', doc.name);

                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } catch (error) {
                            console.error('Download failed:', error);
                          }
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Download className="h-5 w-5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 italic">No attachments available.</p>
            )}
          </div>
        )}




        {activeTab === "Approval Timeline" && (
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-1">
              Approval Timeline
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Track the progress of this MoC request
            </p>

            {/* ✅ Timeline Steps */}
            <div className="space-y-6">
              <TimelineStepCard
                title="Submitted"
                person={mocDetails.created_by ? `${mocDetails.created_by} • Requestor` : "N/A"}
                comment={mocDetails.comments ?? undefined}
                date={formatDateTime(mocDetails.submission_date)}
                completed
              />
              <TimelineStepCard
                title="HIRA Reviewed"
                person={
                  mocDetails.hira_reviewer_name ? `${mocDetails.hira_reviewer_name} • Reviewer` : "N/A"
                }
                comment={mocDetails.reviewer_comments ?? undefined}
                date={formatDateTime(mocDetails.hira_approved_date)}
                completed={!!mocDetails.hira_approved_date}
              />
              <TimelineStepCard
                title="Under Review"
                person={mocDetails.sic_name ? `${mocDetails.sic_name} • Station Incharge` : "N/A"}
                comment={mocDetails.sic_comments ?? undefined}
                date={formatDateTime(mocDetails.sic_approved_date)}
                completed={!!mocDetails.sic_approved_date}
              />
              <TimelineStepCard
                title="Pending Approval"
                person={mocDetails.approver_name ? `${mocDetails.approver_name} • Approver` : "N/A"}
                comment={mocDetails.approver_comments ?? undefined}
                date={formatDateTime(mocDetails.approved_date)}
                completed={!!mocDetails.approved_date}
              />
            </div>
          </div>
        )}
        {activeTab === "MOC Closure Form" && (
          <div className="relative flex flex-col h-full">
            <div className="flex-1 overflow-y-auto">
              {/* ✅ Reuse same dynamic view component pattern */}
              <ViewMocClosure moc_request_no={mocDetails.moc_request_no} />
            </div>

            {/* ✅ Sticky Footer Buttons */}
            <div className="fixed bottom-0 right-0 left-[260px] bg-white border-t shadow-md flex justify-end gap-3 px-6 py-3 z-50">
              <button
                onClick={() => navigate(-1)}
                className="border border-gray-400 hover:bg-gray-200 text-gray-800 text-sm px-5 py-2 rounded-lg transition"
              >
                ← Back
              </button>

              <button
                onClick={handleClosurePrintPreview}
                className="flex items-center gap-2 px-5 py-2 border border-gray-300 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition"
              >
                <Printer className="w-4 h-4" />
                Print Preview
              </button>
            </div>
          </div>
        )}

      </div>
      {/* ✅ Back Button */}
      <div className="flex justify-end px-3 py-3  bg-white  shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="border border-gray-400 hover:bg-gray-300 text-gray-800 text-xs px-5 py-2 rounded-lg shadow-sm transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
};

export default MocRequestDetails;