import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "@/api/axiosInstance";

const Form12CPrintPreview: React.FC = () => {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const { id } = useParams();
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [details, setDetails] = useState<any>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const storedUser = localStorage.getItem("userData");
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const stationName = parsedUser?.stationName;
  const designation = parsedUser?.roleName;
  const userId = parsedUser?.userId;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (!userId) return;
        const res = await api.get(`/api/usersProfile/${userId}`);
        setUserProfile(res.data);
        setDetails((prev: any) => ({
          ...prev,
          pan: res.data.pan,
          employee_designation: res.data.designation,
        }));
        ;
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    api
      .get(`/api/form12c/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData(data);
        if (data?.signature) {
          setSignatureUrl(data.signature);
        }
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  const handleDownloadPDF = async () => {
    const element = printRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, {
      scale: 3,
      useCORS: true,
      allowTaint: true
    });
    const img = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, width, height);
    pdf.save("Form12C.pdf");
  };
  const printCSS = `
    @page { size: A4; margin: 5mm; }
    @media print {
      body * { visibility: hidden !important; }
      #form12c-root, #form12c-root * {
        visibility: visible !important;
      }
      #form12c-root {
        position: absolute;
        left: 0;
        top: 0;
      }
      .no-print { display: none !important; }
    }
  `;

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-white flex flex-col h-[90vh] shadow-lg">
      <style>{printCSS}</style>
      <div className="no-print flex justify-between p-3 bg-gray-100 border-b">
        <h2 className="text-lg font-semibold">Form 12C – Print Preview</h2>
        <div className="flex gap-3">
          <button onClick={() => navigate(-1)} className="px-4 py-2 border rounded">
            ← Back
          </button>
          <button onClick={() => window.print()} className="px-4 py-2 bg-blue-600 text-white rounded">
            🖨 Print
          </button>
          <button onClick={handleDownloadPDF} className="px-4 py-2 bg-green-600 text-white rounded">
            ⬇ Download
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div
          id="form12c-root"
          ref={printRef}
          className="bg-white border mx-auto"
          style={{ width: "794px", padding: "20px", fontSize: "12px" }}
        >
          <div className="border p-3">
            <div className="flex items-center gap-3">
              <img src="/companylogo.png" style={{ width: "100px", height: "50px" }} />
              <h2 className="text-xl font-bold text-center flex-1">
                DECLARATION OF NON-SALARY INCOME / HOUSE PROPERTY INCOME / LOSS
                <br />(FORM 12C)
              </h2>
            </div>
            <hr className="my-2" />
            <p><strong>Fiscal Year :</strong> {formData?.financial_year}</p>
          </div>
          <table className="w-full border mt-3 text-sm" cellPadding={5}>
            <tbody>
              <tr>
                <td className="border">Employee Name:</td>
                <td className="border">{formData?.employee_full_name}</td>
                <td className="border">Employee No:</td>
                <td>{formData?.employee_code || details.employee_code}</td>
              </tr>
              <tr>
                <td className="border">Designation:</td>
                <td className="border">{designation}</td>
                <td className="border">Residential Status:</td>
                <td className="border">{"India"}</td>
              </tr>
              <tr>
                <td className="border">Work Location:</td>
                <td className="border">{stationName}</td>
                <td className="border">PAN:</td>
                <td>{formData?.pan || details.pan}</td>
              </tr>
            </tbody>
          </table>
          {/* MAIN TABLE */}
          <table className="w-full border mt-3 border-collapse text-sm" cellPadding={5}>
            <thead>
              <tr className="bg-gray-200 text-center">
                <th className="border w-1/4"></th>
                <th className="border w-1/4">SELF OCCUPIED</th>
                <th className="border w-1/4">LET OUT (HOUSE 1)</th>
                <th className="border w-1/4">LET OUT (HOUSE 2)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border">
                  (a) Annual lettable value / Actual rent received / receivable
                </td>
                <td className="border">{formData?.self_alv}</td>
                <td className="border">{formData?.lo1_alv}</td>
                <td className="border">{formData?.lo2_alv}</td>
              </tr>
              <tr>
                <td className="border">
                  (b) Municipal Taxes Paid
                </td>
                <td className="border">{formData?.self_municipal_tax}</td>
                <td className="border">{formData?.lo1_municipal_tax}</td>
                <td className="border">{formData?.lo2_municipal_tax}</td>
              </tr>
              <tr>
                <td className="border">Annual Value (a - b)</td>
                <td className="border">{formData?.self_annual_value}</td>
                <td className="border">{formData?.lo1_annual_value}</td>
                <td className="border">{formData?.lo2_annual_value}</td>
              </tr>
              <tr>
                <td className="border">Less: 30% Repairs</td>
                <td className="border">{formData?.self_less_30}</td>
                <td className="border">{formData?.lo1_less_30}</td>
                <td className="border">{formData?.lo2_less_30}</td>
              </tr>
              <tr>
                <td className="border"> Select House Type (Self occupied / Let Out-1/Let Out2) to identify the housing loan taken from Banks</td>
                <td className="border">{formData?.house_type_self}</td>
                <td className="border">{formData?.house_type_lo1}</td>
                <td className="border">{formData?.house_type_lo2}</td>
              </tr>
              <tr>
                <td className="border">Less: Interest on Borrowed Capital</td>
                <td className="border">{formData?.self_interest}</td>
                <td className="border">{formData?.lo1_interest}</td>
                <td className="border">{formData?.lo2_interest}</td>
              </tr>
              <tr>
                <td className="border">Loan Date</td>
                <td className="border">{formData?.self_loan_date}</td>
                <td className="border">{formData?.lo1_loan_date}</td>
                <td className="border">{formData?.lo2_loan_date}</td>
              </tr>
              <tr>
                <td className="border"> Less: 1/5th of interest paid for the period
                  before the construction is completed (if any)
                  deductible for 5 years only, attach copy of interest
                  certificate and other relevant papers.</td>
                <td className="border">{formData?.self_one_fifth_interest}</td>
                <td className="border">{formData?.lo1_one_fifth_interest}</td>
                <td className="border">{formData?.lo2_one_fifth_interest}</td>
              </tr>
              <tr>
                <td className="border">(i) Net Income / Loss</td>
                <td className="border">{formData?.self_net_income}</td>
                <td className="border">{formData?.lo1_net_income}</td>
                <td className="border">{formData?.lo2_net_income}</td>
              </tr>
              <tr>
                <td className="border">(a)Tax deducted at source on self lease (Enclose copy of certificate(s) issued under Section 203)</td>
                <td className="border">{formData?.self_tds_self_lease}</td>
                <td className="border">{formData?.lo1_tds_self_lease}</td>
                <td className="border">{formData?.lo2_tds_self_lease}</td>
              </tr>
              <tr>
                <td className="border">(b) CESS on self lease</td>
                <td className="border">{formData?.self_cess_self_lease}</td>
                <td className="border">{formData?.lo1_cess_self_lease}</td>
                <td className="border">{formData?.lo2_cess_self_lease}</td>
              </tr>
              <tr>
                <td className="border">(ii) Profits and gains of Business Profession (No Loss)</td>
                <td className="border">{formData?.self_capital_gains}</td>
                <td className="border">{formData?.lo1_capital_gains}</td>
                <td className="border">{formData?.lo2_capital_gains}</td>
              </tr>
              <tr>
                <td className="border">(iii) Capital Gains</td>
                <td className="border">{formData?.self_capital_gains}</td>
                <td className="border">{formData?.lo1_capital_gains}</td>
                <td className="border">{formData?.lo2_capital_gains}</td>
              </tr>
              <tr>
                <td className="border">(iv) Other sources (No Loss) interest / others</td>
                <td className="border">{formData?.self_other_sources}</td>
                <td className="border">{formData?.lo1_other_sources}</td>
                <td className="border">{formData?.lo2_other_sources}</td>
              </tr>
              <tr>
                <td className="border">Aggregate of (i) to (iv)</td>
                <td className="border">{formData?.self_aggregate_items}</td>
                <td className="border">{formData?.lo1_aggregate_items}</td>
                <td className="border">{formData?.lo2_aggregate_items}</td>
              </tr>
              <tr>
                <td className="border">(c) TDS on Other Income</td>
                <td className="border">{formData?.self_tds_other_income}</td>
                <td className="border">{formData?.lo1_tds_other_income}</td>
                <td className="border">{formData?.lo2_tds_other_income}</td>
              </tr>
              <tr>
                <td className="border">(d) CESS on Other Income</td>
                <td className="border">{formData?.self_cess_other_income}</td>
                <td className="border">{formData?.lo1_cess_other_income}</td>
                <td className="border">{formData?.lo2_cess_other_income}</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border">Total TDS (a + c)</td>
                <td className="border">{formData?.self_total_tds}</td>
                <td className="border">{formData?.lo1_total_tds}</td>
                <td className="border">{formData?.lo2_total_tds}</td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border">Total CESS (b + d)</td>
                <td className="border">{formData?.self_total_cess}</td>
                <td className="border">{formData?.lo1_total_cess}</td>
                <td className="border">{formData?.lo2_total_cess}</td>
              </tr>
            </tbody>
          </table>
          <div className="border p-3 mt-4 text-sm leading-5">
            I hereby declare that the information submitted above is true to the best of my knowledge.
            I agree to provide all supporting proof if required by the Income Tax authorities.
          </div>
          <div className="flex justify-between mt-5 text-sm">
            <div>
              <p>Location: {formData?.declared_place}</p>
              <p>Date: {formData?.declared_date}</p>
            </div>
            <div className="text-center">
              <p className="font-bold">Signature of Employee</p>
              {signatureUrl ? (
                <img src={signatureUrl} className="w-40 border mt-1" />
              ) : (
                <p>No signature uploaded</p>
              )}
              <p className="mt-1">{formData?.employee_full_name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form12CPrintPreview;
