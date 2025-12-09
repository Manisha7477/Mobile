import api from "@/api/axiosInstance"
import {
  ActivePowerChartConfig,
  ActivePowerThresholds,
  ApparentPowerChartConfig,
  ApparentPowerThresholds,
  BarChartConfig,
  BarChartData,
  CurrentThresholds,
  EnergyCostChartAPIResponse,
  FrequencyChartConfig,
  FrequencyThresholds,
  GaugeChartProps,
  IFormVariable,
  ISampleData,
  ITableHeader,
  InfoCardProps,
  KvahEnergyChartConfig,
  KvahEnergyThresholds,
  KvarhEnergyChartConfig,
  KvarhEnergyThresholds,
  KwhEnergyChartConfig,
  KwhEnergyThresholds,
  LineChartConfig,
  LineWiseVoltageThresholds,
  PhaseChartConfig,
  PhaseWiseVoltageThresholds,
  PowerFactorChartConfig,
  PowerFactorThresholds,
  ReactivePowerChartConfig,
  ReactivePowerThresholds,
  type UtilityConfig,
  type UtilityType,
} from "@/utils/types"

export const MANAGE_USERS_HEADER_DATA: ITableHeader[] = [
  { name: "slNo", display: "S.No." },
  { name: "firstName", display: "First Name" },
  { name: "lastName", display: "Last Name" },
  { name: "contactPhone", display: "Contact Number" },
  { name: "email", display: "Email Address" },
  { name: "roleName", display: "Role" },
  // { name: "employeeId", display: "Employee ID" },
  // { name: "plantName", display: "Plant Name" },
  // { name: "engineerName", display: "Engineer Name" },
  // { name: "managerName", display: "Manager Name" },
  { name: "action", display: "Action" },
]

export const DIGITAL_HEADER_DATA: ITableHeader[] = [
  { name: "slNo", display: "S.No." },
  { name: "shiftID", display: "Shift ID" },
  { name: "date", display: "Date" },
  { name: "location", display: "Location" },
  { name: "place", display: "Palace" },
  { name: "name", display: "Name" },
  { name: "time", display: "Time" },
  { name: "action", display: "Action" },
]

export const MOC_HEADER_DATA: ITableHeader[] = [
  // { name: "slNo", display: "S.No." },
  { name: "moc_request_no", display: "Request No." },
  // { name: "requestNo", display: "Request No." },
  { name: "title", display: "Title" },
  { name: "station_name", display: "Station" },
  { name: "created_by", display: "Requester" },
  { name: "date", display: "Date" },
  { name: "status", display: "Status" },
  { name: "action", display: "Action" },
  { name: "mocClosure", display: "MOC Closure" },
]

export const GATEPASS_HEADER_DATA: ITableHeader[] = [
  { name: "gate_pass_no", display: "Gate Pass No." },
  { name: "formtype", display: "Type" },
  { name: "date_time", display: "Date" },
  { name: "station", display: "Station" },
  { name: "purpose", display: "Purpose" },
  { name: "created_by", display: "Initiated By" },
  { name: "status", display: "Status" },
  { name: "action", display: "Action" },
]

export const HR_EMP_HEADER_DATA: ITableHeader[] = [
  { name: "full_name", display: "Employee Name" },
  { name: "contact_phone", display: "Mobile No." },
  { name: "designation", display: "Designation" },
  { name: "station_name", display: "Station" },
  { name: "dob", display: "DOB" },
  { name: "grade", display: "Grade" },
  { name: "supervisor_name", display: "Supervisor" },
  { name: "email", display: "Work Email" },
  { name: "date_of_joining", display: "Joining Date" },
  { name: "job_type", display: "Employement Type" },
  { name: "action", display: "Action" },
]

export const ASSET_EMP_HEADER_DATA: ITableHeader[] = [
  { name: "employee_full_name", display: "Employee Name" },
  { name: "employee_code", display: "Employee ID." },
  { name: "submissionType", display: "Submission Type" },
  { name: "financial_year", display: "Fiscal Year" },
  { name: "date", display: "Submitted On" },
  { name: "status", display: "Status" },
  { name: "action", display: "Action" },
]

export const ASSET_PERSONAL_HEADER_DATA: ITableHeader[] = [
  { name: "employee_full_name", display: "Employee Name" },
  { name: "submissionType", display: "Submission Type" },
  { name: "financial_year", display: "Fiscal Year" },
  { name: "date", display: "Submitted On" },
  { name: "status", display: "Status" },
  { name: "action", display: "Action" },
]
export const TRAVEL_EMP_HEADER_DATA: ITableHeader[] = [
  { name: "claim_id", display: "Claim Id" },
  { name: "type", display: "Type" },
  { name: "purpose", display: "Purpose" },
  { name: "submitted_date", display: "Submitted Date" },
  { name: "amount", display: "Amount" },
  { name: "current_stage", display: "Current Stage" },
  { name: "status", display: "Status" },
  { name: "action", display: "Action" },
  { name: "amount_disbursed", display: "Amount Disbursed" },
]
export const TRAVEL_EMP_REQ_HEADER_DATA: ITableHeader[] = [
  { name: "claim_id", display: "Claim Id" },
  { name: "type", display: "Type" },
  { name: "employee", display: "Employee Name" },
  { name: "submitted_date", display: "Submitted Date" },
  { name: "amount", display: "Amount" },
  { name: "violations", display: "Violations" },
  { name: "status", display: "Status" },
  { name: "action", display: "Action" },
]

export const GP_RETURNABLE_HEADER_DATA: ITableHeader[] = [
  { name: "returnable_gate_pass_no", display: "Gate Pass No." },
  { name: "formtype", display: "Type" },
  { name: "date_time", display: "Date" },
  { name: "station", display: "Station" },
  { name: "purpose", display: "Purpose" },
  { name: "created_by", display: "Initiated By" },
  { name: "status", display: "Status" },
  { name: "action", display: "Action" },
]

export const LEAVE_HEADER_DATA: ITableHeader[] = [
  { name: "leave_type", display: "Leave Type" },
  { name: "dateDuration", display: "Date" },
  { name: "number_of_days", display: "Duration" },
  { name: "created_at", display: "Applied on" },
  { name: "updated_at", display: "Approved on " },
  { name: "reason", display: "Reason" },
  { name: "status", display: "Status" },
]

export const LEAVE_ALLOCATION_HEADER_DATA: ITableHeader[] = [
  { name: "leave_type_name", display: "Leave Type" },
  { name: "encashable", display: "Encashable" },
  { name: "non_encashable", display: "Non Encashable" },
  { name: "allocated", display: "Allocated" },
  { name: "applied", display: "Applied" },
  { name: "balance", display: "Balance" },
];

export const LEAVE_REQUESTS_HEADER_DATA: ITableHeader[] = [
  { name: "employee_full_name", display: "Employee Name" },
  { name: "leave_type", display: "Leave Type" },
  { name: "dateDuration", display: "Date" },
  { name: "duration", display: "Duration" },
  { name: "appliedOn", display: "Applied on" },
  { name: "updated_at", display: "Approved" },
  { name: "reason", display: "Reason" },
  { name: "statuss", display: "Status" },
  { name: "action", display: "Action" },
]

export const USER_STRUCTURE_HEADER_DATA: ITableHeader[] = [
  { name: "slNo", display: "S.No.", visible: true },
  { name: "employeeId", display: "Employee ID", visible: true },
  { name: "employeeName", display: "Employee Name", visible: true },
  { name: "role", display: "Role", visible: true },
  { name: "email", display: "Email", visible: true },
  { name: "phoneNo", display: "Phone No.", visible: true },
  { name: "createdBy", display: "Created By", visible: true },
  { name: "modifiedBy", display: "Modified By", visible: true },
  { name: "ModifiedDate", display: "Modified Date", visible: true },
  { name: "validFrom", display: "Valid From", visible: true },
  { name: "validTo", display: "Valid To", visible: true },
]
export const MOC_REVIEW_DASHBOARD_DATA: ITableHeader[] = [
  // { name: "slNo", display: "S.No." },
  { name: "moc_request_no", display: "Request No." },
  { name: "title", display: "Title" },
  { name: "station", display: "Station" },
  { name: "location", display: "Location" },
  { name: "created_by", display: "Requester" },
  { name: "date", display: "Date" },
  { name: "status", display: "Status" },
  { name: "action", display: "Action" },
]
export const ROLE_ASSIGNMENT_HEADER_DATA: ITableHeader[] = [
  {
    name: "slNo",
    display: "SI. No.",
  },
  {
    name: "firstName",
    display: "First Name",
  },
  {
    name: "lastName",
    display: "Last Name",
  },
  // {
  //   name: "PlantId",
  //   display: "Plant ID",
  // },
  {
    name: "emailAddress",
    display: "Email ID",
  },
  // {
  //   name: "Employeename",np
  //   display: "Employee Name",
  // },
  {
    name: "role",
    display: "Role",
  },
  {
    name: "engineerName",
    display: "Engineer",
  },
  {
    name: "managerName",
    display: "Manager",
  },
  {
    name: "delete",
    display: "Action",
  },
]
export const ROLE_ASSIGNMENT_FORM_DATA: IFormVariable[] = [
  {
    name: "employeeId",
    type: "umCustomSelect",
    display: "Employee Id",
    default: "",
    description: "",
    required: true,
    group: 1,
    API: `/User/Employee_DD`,
    showInUpdate: true,
    filterOptions: (data: any[]) =>
      data.filter((d) => d.roleId === 3 || d.roleId === 4),
  },
  {
    name: "byEngineerId",
    type: "engineerDD",
    display: "By Engineer",
    default: "",
    description: "",
    required: false,
    group: 2,
    options: [],
    engineerDrop: "roleId",
    API: `/User/Enginneer_DD`,
    showInUpdate: true,
  },
  // 👇 Spacer field (blank space)
  {
    name: "spacer1",
    type: "spacer",
    display: "",
    default: "",
    description: "",
    required: false,
    group: 1,
    showInUpdate: false,
  },

  {
    name: "byManager",
    type: "managerDD",
    display: "By Manager",
    default: "",
    description: "",
    required: false,
    group: 2,
    options: [],
    managerDrop: "userId",
    dependedDrop: "roleId",
    API: `User/Manager_DD`,
    showInUpdate: true,
  },
  {
    name: "plantId",
    type: "dependeddropdown",
    display: "Plant Affilation",
    options: [""],
    default: "",
    description: "",
    required: true,
    group: 1,
    API: `/User/Plant_DD`,
    showInUpdate: true,
  },

  {
    name: "siteId",
    type: "siteDD",
    display: "Site",
    default: "",
    description: "",
    required: true,
    group: 2,
    // options: [],
    dependedField: "plantId",
    API: `/User/Site_DD`,
    showInUpdate: true,
  },
]
export const USER_CREATION_FORM_DATA: IFormVariable[] = [
  {
    name: "role_id",
    type: "selectone",
    display: "Role",
    options: [],
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
    placeholder: "",
  },
  // {
  //   name: "password",
  //   type: "password",
  //   display: "Password",
  //   required: true,
  //   default: "",
  //   group: 1,
  //   showInUpdate: false,
  // },
  {
    name: "station_id",
    type: "selectone",
    display: "Station",
    options: [],
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
    placeholder: "",
  },
  {
    name: "username",
    type: "string",
    display: "Username",
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
    placeholder: "",
  },
  {
    name: "first_name",
    type: "string",
    display: "First Name",
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
    placeholder: "",
  },
  {
    name: "last_name",
    type: "string",
    display: "Last Name",
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
    placeholder: "",
  },
  {
    name: "email",
    type: "string",
    display: "Email",
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
    placeholder: "",
  },
  {
    name: "contact_phone",
    type: "string",
    display: "Contact Phone",
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
    placeholder: "",
  },
  {
    name: "created_by",
    type: "string",
    display: "Created By",
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
    placeholder: "",
  },
]
export const OperationNexusPlantTableHeader: ITableHeader[] = [
  { name: "slNo", display: "S.No." },
  // { name: "employeeId", display: "PlantName" },
  { name: "plantName", display: "PlantName" },
  { name: "site", display: "Location" },
  { name: "theoEnergyCons", display: "Theoretical Energy Consumption" },
  { name: "plantEnergyEff", display: "Plant Energy Efficiency" },
  { name: "energyCostperUnit", display: "EnergyCost/Unit($/Kwh)" },
  { name: "description", display: "Description" },
  { name: "status", display: "Status" },
  { name: "contactPerson", display: "Contact Person" },
  { name: "contPersNum", display: "Contact Person No." },
  { name: "contPersEmail", display: "Contact Person Email" },
  { name: "action", display: "Action" },
]

