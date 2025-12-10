import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "@/api/axiosInstance";

const AnnualInvestmentPrintPreview: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const printRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const storedUser = typeof window !== "undefined" ? localStorage.getItem("userData") : null;
  const [details, setDetails] = useState<any>({});
  const [userProfile, setUserProfile] = useState<any>(null);
  const parsedUser = storedUser ? JSON.parse(storedUser) : null;
  const stationName = parsedUser?.stationName;
  const userId = parsedUser?.userId;
  const designation = parsedUser?.roleName;
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
    const stored = localStorage.getItem("userData");
    const userId = stored ? JSON.parse(stored)?.userId : null;
    api.get(`/api/finance/${id}`)
      .then((res) => {
        const data = res.data;
        setFormData(data);
        if (data?.signature_name) {
          let url = data.signature_name.trim().replace(/\\/g, "/");
          if (url.startsWith("http")) {
            url = url.replace(
              "uploads/employee_family",
              "files/employee_form12"
            );
            setSignatureUrl(url);
          } else {
            url = url.replace(
              "uploads/employee_family",
              "files/employee_form12"
            );
            const finalUrl = `${api.defaults.baseURL}/${url}`;
            setSignatureUrl(finalUrl);
          }
        }
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

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
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("Annual_Investment.pdf");
  };

  const printCSS = `
    @page { size: A4; margin: 8mm; }
    @media print {
      body * { visibility: hidden !important; }
      #investment-preview-root, #investment-preview-root * {
        visibility: visible !important;
      }
      #investment-preview-root {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .no-print { display: none !important; }
    }
  `;

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow-lg flex flex-col h-[90vh]">
      <style>{printCSS}</style>
      <div className="no-print flex items-center justify-between bg-gray-100 p-3 border-b">
        <h2 className="text-lg font-semibold">Annual Investment – Print Preview</h2>
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border rounded-md"
          >
            ← Back
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
          >
            🖨 Print
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-green-600 text-white rounded-md"
          >
            ⬇ Download
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        <div
          id="investment-preview-root"
          ref={printRef}
          className="bg-white border border-black mx-auto"
          style={{
            width: "794px",
            padding: "20px",
            fontFamily: "Arial, sans-serif",
            fontSize: "12px"
          }}
        >
          <div className="border p-3">
            <div className="flex items-center gap-3">
              <img
                src="/companylogo.png"
                alt="Company Logo"
                style={{ width: "90px", height: "50px" }}
              />
              <h2 className="text-xl font-bold text-center flex-1">
                ANNUAL INVESTMENTS FOR <br /> TAX DEDUCTION OF EMPLOYEE
              </h2>
            </div>
            <hr className="my-3" />
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td>Employee Name :</td>
                  <td>{formData?.first_name} {formData?.last_name}</td>
                  <td>Employee No :</td>
                  <td>{formData?.employee_code}</td>
                </tr>
                <tr>
                  <td>Designation :</td>
                  <td>{designation}</td>
                  <td>Location :</td>
                  <td>{stationName}</td>
                </tr>
                <tr>
                  <td>Financial Year :</td>
                  <td>{formData?.financial_year}</td>
                  <td>PAN :</td>
                     <td>{formData?.pan || details.pan}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="border p-3 mt-3 text-sm">
            <p>Are you Opting Out Concessional Rate of Income (115 BAC)?</p>
            <div className="flex gap-8 mt-1">
              <p>Yes: {formData?.opting_for_concessional_rate === "Yes" ? "Yes" : "No"}</p>
            </div>
            <p className="mt-3">Are you residing in a rented house?</p>
            <div className="flex gap-8 mt-1">
              <p>Yes: {formData?.residing_in_rented_house === "Yes" ? "Yes" : "No"}</p>
            </div>
            {formData?.residing_in_rented_house === "Yes" && (
              <>
                <p className="mt-3 font-bold">Landlord Name & Address:</p>
                <p>{formData?.landlord_name}</p>
                <p>{formData?.temporary_address}</p>

                <p className="mt-2 font-bold">Monthly Rent: ₹{formData?.monthly_rent}</p>
              </>
            )}
          </div>
          <table className="w-full border mt-4 text-sm border-collapse" cellPadding={8}>
            <thead>
              <tr className="bg-gray-200">
                <th className="border w-2/3 text-left">INVESTMENT TYPE</th>
                <th className="border w-1/3 text-right">AMOUNT (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border">Investment under Pension Plan</td>
                <td className="border text-right">
                  {formData?.pension_plan || 0}
                </td>
              </tr>
              <tr>
                <td className="border">LIC Premium (Paid by Employee)</td>
                <td className="border text-right">
                  {formData?.lic_premium || 0}
                </td>
              </tr>
              <tr>
                <td className="border">PPF</td>
                <td className="border text-right">
                  {formData?.ppf || 0}
                </td>
              </tr>
              <tr>
                <td className="border">ULIP</td>
                <td className="border text-right">
                  {formData?.ulip || 0}
                </td>
              </tr>
              <tr>
                <td className="border">
                  Tuition Fees Paid for Children (Max 2 Children)
                </td>
                <td className="border text-right">
                  {formData?.tuition_fees || 0}
                </td>
              </tr>
              <tr>
                <td className="border">NSC</td>
                <td className="border text-right">
                  {formData?.nsc || 0}
                </td>
              </tr>
              <tr>
                <td className="border">NSC Interest</td>
                <td className="border text-right">
                  {formData?.nsc_interest || 0}
                </td>
              </tr>
              <tr>
                <td className="border">Housing Loan Repayment</td>
                <td className="border text-right">
                  {formData?.housing_loan_repayment || 0}
                </td>
              </tr>
              <tr className="bg-gray-100 font-bold">
                <td className="border">Total Investment Under 80C</td>
                <td className="border text-right">
                  {Number(formData?.lic_premium || 0) +
                    Number(formData?.ppf || 0) +
                    Number(formData?.ulip || 0) +
                    Number(formData?.tuition_fees || 0) +
                    Number(formData?.nsc || 0) +
                    Number(formData?.nsc_interest || 0) +
                    Number(formData?.housing_loan_repayment || 0)}
                </td>
              </tr>
              <tr>
                <td className="border">Education Loan Interest (80E)</td>
                <td className="border text-right">
                  {formData?.educational_loan_interest || 0}
                </td>
              </tr>
              <tr>
                <td className="border">Contribution to NPS (80CCD)</td>
                <td className="border text-right">
                  {formData?.contribution_to_nps || 0}
                </td>
              </tr>
              <tr className="bg-gray-300 font-bold">
                <td className="border">TOTAL INVESTMENTS</td>
                <td className="border text-right">
                  {Number(formData?.pension_plan || 0) +
                    Number(formData?.lic_premium || 0) +
                    Number(formData?.ppf || 0) +
                    Number(formData?.ulip || 0) +
                    Number(formData?.tuition_fees || 0) +
                    Number(formData?.nsc || 0) +
                    Number(formData?.nsc_interest || 0) +
                    Number(formData?.housing_loan_repayment || 0) +
                    Number(formData?.educational_loan_interest || 0) +
                    Number(formData?.contribution_to_nps || 0)}
                </td>
              </tr>
            </tbody>
          </table>
          <div className="border p-3 mt-4 text-sm leading-5">
            I hereby declare that the information submitted above is true to the
            best of my knowledge. I agree to produce original proofs whenever
            asked by the Company / Income Tax Department.
          </div>
          <div className="flex justify-between mt-5 text-sm">
            <div>
              <p>Place: {stationName}</p>
              <p>Date: {formData?.date}</p>
            </div>
            <div className="text-center">
              <p className="font-bold">Signature of Employee</p>
              {signatureUrl ? (
                <img src={signatureUrl} className="w-40 border mt-1" />
              ) : (
                <p>No signature uploaded</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnualInvestmentPrintPreview;
