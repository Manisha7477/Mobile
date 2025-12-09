import { Plus, X, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/api/axiosInstance"
interface DailyAllowanceFormProps {
  onClose?: () => void
}
 
const DailyAllowanceForm: React.FC<DailyAllowanceFormProps> = ({ onClose }) => {
  const [employee, setEmployee] = useState({
    name: "",
    number: "",
    designation: "",
    grade: "",
    station: "",
    department: "",
  })
 
  const [entries, setEntries] = useState([
    {
      date: "",
      time: "",
      from: "",
      to: "",
      distance: "",
      purpose: "",
      dailyAllowance: "",
    },
  ])
 
  const [errors, setErrors] = useState<any>({})
  const [submitted, setSubmitted] = useState(false)
  const [notes, setNotes] = useState("")
  const [advance, setAdvance] = useState<number | string>("")
  const formatCurrency = (num: number) => `₹${num.toLocaleString("en-IN")}`
 
  useEffect(() => {
    const storedUser = localStorage.getItem("userData")
    const parsed = storedUser ? JSON.parse(storedUser) : null
    const userId = parsed?.userId
 
    if (!userId) return
 
    const fetchProfile = async () => {
      try {
        const res = await api.get(`/api/usersProfile/${userId}`)
        const data = res.data
 
        setEmployee({
          name: `${data.first_name} ${data.last_name}`,
          number: data.employee_code,
          designation: data.designation,
          grade: data.grade,
          station: data.station_name,
          department: "",
        })
 
        // Clear validation errors if filled:
        setErrors((prev: any) => {
          const updated = { ...prev }
          delete updated.employee
          return updated
        })
      } catch (err) {
        console.error("Error fetching employee profile:", err)
      }
    }
 
    fetchProfile()
  }, [])
 
  const calculateTotal = () => {
    return entries.reduce(
      (sum, entry) => sum + (Number(entry.dailyAllowance) || 0),
      0,
    )
  }
 
  const validateForm = () => {
    let tempErrors: any = {}
 
    // 🔹 Validate Employee Info
    Object.entries(employee).forEach(([key, value]) => {
      const isEditableField = key === "department" // Only department is editable
 
      if (isEditableField && !value.trim()) {
        if (!tempErrors.employee) tempErrors.employee = {}
        tempErrors.employee[key] = "This field is required"
      }
    })
 
    // 🔹 Validate Entries
    entries.forEach((e, index) => {
      Object.keys(e).forEach((key) => {
        if (!e[key as keyof typeof e]) {
          if (!tempErrors.entries) tempErrors.entries = {}
          if (!tempErrors.entries[index]) tempErrors.entries[index] = {}
          tempErrors.entries[index][key] = "This field is required"
        }
      })
    })
 
    setErrors(tempErrors)
    return Object.keys(tempErrors).length === 0
  }
 
  const handleAddEntry = () => {
    setEntries([
      ...entries,
      {
        date: "",
        time: "",
        from: "",
        to: "",
        distance: "",
        purpose: "",
        dailyAllowance: "",
      },
    ])
  }
 
  const total = calculateTotal()
  const gst = Number((total * 0.18).toFixed(2))
  const totalWithGst = Number((total + gst).toFixed(2))
  const advanceDeducted = Number(advance || 0)
  const finalAmount = totalWithGst - advanceDeducted
 
  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...entries]
    updated[index][field as keyof (typeof updated)[number]] = value
    setEntries(updated)
 
    if (errors.entries?.[index]?.[field]) {
      const newErrors = { ...errors }
      delete newErrors.entries[index][field]
 
      if (Object.keys(newErrors.entries[index]).length === 0) {
        delete newErrors.entries[index]
      }
 
      setErrors(newErrors)
    }
  }
 
  const handleDelete = (index: number) => {
    if (entries.length === 1) return
    setEntries(entries.filter((_, i) => i !== index))
  }
 
  const handleSubmit = () => {
    setSubmitted(true)
    if (validateForm()) {
      alert("Form Submitted Successfully ✔")
    }
  }
 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-3">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[850px] max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-xl font-semibold text-gray-800">
            Daily Allowance Claim Sheet
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={22} />
          </button>
        </div>
 
        {/* Body */}
        <div className="px-6 py-4 space-y-7 overflow-y-auto">
          {/* Employee Section */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-900">
              Employee Information
            </h3>
            <p className="text-xs text-gray-500">
              Basic details about the employee
            </p>
 
            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Employee Name"
                required
                value={employee.name}
                disabled
                error={errors.employee?.name}
                onChange={(e: any) =>
                  setEmployee({ ...employee, name: e.target.value })
                }
              />
              <Input
                label="Employee Number"
                required
                value={employee.number}
                disabled
                error={errors.employee?.number}
                onChange={(e: any) =>
                  setEmployee({ ...employee, number: e.target.value })
                }
              />
 
              <Input
                label="Designation"
                required
                value={employee.designation}
                disabled
                error={errors.employee?.designation}
                onChange={(e: any) =>
                  setEmployee({ ...employee, designation: e.target.value })
                }
              />
              <Input
                label="Grade"
                required
                value={employee.grade}
                disabled
                error={errors.employee?.grade}
                onChange={(e: any) =>
                  setEmployee({ ...employee, grade: e.target.value })
                }
              />
 
              <Input
                label="Station"
                required
                value={employee.station}
                disabled
                error={errors.employee?.station}
                onChange={(e: any) =>
                  setEmployee({ ...employee, station: e.target.value })
                }
              />
              <Input
                label="Department"
                required
                value={employee.department}
                error={errors.employee?.department}
                onChange={(e: any) =>
                  setEmployee({ ...employee, department: e.target.value })
                }
              />
            </div>
          </section>
 
          {/* Dynamic Daily Allowance Section */}
          <section className="space-y-2">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-900">
                  Daily Allowance Entries
                </h3>
                <p className="text-xs text-gray-500">
                  Enter details of your allowance claims
                </p>
              </div>
 
              <button
                onClick={handleAddEntry}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition"
              >
                <Plus size={16} /> Add Entry
              </button>
            </div>
 
            {entries.map((entry, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-gray-50 relative"
              >
                {entries.length > 1 && (
                  <button
                    onClick={() => handleDelete(index)}
                    className="absolute right-3 top-3 text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
 
                <div className="grid grid-cols-3 gap-5">
                  {[
                    { label: "Date", type: "date", field: "date" },
                    {
                      label: "Time (To–From)",
                      field: "time",
                      placeholder: "HH:MM - HH:MM",
                    },
                    {
                      label: "Travel From",
                      field: "from",
                      placeholder: "Mumbai",
                    },
                    { label: "To", field: "to", placeholder: "Pune" },
                    {
                      label: "Distance From Station (KM)",
                      type: "number",
                      field: "distance",
                    },
                    {
                      label: "Purpose",
                      field: "purpose",
                      placeholder: "Training Program",
                    },
                    {
                      label: "Daily Allowance Amount (₹)",
                      field: "dailyAllowance",
                      type: "number",
                      placeholder: "Enter Amount",
                    },
                  ].map((item) => (
                    <Input
                      key={item.field}
                      label={item.label}
                      type={item.type}
                      value={entry[item.field as keyof typeof entry]}
                      placeholder={item.placeholder}
                      required
                      error={errors.entries?.[index]?.[item.field]}
                      onChange={(e: any) =>
                        handleChange(index, item.field, e.target.value)
                      }
                    />
                  ))}
                </div>
              </div>
            ))}
 
            <div className="text-right font-semibold border-t pt-2 text-gray-700">
              Grand Total: ₹{calculateTotal()}
            </div>
          </section>
 
          {/* Summary */}
          <section className="space-y-2">
            <h3 className="font-semibold text-gray-900">
              Total Amount Summary *
            </h3>
            <p className="text-xs text-gray-500">
              Final calculation of reimbursement amount
            </p>
 
            <div className="grid grid-cols-4 gap-5">
              {/* Amount Excluding GST */}
              <div className="bg-gray-100 p-3 rounded-lg border">
                <label className="text-xs font-medium text-gray-600">
                  Amount Excl. GST
                </label>
                <div className="text-lg font-semibold">
                  {formatCurrency(total)}
                </div>
              </div>
 
              {/* GST */}
              <div className="bg-gray-100 p-3 rounded-lg border">
                <label className="text-xs font-medium text-gray-600">
                  GST Amount (18%)
                </label>
                <div className="text-lg font-semibold">
                  {formatCurrency(gst)}
                </div>
              </div>
 
              {/* Amount Including GST */}
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-400">
                <label className="text-xs font-medium text-blue-700 font-semibold">
                  Amount Including GST
                </label>
                <div className="text-lg font-bold text-blue-600">
                  {formatCurrency(totalWithGst)}
                </div>
              </div>
 
              {/* Advance Taken Input */}
              <Input
                label="Less: Advance Taken *"
                type="number"
                placeholder="Enter amount"
                required
                value={advance}
                onChange={(e: any) => setAdvance(e.target.value)}
              />
            </div>
 
            {/* Final Amount */}
            <div className="pt-2 border-t">
              <span className="font-medium text-gray-700">
                Amount Receivable/Payable:{" "}
              </span>
              <span className="text-xl font-bold text-blue-600">
                {formatCurrency(finalAmount)}
              </span>
            </div>
          </section>
 
          {/* Notes Section */}
          <section className="space-y-2 pt-3">
            <label className="text-xs font-medium text-gray-600">
              Notes{" "}
              <span className="text-gray-400">
                (optional for approval, required for reject/send back)
              </span>
            </label>
 
            <textarea
              placeholder="Add your comments here..."
              className="w-full border rounded-lg px-3 py-3 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              rows={3}
              onChange={(e) => setNotes(e.target.value)}
              value={notes}
            />
          </section>
        </div>
 
        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg text-sm bg-gray-300 hover:bg-gray-400 transition"
          >
            Save Draft
          </button>
 
          <button
            className="px-5 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-700 text-white transition"
            onClick={handleSubmit}
          >
            Submit Claim
          </button>
        </div>
      </div>
    </div>
  )
}
// ---------- Reusable Input ----------
const Input = ({
  label,
  required,
  value,
  type = "text",
  placeholder,
  disabled,
  className = "",
  error,
  onChange,
}: any) => (
  <div className="space-y-1">
    <label className="text-xs font-medium text-gray-600">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
 
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full border rounded-lg px-3 py-2 text-sm focus:ring-2
        ${error ? "border-red-500 focus:ring-red-500" : "focus:ring-blue-500"}
        ${
          disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"
        } ${className}`}
    />
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
)
export default DailyAllowanceForm;