export const PLANT_FORM_DATA: IFormVariable[] = [
  {
    name: "plantName",
    type: "string",
    display: "Plant Name",
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
  },
  {
    name: "site",
    type: "string",
    display: "Site",
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
  },

  {
    name: "plantStatus",
    type: "select",
    display: "Plant Status",
    default: "",
    description: " ",
    required: true,
    group: 1,

    showInUpdate: true,
    defaultValue: "",
    options: ["Active", "Deactive"], // plain string values
  },

  {
    name: "description",
    type: "string",
    display: "Description",
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "startDate",
    type: "date",
    display: "Start Date",
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "endDate",
    type: "date",
    display: "End Date",
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "theoEnergyCons",
    type: "number",
    display: "Theoretical Energy Consu.",
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "contPersNum",
    type: "string",
    display: "Contact Person",
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "contactPerson",
    type: "string",
    display: "Contact Person number",
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "contPersDesig",
    type: "string",
    display: "Contact Person designation",
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "contPersEmail",
    type: "string",
    display: "Contact Person Email",
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "plantEnergyEff",
    type: "string",
    display: "Plant Energy Efficiency",
    default: "",
    description: "",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "energyCostperUnit",
    type: "number",
    display: "EnergyCost/Unit($/Kwh)",
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
]

export const OperationalNexusAreaTableHeader: ITableHeader[] = [
  { name: "slNo", display: "S.No." },
  { name: "areaName", display: "Area Name" },
  { name: "plantName", display: "Plant Name" },
  { name: "siteName", display: "Site" },
  { name: "plantStatus", display: "Plant Status" },
  { name: "electricalSupp", display: "Electrical Supply" },
  {
    name: "theoPowerSupp",
    display: "Theoretical Power Consumption",
  },
  { name: "actualPowerConsum", display: "Actual Power Consumption" },
  { name: "phase", display: "Phase" },
  { name: "currentRating", display: "Current Rating" },
  { name: "highVtgRating", display: "High Voltage Rating" },
  { name: "lowVtgRating", display: "Low Voltage Rating" },
  { name: "peakLoad", display: "Peak Load" },
  { name: "description", display: "Description" },

  { name: "action", display: "Action" },
]

export const AREA_ITEM_FORM_DATA: IFormVariable[] = [
  {
    name: "areaName",
    type: "string",
    display: "Area Name",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "plantId",
    type: "dependeddropdown",
    display: "Plant Name",
    options: [""],
    default: "",
    description: "",
    required: true,
    group: 2,
    API: `/User/Plant_DD`,
    showInUpdate: true,
  },
  {
    name: "siteId",
    type: "siteDD",
    display: "Site",
    default: "",
    description: "",
    required: false,
    group: 1,
    // options: [],
    dependedField: "plantId", // 👈 New key to define dependency
    API: `/User/Site_DD`,
    showInUpdate: true,
  },

  {
    name: "plantStatus",
    type: "plantStatusDD",
    display: "Plant Status",
    default: "",
    description: " ",
    required: true,
    group: 2,
    dependedField: "plantId",
    // API: `/Area/PlantStatus`,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "description",
    type: "string",
    display: "Description",
    default: "",
    description: " ",
    required: false,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "electricalSupp",
    type: "number",
    display: "Electrical Supply",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "theoPowerSupp",
    type: "number",
    display: "Theoretical Power Consumption",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "actualPowerConsum",
    type: "number",
    display: "Actual Power Consumption",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "phase",
    type: "string",
    display: "Phase",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "currentRating",
    type: "number",
    display: "Current Rating",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "highVtgRating",
    type: "number",
    display: "Voltage Rating(High)",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "lowVtgRating",
    type: "number",
    display: "Voltage Rating(Low)",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "peakLoad",
    type: "number",
    display: "Peak Load",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
]

export const OperationNexusLineTableHeader: ITableHeader[] = [
  { name: "slNo", display: "S.No" },
  { name: "lineName", display: "Line Name" },
  { name: "plantName", display: "Plant Name" },
  { name: "areaName", display: "Area Affiliation" },
  { name: "siteName", display: "Site" },

  { name: "description", display: "Description" },
  { name: "lineType", display: "Line Type" },
  {
    name: "theoPowerCon",
    display: "Theoretical Energy Consumption",
  },
  { name: "actualPowerCon", display: "Actual Power Consumption" },
  { name: "currentRating", display: "Current Rating" },
  { name: "capacity", display: "Capacity" },
  { name: "electricalSupply", display: "Electrical Supply" },
  { name: "highVtgRating", display: "Voltage Rating(High)" },
  { name: "lowVtgRating", display: "Voltage Rating(Low)" },
  { name: "totalEquipments", display: "Total Equipements" },
  {
    name: "theorizedLineEngEff",
    display: "Theorized Line Energy Efficiency",
  },

  { name: "peakLoad", display: "Theorized Peak Load" },
  { name: "action", display: "Action" },
]
export const LINE_FORM_DATA: IFormVariable[] = [
  {
    name: "lineName",
    type: "string",
    display: "Line Name",
    default: "",
    description: " ",
    required: true,
    group: 1,
    defaultValue: "",
    showInUpdate: true,
  },
  {
    name: "lineType",
    type: "select",
    display: "Line Type",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
    options: ["Production", "Packaging"],
  },

  {
    name: "plantId",
    type: "dependeddropdown",
    display: "Plant name",
    options: [""],
    default: "",
    description: "",
    required: true,
    group: 1,
    API: `/User/Plant_DD`,
    showInUpdate: true,
  },
  {
    name: "siteId",
    type: "siteDD",
    display: "Site",
    default: "",
    description: "",
    required: false,
    group: 2,
    // options: [],
    dependedField: "plantId", //  New key to define dependency
    API: `/User/Site_DD`,
    showInUpdate: true,
  },
  {
    name: "plantStatus",
    type: "plantStatusDD",
    display: "Plant Status",
    default: "",
    description: " ",
    required: true,
    group: 1,
    dependedField: "plantId",
    // API: `/Area/PlantStatus`,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "areaAffId",
    type: "areaDD",
    display: "Area Affilation",
    options: [""],
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    dependedField: "plantId", //
    defaultValue: "",
    API: `/Line/AreaAffiliation`,
  },

  {
    name: "description",
    type: "string",
    display: "Description",
    default: "",
    description: " ",
    required: false,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "actualPowerCon",
    type: "number",
    display: "Actual Power Consumption",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "theoPowerCon",
    type: "number",
    display: "Theoretical Power Consumption",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "capacity",
    type: "number",
    display: "Capacity",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "currentRating",
    type: "number",
    display: "Current Rating",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "highVtgRating",
    type: "number",
    display: "Voltage Rating(High) ",
    default: "",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "lowVtgRating",
    type: "number",
    display: "Voltage Rating(Low) ",
    default: "",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "electricalSupply",
    type: "number",
    display: "Electrical Supply",
    default: "",
    description: " ",
    required: true,
    group: 2,
    defaultValue: "",
    showInUpdate: true,
  },

  {
    name: "totalEquipments",
    type: "number",
    display: "Total Equipements",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },

  {
    name: "peakLoad",
    type: "number",
    display: "Peak Load",
    default: "",
    description: " ",
    required: true,
    group: 2,
    defaultValue: "",
    showInUpdate: true,
  },
  {
    name: "theorizedLineEngEff",
    type: "number",
    display: "Theorized Line Energy Efficiency",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
]

export const OperationNexusEdgeDeviceTableHeader: ITableHeader[] = [
  { name: "slNo", display: "S.No" },
  { name: "edgeDeviceName", display: "EdgeDevices Name" },
  { name: "plantName", display: "Plant Affliation " },
  { name: "lineName", display: "Line Name " },
  { name: "assetName", display: "Asset Name" },
  { name: "edgeDeviceType", display: "EdgeDevices Type" },
  { name: "edgeDeviceManf", display: "EdgeDevices Manufacturer" },
  { name: "edgeDeviceModelNo", display: "EdgeDevice ModelNo" },
  { name: "edgeDeviceProtocol", display: "EdgeDevice Protocol" },
  { name: "edgeDeviceIPAddress", display: "EdgeDevice IpAddress" },
  { name: "edgeDeviceSlaveId", display: "EdgeDevice SlaveId" },
  { name: "edgeDeviceBaudRate", display: "EdgeDevice BaudRate" },
  { name: "edgeDeviceParity", display: "EdgeDevice Parity" },
  { name: "edgeDeviceStopBits", display: "EdgeDevice StopBits" },

  { name: "action", display: "Action" },
]
export const EDGE_DEVICE_FORM_DATA: IFormVariable[] = [
  {
    name: "edgeDeviceName",
    type: "string",
    display: "EdgeDevice Name",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "edgeDeviceType",
    type: "select",
    display: "EdgeDevice Type",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
    options: [
      "ENERGY METER",
      "WATER FLOW METER",
      "DIESEL FLOW METER",
      "AIR FLOW METER",
      "STEAM FLOW METER",
      "PLC",
    ],
  },
  {
    name: "edgeDeviceManf",
    type: "string",
    display: "EdgeDevice Manufacturer",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "edgeDeviceModelNo",
    type: "string",
    display: "EdgeDevice ModelNo",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "edgeDeviceProtocol",
    type: "string",
    display: "EdgeDevice Protocol",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "edgeDeviceIPAddress",
    type: "string",
    display: "EdgeDevice IpAddress",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "edgeDeviceSlaveId",
    type: "number",
    display: "EdgeDevice SlaveId ",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "edgeDeviceBaudRate",
    type: "number",
    display: "EdgeDevice Baud Rate",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
  },
  {
    name: "edgeDeviceParity",
    type: "select",
    display: "EdgeDevice Parity",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    defaultValue: "",
    options: ["Even", "Odd", "None"],
  },
  {
    name: "edgeDeviceStopBits",
    type: "selectedgedevice",
    display: "EdgeDevice StopBits",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    defaultValue: "",
    options: [1, 2],
  },

  {
    name: "plantId",
    type: "dependeddropdown",
    display: "Plant Name",
    options: [""],
    default: "",
    description: "",
    required: true,
    group: 1,
    API: `/User/Plant_DD`,
    showInUpdate: true,
  },
  {
    name: "spacer1",
    type: "spacer",
    display: "",
    default: "",
    description: "",
    required: false,
    group: 2,
    showInUpdate: false,
  },

  {
    name: "lineId",
    type: "lineDD",
    display: "Line List",
    options: [""],
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    dependedField: "plantId",
    defaultValue: "",
    API: `/EdgeDevice/GetLineDD`,
  },
  {
    name: "assetId",
    type: "assetDD",
    display: "Asset List",
    options: [""],
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    dependedField: "lineId",
    defaultValue: "",
    API: `/EdgeDevice/AssetListDD`,
  },
]
// export const UTILITY_HEADER_UTILITIES_DATA: IFormVariable = {
//   name: "utilityName",
//   type: "select",
//   display: "Utilities",
//   description: "Select the type of utility.",
//   required: true,
//   defaultValue: "",
//   options: [
//     { value: "Boiler", label: "Boiler" },
//     { value: "Chiller", label: "Chiller" },
//     { value: "Air Compressor", label: "Air Compressor" },
//     { value: "Generator", label: "Generator" },
//   ],
// }

export const UTILITY_HEADER_DROPDOWNS = [
  {
    name: "plantId",
    type: "dependeddropdown",
    display: "Plant Name",
    options: [""],
    default: "",
    description: "",
    required: true,
    group: 1,
    API: `/User/Plant_DD`,
    showInUpdate: true,
  },
  {
    name: "lineId",
    type: "lineDD",
    display: "Line List",
    options: [""],
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,
    dependedField: "plantId",
    defaultValue: "",
    API: `/EdgeDevice/GetLineDD`,
  },
  {
    name: "utility",
    type: "staticdropdown",
    display: "Utilities",
    options: [
      { id: 1, tab: "Boiler" },
      { id: 2, tab: "Chiller" },
      { id: 3, tab: "Air Compressor" },
      { id: 4, tab: "Generator" },
    ],
    default: "",
    description: "",
    required: true,
    group: 1,
    showInUpdate: true,
  },
]

export const boilerTableHeader: ITableHeader[] = [
  { name: "slNo", display: "S.No." },
  { name: "plantName", display: "Plant Name" },
  { name: "lineName", display: "Line Name" },
  { name: "boilerName", display: "Boiler Name" },
  { name: "boilerIP", display: "Boiler IP" },
  { name: "commPrtcl", display: "Communication Protocol" },
  { name: "commIdorSlaveId", display: "Slave ID/Comm. ID" },
  { name: "manufacturerName", display: "Manufacturer Name" },
  { name: "modelNumber", display: "Model Number" },
  { name: "serialNumber", display: "Serial Number" },
  { name: "manufactureYear", display: "Year of Manufacture" },
  {
    name: "maxAllowWorkPressure",
    display: "Maximum Allowable Working Pressure",
  },
  { name: "pressure", display: " Pressure" },
  { name: "temperature", display: " temperature" },
  { name: "boilerHoresePower", display: "Boiler Horsepower (BHP)" },
  { name: "surfaceArea", display: "Heating Surface Area (sq. ft)" },
  { name: "fuelType", display: "Fuel Type" },
  { name: "inputCapacity", display: "Input Capacity" },
  { name: "outputCapacity", display: "Output Capacity" },
  { name: "nationalBoardNo", display: "National Board Number" },
  { name: "asmeCodeStamp", display: "ASME Code Stamp" },
  { name: "action", display: "Action" },
]

export const UTILITIES_BOILER_FORM_DATA: IFormVariable[] = [
  {
    name: "boilerName",
    type: "string",
    display: "Boiler Name",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "boilerIP",
    type: "string",
    display: "Boiler IP",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "plantId",
    type: "dependeddropdown",
    display: "Plant Name",
    options: [""],
    default: "",
    description: "",
    required: true,
    group: 1,
    API: `/User/Plant_DD`,
    showInUpdate: true,
  },

  {
    name: "lineId",
    type: "lineDD",
    display: "Line Name",
    options: [""],
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    dependedField: "plantId",
    defaultValue: "",
    API: `/EdgeDevice/GetLineDD`,
  },

  {
    name: "commPrtcl",
    type: "string",
    display: "Communication Protocol",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "commIdorSlaveId",
    type: "number",
    display: "Communication ID/ Slave ID",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "manufacturerName",
    type: "string",
    display: "Manufacturer Name",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "modelNumber",
    type: "string",
    display: "Model Number",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "serialNumber",
    type: "string",
    display: "Serial Number",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "manufactureYear",
    type: "string",
    display: "Year of Manufacturing",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "maxAllowWorkPressure",
    type: "number",
    display: "Max Allow Work Pressure",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "pressure",
    type: "number",
    display: "Theoretical Pressure",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "temperature",
    type: "number",
    display: "Theoretical Temperature",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "boilerHoresePower",
    type: "string",
    display: "Boiler Horse Power",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "surfaceArea",
    type: "string",
    display: "Heating surface area",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "fuelType",
    type: "string",
    display: "Fuel Type",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "inputCapacity",
    type: "string",
    display: "Input capacity",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "outputCapacity",
    type: "string",
    display: "Output capacity",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "nationalBoardNo",
    type: "string",
    display: "National Board No",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "asmeCodeStamp",
    type: "string",
    display: "ASME Code Stamp",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
]

export const AIRCOMPRESSOR_TABLE_HEADER: ITableHeader[] = [
  { name: "slNo", display: "S.No" },
  { name: "plantName", display: "Plant Name" },
  { name: "lineName", display: "Line Name" },

  { name: "airCompName", display: "Air compressor Name" },

  { name: "airCompIP", display: "Air compressor IP" },

  { name: "commPrtcl", display: "Communication Protocol" },

  { name: "commIdorSlaveId", display: "Slave ID/Comm. ID" },

  { name: "manufacturerName", display: "Manufacturer" },

  { name: "modelNumber", display: " Model Number" },

  { name: "serialNumber", display: "Serial Number" },
  { name: "manufactureYear", display: "Manufacturing Year" },

  { name: "compType", display: "Compressor Type" },

  { name: "dispOrCapacity", display: "Displacement" },

  { name: "maxWorkingPresRange", display: "Working Pressure Range(Max)" },
  { name: "minWorkingPresRange", display: "Working Pressure Range(Min)" },

  { name: "motorPower", display: "Motor Power" },

  { name: "theorizedVltg", display: "Voltage " },
  { name: "theorizedPhase", display: "Phase" },
  { name: "theorizedFreq", display: "Frequency" },

  { name: "tankVolume", display: "Tank Volume" },
  { name: "rpmComp", display: "Compressor Rpm" },

  { name: "oilType", display: " Oil Type" },

  { name: "oilQty", display: "Oil Quantity" },

  { name: "action", display: "Action" },
]

export const UTILITIES_AIRCOMPRESSOR_FORM_DATA: IFormVariable[] = [
  {
    name: "airCompName",
    type: "string",
    display: "Air Compressor Name",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "airCompIP",
    type: "string",
    display: "Air Compressor IP",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "plantId",
    type: "dependeddropdown",
    display: "Plant Name",
    options: [""],
    default: "",
    description: "",
    required: true,
    group: 1,
    API: `/User/Plant_DD`,
    showInUpdate: true,
  },

  {
    name: "lineId",
    type: "lineDD",
    display: "Line Name",
    options: [""],
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    dependedField: "plantId",
    defaultValue: "",
    API: `/EdgeDevice/GetLineDD`,
  },

  {
    name: "commPrtcl",
    type: "string",
    display: "Communication Protocol",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "commIdorSlaveId",
    type: "number",
    display: "Communication ID/ Slave ID",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "manufacturerName",
    type: "string",
    display: "Manufacturer Name",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "modelNumber",
    type: "string",
    display: "Model Number",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "serialNumber",
    type: "string",
    display: "Serial Number",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "manufactureYear",
    type: "string",
    display: "Year of Manufacturing",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "compType",
    type: "string",
    display: "Compressor Type",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "dispOrCapacity",
    type: "number",
    display: "Displacement or Capacity",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "maxWorkingPresRange",
    type: "number",
    display: "Working Pressure Range(max)",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "minWorkingPresRange",
    type: "number",
    display: "Working Pressure Range(min)",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "motorPower",
    type: "number",
    display: "Motor Power",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "theorizedVltg",
    type: "number",
    display: "Theorized Voltage",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "theorizedPhase",
    type: "number",
    display: "Theorized Phase",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "theorizedFreq",
    type: "number",
    display: "Theorized Frequency",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "tankVolume",
    type: "number",
    display: "Tank Volume(If Applicable)",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "rpmComp",
    type: "number",
    display: "RPM of Compressor",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "oilType",
    type: "string",
    display: "Oil Type",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "oilQty",
    type: "number",
    display: "Oil Quantity",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
]

//generator data
export const CHILLER_TABLE_HEADER: ITableHeader[] = [
  { name: "slNo", display: "S.No." },
  { name: "plantName", display: "Plant Name" },
  { name: "lineName", display: "Line Name" },
  { name: "chillerName", display: "Chiller Name" },
  { name: "chillerIP", display: "Chiller IP" },
  { name: "commPrtcl", display: "Communication Protocol" },
  { name: "commIdorSlaveId", display: "Slave ID/Comm. ID" },
  { name: "manufacturerName", display: "Manufacturer" },
  { name: "modelNumber", display: "Model Number" },
  { name: "serialNumber", display: "Serial Number" },
  { name: "coolingCapacity", display: "Cooling Capacity (Tons/kW)" },
  { name: "powerSupplyRequirementsVtg", display: "Power Supply (Voltage)" },
  { name: "powerSupplyRequirementsPhase", display: "Power Supply (Phase)" },
  { name: "powerSupplyRequirementsFrq", display: "Power Supply (Freq)" },
  { name: "refrigerantType", display: "Refrigerant Type" },
  { name: "refrigerantQuantity", display: "Refrigerant Quantity" },
  { name: "maxOperatingPressure", display: "Max Operating Pressure " },
  { name: "minOperatingPressure", display: "Min Operating Pressure " },
  { name: "compressorType", display: "Compressor Type" },
  { name: "fullLoadAmps", display: "Full Load Amps (FLA)" },
  { name: "minCircuitAmpacity", display: "Minimum Circuit Ampacity (MCA)" },
  { name: "maxFuseSize", display: "Maximum Fuse Size" },
  { name: "action", display: "Action" },
]

export const UTILITIES_CHILLER_FORM_DATA: IFormVariable[] = [
  {
    name: "chillerName",
    type: "string",
    display: "Chiller Name",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "chillerIP",
    type: "string",
    display: "Chiller IP",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "plantId",
    type: "dependeddropdown",
    display: "Plant Name",
    options: [""],
    default: "",
    description: "",
    required: true,
    group: 1,
    API: `/User/Plant_DD`,
    showInUpdate: true,
  },

  {
    name: "lineId",
    type: "lineDD",
    display: "Line Name",
    options: [""],
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    dependedField: "plantId",
    defaultValue: "",
    API: `/EdgeDevice/GetLineDD`,
  },

  {
    name: "commPrtcl",
    type: "string",
    display: "Communication Protocol",
    default: "",
    description: " ",
    required: false,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "commIdorSlaveId",
    type: "number",
    display: "Comm. ID/ Slave ID",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "modelNumber",
    type: "string",
    display: "Model Number",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "serialNumber",
    type: "string",
    display: "Serial Number",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "manufacturerName",
    type: "string",
    display: "Manufacturer",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "coolingCapacity",
    type: "number",
    display: "Cooling Capacity(kW)",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "powerSupplyRequirementsVtg",
    type: "number",
    display: "Power Supply Voltage",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "powerSupplyRequirementsPhase",
    type: "number",
    display: "Power Supply Phase",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "powerSupplyRequirementsFrq",
    type: "number",
    display: "Power Supply Frequency",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "compressorType",
    type: "string",
    display: "Compressor Type",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "refrigerantType",
    type: "string",
    display: "Refrigerant Type",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "refrigerantQuantity",
    type: "number",
    display: "Refrigerant Quantity",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "maxOperatingPressure",
    type: "number",
    display: "Max Operating Pressure",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "minOperatingPressure",
    type: "number",
    display: "Min Operating Pressure",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "fullLoadAmps",
    type: "number",
    display: "Full Load Amps",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "minCircuitAmpacity",
    type: "number",
    display: "Minimum Circuit Ampacity",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "maxFuseSize",
    type: "number",
    display: "Maximum Fuse Size",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
]

export const UTILITIES_GENERATOR_FORM_DATA: IFormVariable[] = [
  {
    name: "generatorName",
    type: "string",
    display: "Generator Name",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "commIdorSlaveId",
    type: "number",
    display: "Communication ID/Slave ID",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "plantId",
    type: "dependeddropdown",
    display: "Plant Name",
    options: [""],
    default: "",
    description: "",
    required: true,
    group: 1,
    API: `/User/Plant_DD`,
    showInUpdate: true,
  },

  {
    name: "lineId",
    type: "lineDD",
    display: "Line Name",
    options: [""],
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,
    dependedField: "plantId",
    defaultValue: "",
    API: `/EdgeDevice/GetLineDD`,
  },
  {
    name: "generatorIP",
    type: "string",
    display: "Generator IP",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "commPrtcl",
    type: "string",
    display: "Communication Protocol",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "fuelType",
    type: "string",
    display: "Fuel Type",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "manufacturerName",
    type: "string",
    display: "Manufacturer Name",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "modelNumber",
    type: "string",
    display: "Model Number",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "serialNumber",
    type: "string",
    display: "Serial Number",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "manufactureYear",
    type: "string",
    display: "Year Of Manufacturing",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "dgEngModel",
    type: "string",
    display: "Engine Model",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "dgEngSrNo",
    type: "string",
    display: "Engine Serial Number",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "dgEngPwrOut",
    type: "string",
    display: "Engine Power Output",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "dgRatedSpeed",
    type: "string",
    display: "Rated Speed(RPM)",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "dgNoOfCyl",
    type: "string",
    display: "Number of Cylinders",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "dgFuelType",
    type: "string",
    display: "Engine Fuel Type",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "dgDisplacement",
    type: "string",
    display: "Displacement",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "dgAltModel",
    type: "string",
    display: "Alternator Model",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "dgAltSrNo",
    type: "string",
    display: "AlternatorSerial Number",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "dgAltRatedPwrOut",
    type: "string",
    display: "Alternator_Rated Power Output",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "dgAltVolt",
    type: "string",
    display: "Alternator_Voltage",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "dgAltFreq",
    type: "string",
    display: "Alternator_Frequency",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "dgAltPwrFact",
    type: "string",
    display: "Alternator_Power Factor",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "dgAltRatedCurr",
    type: "string",
    display: "Alternator_Rated Current",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },

  {
    name: "dgAltPhase",
    type: "string",
    display: "Alternator_Phase",
    default: "",
    description: " ",
    required: true,
    group: 2,
    showInUpdate: true,

    defaultValue: "",
  },
  {
    name: "dgAltInsClass",
    type: "string",
    display: "Alternator_Insulation Class",
    default: "",
    description: " ",
    required: true,
    group: 1,
    showInUpdate: true,

    defaultValue: "",
  },
]

export const GENERATOR_TABLE_HEADER: ITableHeader[] = [
  // Basic Information
  { name: "slNo", display: "S.No." },
  { name: "plantName", display: "Plant Name" },
  { name: "lineName", display: "Line Name" },
  { name: "generatorName", display: "Generator Name" },
  { name: "generatorIP", display: "Generator IP" },

  { name: "commPrtcl", display: "Communication Protocol" },

  { name: "commIdorSlaveId", display: "Slave ID/Comm. ID" },
  { name: "fuelType", display: "Fuel Type" },
  { name: "manufacturerName", display: "Manufacturer" },
  { name: "modelNumber", display: "Model Number" },
  { name: "serialNumber", display: "Serial Number" },
  { name: "manufactureYear", display: "Year of Manufacture" },

  // Engine Details
  { name: "dgEngModel", display: "Engine Model" },
  { name: "dgEngSrNo", display: "Engine Serial Number" },
  { name: "dgEngPwrOut", display: "Engine Power Output (kW/HP)" },
  { name: "dgRatedSpeed", display: "Rated Speed (RPM)" },
  { name: "dgFuelType", display: "Engine Fuel Type" },
  { name: "dgNoOfCyl", display: "Number of Cylinders" },
  { name: "dgDisplacement", display: "Displacement" },

  // Alternator Details
  { name: "dgAltModel", display: "Alternator Model" },
  { name: "dgAltSrNo", display: "Alternator Serial Number" },
  { name: "dgAltRatedPwrOut", display: "Rated Power Output (kVA)" },
  { name: "dgAltVolt", display: "Voltage (V)" },
  { name: "dgAltFreq", display: "Frequency (Hz)" },
  { name: "dgAltPwrFact", display: "Power Factor" },
  { name: "dgAltRatedCurr", display: "Rated Current (A)" },
  { name: "dgAltPhase", display: "Phase" },
  { name: "dgAltInsClass", display: "Insulation Class" },
  // Action Column
  { name: "action", display: "Action" },
]

export const generatorInfo: InfoCardProps = {
  title: "CAT C32 DIESEL GENERATOR",
  subtitle: undefined, // or e.g. "Generator Specs"
  columns: 2,
  items: [
    // left column (these will be split automatically)
    {
      label: "Generator IP",
      value: "192.168.1.101",
      href: "http://192.168.1.101",
    },
    { label: "Fuel", value: "Diesel" },
    {
      label: "Communication Protocol",
      value: "Modbus TCP/IP",
      href: "https://en.wikipedia.org/wiki/Modbus",
    },
    { label: "Slave ID / Comm. ID", value: "247" },
    { label: "Manufacturer Name", value: "Caterpillar" },
    { label: "Model Number", value: "C32" },
    { label: "Serial Number", value: "GECO00000" },

    // right column
    { label: "Year of Manufacture", value: 2023 },
    { label: "Engine Model", value: "Cat C32 ACERT" },
    { label: "Engine Serial Number", value: "TGE00000" },
    { label: "Alternator Model", value: "Caterpillar SR5" },
    { label: "Alternator Serial Number", value: "ASR00000" },
    { label: "Power Output", value: "720 kW to 1000 kW" },
    { label: "Voltage", value: "690 V, 11 kV" },
    { label: "Frequency", value: "50 Hz" },
  ],
}

export const utilityConfigs: Record<UtilityType, UtilityConfig> = {
  generator: {
    apiEndpoint: "/Generator/GetAllGeneratorDetails_Id?GeneratorId=",
    hubUrl: "GenLiveDataHub",
    pastDataMethod: "GetGenPastData",
    liveEvent: "ReceiveGeneratorLiveData",
    joinGroupMethod: "JoinGeneratorGroup",
    leaveGroupMethod: "LeaveGeneratorGroup",
    graphIdParam: "genId",
    detailedGraphByFilterId: "DetailedGeneratorGraphByFilter",
    infoFields: [
      { label: "Generator Name", key: "name" },
      { label: "Plant Affiliated", key: "plant" },
      { label: "Model No", key: "modelNo" },

      { label: "Last Updated", key: "lastUpdated" },
    ],
  },
  boiler: {
    apiEndpoint: "/Boilers/GetAllBoilerDetails_Id?BoilerId=",
    hubUrl: "BoilerLiveDataHub",
    pastDataMethod: "GetBoilerPastData",
    liveEvent: "ReceiveBoilerLiveData",
    joinGroupMethod: "JoinBoilerGroup",
    leaveGroupMethod: "LeaveBoilerGroup",
    graphIdParam: "boilerId",
    detailedGraphByFilterId: "DetailedBoilerGraphByFilter",
    infoFields: [
      { label: "Boiler Name", key: "name" },
      { label: "Plant Affiliated", key: "plant" },
      { label: "Model No", key: "modelNo" },

      { label: "Last Updated", key: "lastUpdated" },
    ],
  },
  chiller: {
    apiEndpoint: "/Chillers/GetAllChillerDetails_Id?ChillerId=",
    hubUrl: "ChillerLiveDataHub",
    pastDataMethod: "GetChillerPastData",
    liveEvent: "ReceiveChillerLiveData",
    joinGroupMethod: "JoinChillerGroup",
    leaveGroupMethod: "LeaveChillerGroup",
    graphIdParam: "chillerId",
    detailedGraphByFilterId: "DetailedChillerGraphByFilter",
    infoFields: [
      { label: "Chiller Name", key: "name" },
      { label: "Plant Affiliated", key: "plant" },
      { label: "Model No", key: "modelNo" },

      { label: "Last Updated", key: "lastUpdated" },
    ],
  },
  airComp: {
    apiEndpoint: "/AirCompressor/GetAllAirCompDetails_Id?AirCompId=",
    hubUrl: "AirCompLiveDataHub",
    pastDataMethod: "GetAirCompPastData",
    liveEvent: "ReceiveAirCompLiveData",
    joinGroupMethod: "JoinAirCompGroup",
    leaveGroupMethod: "LeaveAirCompGroup",
    graphIdParam: "aircompId",
    detailedGraphByFilterId: "DetailedAirCompGraphByFilter",
    infoFields: [
      { label: "Air Compressor Name", key: "name" },
      { label: "Plant Affiliated", key: "plant" },
      { label: "Model No", key: "modelNo" },

      { label: "Last Updated", key: "lastUpdated" },
    ],
  },
  // need to chnange here according to yogurt line
  line: {
    apiEndpoint: "/Line/GetAllLineDetails_Id?LineId=",
    hubUrl: "LineLiveDataHub",
    pastDataMethod: "GetLinePastData",
    liveEvent: "ReceiveLineLiveData",
    joinGroupMethod: "JoinLineGroup",
    leaveGroupMethod: "LeaveLineGroup",
    graphIdParam: "lineId",
    detailedGraphByFilterId: "DetailedLineGraphByFilter",
    infoFields: [
      { label: "Yogurt Line Name", key: "name" },
      { label: "Plant Affiliated", key: "plant" },
      // { label: "Model No", key: "modelNo" },

      { label: "Last Updated", key: "lastUpdated" },
    ],
  },
}

// GenMonitoring

export const getBarChartConfigs = (
  dataPoints: BarChartData[],
): BarChartConfig[] => {
  const ENERGY_THRESHOLD = 0.15
  const THD_I_THRESHOLD = 8
  const THD_V_THRESHOLD = 9

  return [
    {
      id: "energyProduced",
      title: "Total Energy Produced",
      yAxisLabelContext: "Avg Energy (kWh)",
      threshold: ENERGY_THRESHOLD,
      data: dataPoints,
      Key: "total_net_kWh_Export",
      timePeriod: "live",
      label: "",
    },
    {
      id: "Thd-I",
      title: "Current (THD-I)",
      yAxisLabelContext: "THD %",
      threshold: THD_I_THRESHOLD,
      data: dataPoints,
      Key: "thD_I",
      timePeriod: "live",
      label: "",
    },
    {
      id: "Thd-V",
      title: "Voltage (THD-V)",
      yAxisLabelContext: "THD %",
      threshold: THD_V_THRESHOLD,
      data: dataPoints,
      Key: "thD_V",
      timePeriod: "live",
      label: "",
    },
  ]
}
export const phaseWiseVoltageChartConfig: PhaseChartConfig = [
  {
    title: "Phase Wise Voltage",
    dataKeys: [
      { key: "v1", label: "V1-N", stroke: "#ffa500" },
      { key: "v2", label: "V2-N", stroke: "#00b300" },
      { key: "v3", label: "V3-N", stroke: "#8000ff" },
    ],
    // domain: [230, 240],
    yAxisLabel: "Phase Wise Voltage (V)",
    threshold: "phase",
    id: "phase",
  },
]
export const lineWiseVoltageChartConfig: LineChartConfig = [
  {
    title: "Line Wise Voltage",
    dataKeys: [
      { key: "v12", label: "V1-V2", stroke: "#ffa500" },
      { key: "v23", label: "V2-V3", stroke: "#00b300" },
      { key: "v31", label: "V3-V1", stroke: "#8000ff" },
    ],
    //domain: [210, 250],
    yAxisLabel: "Line Wise Voltage (V)",
    threshold: "line",
    id: "line",
  },
]

export const activePowerChartConfig: ActivePowerChartConfig = [
  {
    id: "activePower",
    title: "Active Power",
    dataKeys: [
      { key: "kW1", label: "kW1", stroke: "#ffa500" },
      { key: "kW2", label: "kW2", stroke: "#00b300" },
      { key: "kW3", label: "kW3", stroke: "#8000ff" },
    ],
    // domain: [210, 250],
    yAxisLabel: "Active Power(kW)",
    threshold: "active",
  },
]
export const reactivePowerChartConfig: ReactivePowerChartConfig = [
  {
    id: "reactive-power",
    title: "Reactive Power",
    dataKeys: [
      { key: "kVAr1", label: "kVAR1", stroke: "#ffa500" },
      { key: "kVAr2", label: "kVAR2", stroke: "#00b300" },
      { key: "kVAr3", label: "kVAR3", stroke: "#8000ff" },
    ],
    // domain: [210, 250],
    yAxisLabel: "Reactive Power(kVAR)",
    threshold: "reactive",
  },
]
export const apparentPowerChartConfig: ApparentPowerChartConfig = [
  {
    id: "apparent-power",
    title: "Apparent Power",
    dataKeys: [
      { key: "kVA1", label: "kVA1", stroke: "#ffa500" },
      { key: "kVA2", label: " kVA2", stroke: "#00b300" },
      { key: "kVA3", label: "kVA3", stroke: "#8000ff" },
    ],
    //  domain: [210, 250],
    yAxisLabel: "Apparent Power(kVA)",
    threshold: "apparent",
  },
]

export const kwhEnergyChartConfig: KwhEnergyChartConfig = [
  {
    id: "kwh-energy",
    title: "Energy Consumption (kWh) ",
    dataKeys: [
      { key: "kWh1", label: "kWh1", stroke: "#ffa500" },
      { key: "kWh2", label: "kWh2", stroke: "#00b300" },
      { key: "kWh3", label: "kWh3", stroke: "#8000ff" },
    ],
    // domain: [210, 250],
    yAxisLabel: "kWh",
    threshold: "kWh",
  },
]

export const kvarhEnergyChartConfig: KvarhEnergyChartConfig = [
  {
    id: "kvarh-energy",
    title: "Energy Consumption (kVArh)",
    dataKeys: [
      { key: "kvarh1", label: "kVARh1", stroke: "#ffa500" },
      { key: "kvarh2", label: "kVARh2", stroke: "#00b300" },
      { key: "kvarh3", label: "kVARh3", stroke: "#8000ff" },
    ],
    // domain: [210, 250],
    yAxisLabel: "kVArh",
    threshold: "kVArh",
  },
]

export const kvahEnergyChartConfig: KvahEnergyChartConfig = [
  {
    id: "kvah-energy",
    title: " Energy Consumption (kVAh)",
    dataKeys: [
      { key: "kVAh1", label: "kVAh1", stroke: "#ffa500" },
      { key: "kVAh2", label: " kVAh2", stroke: "#00b300" },
      { key: "kVAh3", label: "kVAh3", stroke: "#8000ff" },
    ],
    // domain: [210, 250],
    yAxisLabel: "kVAh",
    threshold: "kVAh",
  },
]

import { CurrentChartConfig } from "@/utils/types"

export const currentChartConfig: CurrentChartConfig = [
  {
    id: "current",
    title: "Current",
    dataKeys: [
      { key: "i1", label: "I1", stroke: "#ffa500" }, // orange
      { key: "i2", label: "I2", stroke: "#00b300" }, // greenS
      { key: "i3", label: "I3", stroke: "#8000ff" }, // violet
    ],
    // domain: [210, 250], // min & max on Y‑axisS
    yAxisLabel: "Current (A)",
    threshold: "current", // hook to your currentThresholds.phase
  },
]

export const frequencyChartConfig: FrequencyChartConfig = [
  {
    id: "frequency",
    title: "Frequency (HZ)",
    dataKeys: [
      { key: "frequency1", label: "Hz", stroke: "#0059ffff" }, // orange
    ],
    //domain: [210, 250], // min & max on Y‑axisS
    yAxisLabel: "Frequency (Hz)",
    threshold: "frequency", // hook to your currentThresholds.phase
  },
]

export const powerFactorChartConfig: PowerFactorChartConfig = [
  {
    id: "powerFactor",
    title: "Power Factor",
    dataKeys: [
      { key: "pF1", label: "pF1", stroke: "#ffa500" }, // orange
      { key: "pF2", label: "pF2", stroke: "#00b300" }, // greenS
      { key: "pF3", label: "pF3", stroke: "#8000ff" }, // violet
    ],
    // domain: [210, 250], // min & max on Y‑axis
    yAxisLabel: "Power Factor(PF)",
    threshold: "powerFactor", // hook to your currentThresholds.phase
  },
]

export const kwhEnergyThresholds: KwhEnergyThresholds = {
  kWh: {
    min: 220,
    max: 240,
  },
}
export const kVarhEnergyThresholds: KvarhEnergyThresholds = {
  kVArh: {
    min: 220,
    max: 240,
  },
}
export const kVahEnergyThresholds: KvahEnergyThresholds = {
  kVAh: {
    min: 220,
    max: 240,
  },
}

export const activePowerThresholds: ActivePowerThresholds = {
  active: {
    min: 220,
    max: 240,
  },
}
export const reactivePowerThresholds: ReactivePowerThresholds = {
  reactive: {
    min: 220,
    max: 240,
  },
}
export const apparentPowerThresholds: ApparentPowerThresholds = {
  apparent: {
    min: 220,
    max: 240,
  },
}

export const phaseWiseVoltageThresholds: PhaseWiseVoltageThresholds = {
  phase: {
    min: 220,
    max: 240,
  },
}

export const lineWiseVoltageThresholds: LineWiseVoltageThresholds = {
  line: {
    min: 220,
    max: 240,
  },
}

export const powerFactorThresholds: PowerFactorThresholds = {
  powerFactor: {
    min: 220,
    max: 240,
  },
}
export const frequencyThresholds: FrequencyThresholds = {
  frequency: {
    min: 220,
    max: 240,
  },
}

export const currentThresholds: CurrentThresholds = {
  current: {
    min: 220,
    max: 240,
  },
}

// for landing page dashoboard data

export const energyCostChartData: EnergyCostChartAPIResponse = {
  title: "Monthly Energy Consumption & Production cost",
  subtitle: "Yogurt Process Line",
  data: [
    { datetime: "2024-07-01", energyConsumption: 95, productionCost: 180 },
    { datetime: "2024-08-01", energyConsumption: 65, productionCost: 120 },
    { datetime: "2024-09-01", energyConsumption: 70, productionCost: 110 },
    { datetime: "2024-10-01", energyConsumption: 85, productionCost: 150 },
    { datetime: "2024-11-01", energyConsumption: 60, productionCost: 90 },
    { datetime: "2024-12-01", energyConsumption: 75, productionCost: 140 },
    { datetime: "2025-01-01", energyConsumption: 68, productionCost: 100 },
    { datetime: "2025-02-01", energyConsumption: 88, productionCost: 160 },
    { datetime: "2025-03-01", energyConsumption: 92, productionCost: 170 },
  ],
}

import { AverageEnergyChartAPIResponse } from "@/utils/types"

export const averageEnergyApiResponse: AverageEnergyChartAPIResponse = {
  title: "Average Energy Consumption By Equipment",
  subtitle: "Past Day",
  data: {
    Generator1: 53,
    Generator2: 30,
    Chiller1: 18,
    Boiler1: 25,
    AirCompressor1: 10,
    ProductionLine1: 22,
  },
}

import { ElectricityChartData } from "@/utils/types"

export const electricityChartData: ElectricityChartData[] = [
  {
    date: "2025-07-01",
    categories: [
      { generator1: 25 },
      { generator2: 30 },
      { boiler1: 40 },
      { chiller1: 20 },
      { productionLine1: 35 },
      { airCompressor1: 28 },
    ],
  },
  {
    date: "2025-07-02",
    categories: [
      { generator1: 28 },
      { generator2: 22 },
      { boiler1: 32 },
      { chiller1: 25 },
      { productionLine1: 38 },
      { airCompressor1: 30 },
    ],
  },
]

// ----------------------------------------
export const SAMPLE_TABLE_DATA: ISampleData[] = [
  {
    name: "Ankit Kumar",
    job: "UX Designer",
    color: "Blue",
  },
  {
    name: "Aaditya Singh",
    job: "Senior Full Stack Developer",
    color: "Green",
  },
  {
    name: "Prathmesh",
    job: "Senior DotNet Developer",
    color: "Yellow",
  },
  {
    name: "Shivendra Singh",
    job: "Software Developer",
    color: "RED",
  },
]
