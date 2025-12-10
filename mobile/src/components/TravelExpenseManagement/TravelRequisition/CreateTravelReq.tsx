import { Plus, X } from "lucide-react"
import { useEffect, useState } from "react"
import api from "@/api/axiosInstance"
 
interface CreateTravelReqProps {
  onClose?: () => void
}
 
const CreateTravelReq: React.FC<CreateTravelReqProps> = ({ onClose }) => {
  const [employee, setEmployee] = useState({
    name: "",
    number: "",
    designation: "",
    grade: "",
    station: "",
    department: "",
    purpose: "",
  })
 
  const [travels, setTravels] = useState([
    { from: "", to: "", date: "", number: "", class: "", remark: "" },
  ])
 
  const [hotels, setHotels] = useState([{ city: "", name: "", remark: "" }])
 
  const [cars, setCars] = useState([
    { city: "", from: "", to: "", type: "", remark: "" },
  ])
 
  const [visa, setVisa] = useState("")
  const [emigration, setEmigration] = useState(false)
  const [foreignExchange, setForeignExchange] = useState("")
  const [notes, setNotes] = useState("")
 
  // --------------- ERROR STATES -----------------
  const [errors, setErrors] = useState<any>({})
 
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
          purpose: "",
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
 
  // =============== FORM VALIDATION ===============
  const validateForm = () => {
    let newErrors: any = {}
 
    // Employee fields
    if (!employee.name.trim()) newErrors.name = "Employee name required"
    if (!employee.number.trim()) newErrors.number = "Employee number required"
    if (!employee.designation.trim())
      newErrors.designation = "Designation/Grade required"
    if (!employee.grade.trim()) newErrors.grade = "Grade required"
    if (!employee.station.trim()) newErrors.station = "Station required"
    if (!employee.department.trim())
      newErrors.department = "Department required"
    if (!employee.purpose.trim())
      newErrors.purpose = "Purpose of travel required"
 
    // Travel validations
    newErrors.travels = travels.map((t) => {
      const travelErr: any = {}
      if (!t.from.trim()) travelErr.from = "Required"
      if (!t.to.trim()) travelErr.to = "Required"
      if (!t.date.trim()) travelErr.date = "Required"
      if (!t.number.trim()) travelErr.number = "Required"
      if (!t.class.trim()) travelErr.class = "Required"
      return travelErr
    })
 
    // Hotel validations
    newErrors.hotels = hotels.map((h) => {
      const hErr: any = {}
      if (!h.city.trim()) hErr.city = "Required"
      if (!h.name.trim()) hErr.name = "Required"
      return hErr
    })
 
    // Car validations
    newErrors.cars = cars.map((c) => {
      const cErr: any = {}
      if (!c.city.trim()) cErr.city = "Required"
      if (!c.from.trim()) cErr.from = "Required"
      if (!c.to.trim()) cErr.to = "Required"
      if (!c.type.trim()) cErr.type = "Required"
      return cErr
    })
 
    setErrors(newErrors)
 
    // Check if there are actual errors
    const hasEmployeeErrors = Object.keys(newErrors).some(
      (k) => k !== "travels" && k !== "hotels" && k !== "cars" && newErrors[k],
    )
    const hasTravelErrors = newErrors.travels.some(
      (t: any) => Object.keys(t).length > 0,
    )
    const hasHotelErrors = newErrors.hotels.some(
      (h: any) => Object.keys(h).length > 0,
    )
    const hasCarErrors = newErrors.cars.some(
      (c: any) => Object.keys(c).length > 0,
    )
 
    return !(
      hasEmployeeErrors ||
      hasTravelErrors ||
      hasHotelErrors ||
      hasCarErrors
    )
  }
 
  const onSubmit = () => {
    if (!validateForm()) {
      // alert("Please fill all required fields")
      return
    }
 
    // alert("Form is valid — submitting!")
  }
 
  // ================== DYNAMIC HANDLERS ==================
  const addTravel = () =>
    setTravels([
      ...travels,
      { from: "", to: "", date: "", number: "", class: "", remark: "" },
    ])
  const removeTravel = (i: number) =>
    travels.length > 1 && setTravels(travels.filter((_, idx) => idx !== i))
  const updateTravel = (i: number, field: string, value: string) => {
    const updated = [...travels]
    // @ts-ignore
    updated[i][field] = value
    setTravels(updated)
  }
 
  const addHotel = () =>
    setHotels([...hotels, { city: "", name: "", remark: "" }])
  const removeHotel = (i: number) =>
    hotels.length > 1 && setHotels(hotels.filter((_, idx) => idx !== i))
  const updateHotel = (i: number, field: string, value: string) => {
    const updated = [...hotels]
    // @ts-ignore
    updated[i][field] = value
    setHotels(updated)
  }
 
  const addCar = () =>
    setCars([...cars, { city: "", from: "", to: "", type: "", remark: "" }])
  const removeCar = (i: number) =>
    cars.length > 1 && setCars(cars.filter((_, idx) => idx !== i))
  const updateCar = (i: number, field: string, value: string) => {
    const updated = [...cars]
    // @ts-ignore
    updated[i][field] = value
    setCars(updated)
  }
 
 
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-3">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-[900px] max-h-[92vh] flex flex-col">
        {/* ---------- HEADER ---------- */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="text-lg font-semibold">Travel Requisition Form</h2>
 
          <button onClick={onClose}>
            <X size={22} />
          </button>
        </div>
 
        {/* ---------- FORM BODY ---------- */}
        <div className="px-6 py-4 space-y-7 overflow-y-auto">
          {/* ===== Employee Information ===== */}
          <section className="space-y-2">
            <h3 className="font-semibold">Employee Information</h3>
 
            <div className="grid grid-cols-2 gap-5">
              <Input
                label="Employee Name"
                placeholder="Enter employee name"
                value={employee.name}
                error={errors.name}
                required
                onChange={(e: any) =>
                  setEmployee({ ...employee, name: e.target.value })
                }
              />
 
              <Input
                label="Employee Number"
                placeholder="Enter employee number"
                value={employee.number}
                error={errors.number}
                required
                onChange={(e: any) =>
                  setEmployee({ ...employee, number: e.target.value })
                }
              />
 
              <Input
                label="Designation"
                placeholder="e.g. Senior Manager - E3"
                value={employee.designation}
                error={errors.designation}
                required
                onChange={(e: any) =>
                  setEmployee({ ...employee, designation: e.target.value })
                }
              />
 
              <Input
                label="Grade"
                placeholder="e.g. - E3"
                value={employee.grade}
                error={errors.grade}
                required
                onChange={(e: any) =>
                  setEmployee({ ...employee, grade: e.target.value })
                }
              />
              <Input
                label="Station"
                placeholder="Enter location"
                value={employee.station}
                error={errors.station}
                required
                onChange={(e: any) =>
                  setEmployee({ ...employee, station: e.target.value })
                }
              />
              <Input
                label="Department"
                placeholder="Enter department"
                value={employee.department}
                error={errors.department}
                required
                onChange={(e: any) =>
                  setEmployee({ ...employee, department: e.target.value })
                }
              />
            </div>
 
            <Input
              label="Purpose of Travel"
              placeholder="Describe the purpose of travel"
              value={employee.purpose}
              error={errors.purpose}
              required
              onChange={(e: any) =>
                setEmployee({ ...employee, purpose: e.target.value })
              }
            />
          </section>
 
          {/* ===== Travel Itinerary ===== */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Travel Details</h3>
 
              <button
                onClick={addTravel}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus size={16} /> Add Travel
              </button>
            </div>
 
            {travels.map((t, i) => (
              <div
                key={i}
                className="border bg-white rounded-lg p-4 relative shadow-sm"
              >
                {travels.length > 1 && (
                  <button
                    onClick={() => removeTravel(i)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                )}
 
                <h4 className="font-semibold mb-3">Travel {i + 1}</h4>
 
                {/* Row 1 */}
                <div className="grid grid-cols-3 gap-5">
                  <Input
                    label="From"
                    value={t.from}
                    error={errors.travels?.[i]?.from}
                    required
                    onChange={(e: any) =>
                      updateTravel(i, "from", e.target.value)
                    }
                  />
 
                  <Input
                    label="To"
                    value={t.to}
                    error={errors.travels?.[i]?.to}
                    required
                    onChange={(e: any) => updateTravel(i, "to", e.target.value)}
                  />
 
                  <Input
                    label="Date"
                    type="date"
                    value={t.date}
                    error={errors.travels?.[i]?.date}
                    required
                    onChange={(e: any) =>
                      updateTravel(i, "date", e.target.value)
                    }
                  />
                </div>
 
                {/* Row 2 */}
                <div className="grid grid-cols-3 gap-5 mt-5">
                  <Input
                    label="Flight/Train Number"
                    value={t.number}
                    error={errors.travels?.[i]?.number}
                    required
                    onChange={(e: any) =>
                      updateTravel(i, "number", e.target.value)
                    }
                  />
 
                  <Input
                    label="Class of Travel"
                    value={t.class}
                    error={errors.travels?.[i]?.class}
                    required
                    onChange={(e: any) =>
                      updateTravel(i, "class", e.target.value)
                    }
                  />
 
                  <Input
                    label="Remarks"
                    value={t.remark}
                    onChange={(e: any) =>
                      updateTravel(i, "remark", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </section>
 
          {/* HOTEL */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Hotel Reservations</h3>
 
              <button
                onClick={addHotel}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus size={16} /> Add Hotel
              </button>
            </div>
 
            {hotels.map((h, i) => (
              <div key={i} className="relative border bg-white rounded-lg p-5">
                {hotels.length > 1 && (
                  <button
                    onClick={() => removeHotel(i)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                )}
 
                <h4 className="font-semibold mb-4">Hotel {i + 1}</h4>
 
                <div className="grid grid-cols-3 gap-5">
                  <Input
                    label="City"
                    value={h.city}
                    error={errors.hotels?.[i]?.city}
                    required
                    onChange={(e: any) =>
                      updateHotel(i, "city", e.target.value)
                    }
                  />
 
                  <Input
                    label="Hotel Name"
                    value={h.name}
                    error={errors.hotels?.[i]?.name}
                    required
                    onChange={(e: any) =>
                      updateHotel(i, "name", e.target.value)
                    }
                  />
 
                  <Input
                    label="Remarks"
                    value={h.remark}
                    onChange={(e: any) =>
                      updateHotel(i, "remark", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </section>
 
          {/* CAR */}
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Car Reservations</h3>
 
              <button
                onClick={addCar}
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-2 hover:bg-blue-700"
              >
                <Plus size={16} /> Add Car
              </button>
            </div>
 
            {cars.map((c, i) => (
              <div key={i} className="relative border bg-white rounded-lg p-4">
                {cars.length > 1 && (
                  <button
                    onClick={() => removeCar(i)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                )}
 
                <h4 className="font-semibold mb-3">Car Reservation {i + 1}</h4>
 
                <div className="grid grid-cols-5 gap-5">
                  <Input
                    label="City"
                    value={c.city}
                    error={errors.cars?.[i]?.city}
                    required
                    onChange={(e: any) => updateCar(i, "city", e.target.value)}
                  />
 
                  <Input
                    label="From"
                    value={c.from}
                    error={errors.cars?.[i]?.from}
                    required
                    onChange={(e: any) => updateCar(i, "from", e.target.value)}
                  />
 
                  <Input
                    label="To"
                    value={c.to}
                    error={errors.cars?.[i]?.to}
                    required
                    onChange={(e: any) => updateCar(i, "to", e.target.value)}
                  />
 
                  <Input
                    label="Car Type"
                    value={c.type}
                    error={errors.cars?.[i]?.type}
                    required
                    onChange={(e: any) => updateCar(i, "type", e.target.value)}
                  />
 
                  <Input
                    label="Remarks"
                    value={c.remark}
                    onChange={(e: any) =>
                      updateCar(i, "remark", e.target.value)
                    }
                  />
                </div>
              </div>
            ))}
          </section>
 
          {/* SPECIAL SERVICES */}
          <section className="space-y-2">
            <h3 className="font-semibold">Special Services</h3>
 
            <Input
              label="Visa Required For"
              value={visa}
              onChange={(e: any) => setVisa(e.target.value)}
            />
 
            <div className="flex items-center gap-3 my-3">
              <button
                className={`w-10 h-5 rounded-full flex p-1 duration-300 ${
                  emigration ? "bg-blue-600" : "bg-gray-400"
                }`}
                type="button"
                onClick={() => setEmigration(!emigration)}
              >
                <div
                  className={`h-4 w-4 bg-white rounded-full shadow duration-300 ${
                    emigration ? "translate-x-5" : ""
                  }`}
                />
              </button>
              <span className="text-xs text-gray-600">
                Emigration Suspension Required
              </span>
            </div>
 
            <Input
              label="Foreign Exchange"
              value={foreignExchange}
              onChange={(e: any) => setForeignExchange(e.target.value)}
            />
 
            <label className="text-xs font-medium">Notes</label>
            <textarea
              className="w-full border rounded-lg px-3 py-2 bg-gray-50 text-sm"
              placeholder="Add comments..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </section>
        </div>
 
        {/* ---------- FOOTER ---------- */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
          >
            Save Draft
          </button>
 
          <button
            onClick={onSubmit}
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            Submit for Approval
          </button>
        </div>
      </div>
    </div>
  )
}
 
export default CreateTravelReq
 
// ===================== REUSABLE UI =====================
const Input = ({
  label,
  placeholder,
  type = "text",
  value,
  onChange,
  error,
  required = false,
}: any) => (
  <div className="space-y-1">
    <label className="text-xs font-medium flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
 
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`w-full border rounded-lg px-3 py-2 text-sm bg-gray-50
        ${
          error
            ? "border-red-500 focus:ring-1 focus:ring-red-500"
            : "border-gray-300"
        }
        focus:outline-none transition
      `}
    />
 
    {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
  </div>
)
 