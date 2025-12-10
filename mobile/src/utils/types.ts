export type IAppConfig = {
  siteName: string
  logoPath: string
  imagePath: string
}

export type INavigationItem = {
  name: string
  href: string
  external?: boolean
}

export type IUserRole = "Admin" | "Manager" | "Engineer" | "Operator"
//

// src/types/CardInfoData.ts
export interface Material {
  id: string
  description: string
  orderedQty: number
  receivedQty: number
  unit: string
  returnable: string
  remarks?: string
  photo?: string
}

export interface Approver {
  id: string
  name: string
  username: string
  approver_id: string
  outward_id: number
  gate_pass_no: string
  date_time: string
  station: string
  issuing_authority: string
  department_contractor_name: string
  purpose: string
  address: string
  material_taken_by: string
  vehicle_no: string
  driver_phone: string
  initiator_name: string
  approver_name: string
  status: string
  created_by: string
  updated_by: string
  created_at: string
  updated_at: string
}

export interface GatePassForm {
  gatePassNo: string
  dateTime: string
  station: string
  poType: string
  poNumber: string
  receivedFrom: string
  supplierAddress: string
  referenceDoc: string
  purpose: string
  vehicleNo: string
  driverName: string
  driverPhone: string
  securityGuard: string
  approverId: string
}
export type ICardInfoData = {
  title: string
  value: string
  target?: string
}
export interface CardInfo {
  title: string
  value: string
  target: string
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string
    borderColor: string
    borderWidth: number
  }[]
}
// export interface IUser {
//   // email: any
//   userid: string
//   firstName: string
//   lastName: string
//   contactNumber: string
//   emailAddress: string
//   role: IUserRole // not provided
//   // roleId : number
//   employeeId: string
//   photoUrl?: string
//   token?: string
// }

export interface IUser {
  userId: number
  username: string
  emailAddress: string
  roleName: string
  accessToken: string
  accessTokenExpTime: string
  refreshToken: string
  refreshTokenExpTime: string
  statusCode?: string
  statusMessage?: string
  role: IUserRole
  menuSubMenuDetails?: {
    menuId: number
    menuName: string
    menuUrl: string
    menuIcon: string
    subMenus: {
      subMenuId: number
      subMenuName: string
      subMenuUrl: string
      subMenuIcon: string
    }[]
  }[]
}
export interface ISubMenu {
  subMenuId: number
  subMenuName: string
  subMenuURL: string
  subMenuIcon: string
}

export interface IMenu {
  menuId: number
  menuName: string
  menuURL: string
  menuIcon: string
  // accessRole: string[]
  accessRole: IUser["role"]
  subMenus: ISubMenu[]
}

export type ISampleData = {
  name: string
  job: string
  color: string
}

export type MenuItem = {
  title: string
  path: string
  submenu?: MenuItem[]
}

type IfieldType =
  | "string"
  | "number"
  | "select"
  | "selectcustom"
  | "selectone"
  | "bool"
  | "radio"
  | "string(textarea)"
  | "date"
  | "password"
  | "retypepassword"
  | "time"
  | "depended"
  | "supervisorDD"
  | "siteDD"
  | "array"
  | "managerDD"
  | "engineerDD"
  | "dependeddropdown"
  | "siteDD"
  | "areaDD"
  | "assetDD"
  | "lineDD"
  | "umCustomSelect"
  | "plantStatusDD"
  | "hidden"
  | "spacer"
  | "selectedgedevice"
;("blank")

export interface Equipment {
  [key: string]: any // This makes it fully generic
}
export interface GaugeChartProps {
  title: string
  value: number
  unit: string
  maxValue: number
  threshold?: { [key: string]: number }
  innerRadius?: number
  outerRadius?: number
}
export interface InfoItem {
  label: string
  value: string | number
  href?: string
}
export interface InfoCardProps {
  title: string
  subtitle?: string
  items: InfoItem[]
  columns?: number
  // status: "active" | "inactive"
  status?: string // Add status property to match usage in InfoCard
}
export type KpiCardType = {
  title: any
  kpivalue: any
  subtitle?: any //optional subtitle
}
export type TopThreeCardProps = {
  title: string
  data: {
    title: string
    value: string
  }[]
}

//----------BAR CHART DATA-----------------
// Akshat code

export interface EnergyCostDataItem {
  datetime: string
  energyConsumption: number
  productionCost: number
}

export interface EnergyCostChartAPIResponse {
  title: string
  subtitle?: string
  data: EnergyCostDataItem[]
}

// types/types.ts
export interface AverageEnergyChartAPIResponse {
  title: string
  subtitle?: string
  data: {
    [equipmentName: string]: number // e.g. { "Boiler1": 20, "Chiller2": 15 }
  }
}

export interface EnergyCostDataItem {
  datetime: string
  energyConsumption: number
  productionCost: number
}

export interface EnergyCostChartAPIResponse {
  title: string
  subtitle?: string
  data: EnergyCostDataItem[]
}

export interface EnergyCostChartAPIResponse {
  title: string
  subtitle?: string
  data: EnergyCostDataItem[]
}
// types/types.ts
export interface AverageEnergyChartAPIResponse {
  title: string
  subtitle?: string
  data: {
    [equipmentName: string]: number // e.g. { "Boiler1": 20, "Chiller2": 15 }
  }
}
export interface EquipmentCategory {
  [key: string]: number
}

export interface ElectricityChartData {
  date: string // ISO string or any parseable datetime
  categories: EquipmentCategory[]
}

export interface BarChartData {
  timestamp: string
  total_net_kWh_Export: number
  thD_I: number
  thD_V: number
}
export interface GenerateChartData {
  timestamp: string
  total_net_kWh_Export: number
  thD_I: number
  thD_V: number
  value: number
}
export type TimePeriod = "live" | "hourly" | "daily"

export type UtilityType =
  | "generator"
  | "boiler"
  | "chiller"
  | "airComp"
  | "line"

export interface UtilityConfig {
  apiEndpoint: string
  hubUrl: string
  pastDataMethod: string
  liveEvent: string
  joinGroupMethod: string
  leaveGroupMethod: string
  infoFields: { label: string; key: string }[]
  graphIdParam: string
  detailedGraphByFilterId: string
}
export interface UtilityDetailsPanelProps {
  chartConfigs: {
    dataKeys: { key: string; label: string; stroke: string }[]
  }[]
  utilityInfo: Record<string, any> // keep it flexible
  selectedTimePeriod: TimePeriod
  liveSummary: Record<string, number> | null
  pastSummary: Record<string, number> | null
  infoFields: { label: string; key: string }[] // NEW: flexible info fields
  unit?: string // e.g. "V", "°C", "kW"
}

export interface DetailsPanelProps {
  chartConfigs: BaseChartConfigItem[]
  generatorInfo: GeneratorInfo
  selectedTimePeriod: TimePeriod
  liveSummary?: Record<string, number>
  pastSummary?: Record<string, number>
}

export interface BarChartConfig {
  label: string
  id: string
  title: string
  yAxisLabelContext: string
  threshold: number
  data: BarChartData[]
  Key: keyof Omit<BarChartData, "timestamp">
  timePeriod: TimePeriod
  baseBarColor?: string
  aboveThresholdColor?: string
  thresholdLineColor?: string
}

//----------BAR CHART DATA-----------------

//////////////////////////////////===========Argha Code Start ======================/////////////////

export interface ChartDataKey {
  key: string
  label: string
  stroke: string
}

export interface BaseChartConfigItem {
  id: string
  title: string
  domain?: [number | "auto", number | "auto"]
  yAxisLabel?: string
  dataKeys: ChartDataKey[]
  threshold?: keyof ThresholdMap
}

type ThresholdRange = { min: number; max: number }
type ThresholdMap = Record<string, ThresholdRange>

export interface CommonProps {
  config: BaseChartConfigItem
  data: any[]
  thresholds?: ThresholdMap
  timePeriod: string
  defaultYAxisLabel?: string
  showFixedThresholdLines?: boolean // like 220 & 240 in your voltage charts
}

export type GeneratorInfo = {
  name: string
  plant: string
  modelNo: string
  gensetId: string
  lastUpdated: string
  alarmCount: number
}

export type PhaseWiseVoltageDataPoint = {
  timestamp: string
  v1?: number
  v2?: number
  v3?: number

  //  avg?: number
  [key: string]: number | string | undefined
}

export type LineWiseVoltageDataPoint = {
  timestamp: string
  v12?: number
  v23?: number
  v31?: number

  //avg?: number
  [key: string]: number | string | undefined
}

export type ActivePowerDataPoint = {
  timestamp: string
  kW1: number
  kW2: number
  kW3: number
  //avg: number
  [key: string]: number | string | undefined
}
export type ReactivePowerDataPoint = {
  timestamp: string

  kVAr1: number
  kVAr2: number
  kVAr3: number
  //avg: number
  [key: string]: number | string | undefined
}

export type ApparentPowerDataPoint = {
  timestamp: string

  kVA1: number
  kVA2: number
  kVA3: number
  //avg: number
  [key: string]: number | string | undefined
}

export type KwhEnergyDataPoint = {
  timestamp: string
  kWh1: number
  kWh2: number
  kWh3: number
  //  avg: number
  [key: string]: number | string | undefined
}

export type KvarhEnergyDataPoint = {
  timestamp: string
  kvarh1: number
  kvarh2: number
  kvarh3: number
  //  avg: number
  [key: string]: number | string | undefined
}

export type KvahEnergyDataPoint = {
  timestamp: string
  kVAh1: number
  kVAh2: number
  kVAh3: number
  //  avg: number
  [key: string]: number | string | undefined
}

export type PhaseChartConfig = PhaseWiseVoltageChartConfigItem[]
export type LineChartConfig = LineWiseVoltageChartConfigItem[]
export type ActivePowerChartConfig = ActivePowerChartConfigItem[]
export type ReactivePowerChartConfig = ReactivePowerChartConfigItem[]
export type ApparentPowerChartConfig = ApparentPowerChartConfigItem[]

export type KwhEnergyChartConfig = KwhEnergyChartConfigItem[]
export type KvarhEnergyChartConfig = KvarhEnergyChartConfigItem[]
export type KvahEnergyChartConfig = KvahEnergyChartConfigItem[]

export type PhaseWiseVoltageThresholds = {
  phase: { min: number; max: number }
}
export type LineWiseVoltageThresholds = {
  line: { min: number; max: number }
}

export type ActivePowerThresholds = {
  active: { min: number; max: number }
}
export type ReactivePowerThresholds = {
  reactive: { min: number; max: number }
}
export type ApparentPowerThresholds = {
  apparent: { min: number; max: number }
}
export type KwhEnergyThresholds = {
  kWh: { min: number; max: number }
}

export type KvarhEnergyThresholds = {
  kVArh: { min: number; max: number }
}
export type KvahEnergyThresholds = {
  kVAh: { min: number; max: number }
}

export type ThresholdDataPoint = {
  timestamp: string // or Date, depending on your use
  [key: string]: number | string | undefined
}

export interface PhaseWiseVoltageChartConfigItem extends BaseChartConfigItem {
  threshold: "phase"
}
export interface LineWiseVoltageChartConfigItem extends BaseChartConfigItem {
  threshold: "line"
}

export interface ActivePowerChartConfigItem extends BaseChartConfigItem {
  threshold: "active"
}
export interface ReactivePowerChartConfigItem extends BaseChartConfigItem {
  threshold: "reactive"
}

export interface ApparentPowerChartConfigItem extends BaseChartConfigItem {
  threshold: "apparent"
}

export interface KwhEnergyChartConfigItem extends BaseChartConfigItem {
  threshold: "kWh"
}
export interface KvarhEnergyChartConfigItem extends BaseChartConfigItem {
  threshold: "kVArh"
}
export interface KvahEnergyChartConfigItem extends BaseChartConfigItem {
  threshold: "kVAh"
}

export interface CurrentChartConfigItem extends BaseChartConfigItem {
  threshold: "current"
}

export interface FrequencyChartConfigItem extends BaseChartConfigItem {
  threshold: "frequency"
}
export interface PowerFactorChartConfigItem extends BaseChartConfigItem {
  threshold: "powerFactor"
}

export type PowerFactorThresholds = {
  powerFactor: { min: number; max: number }
}
export type FrequencyThresholds = {
  frequency: { min: number; max: number }
}
export type CurrentThresholds = {
  current: { min: number; max: number }
}

export type CurrentChartConfig = CurrentChartConfigItem[]
export type FrequencyChartConfig = FrequencyChartConfigItem[]
export type PowerFactorChartConfig = PowerFactorChartConfigItem[]

export type CurrentDataPoint = {
  timestamp: string
  i1: number
  i2: number
  i3: number
  // avg: number
  [key: string]: number | string | undefined
}

export type FrequencyDataPoint = {
  timestamp: string
  frequency1: number
  [key: string]: number | string | undefined
}
export type PowerFactorDataPoint = {
  timestamp: string
  pF1: number
  pF2: number
  pF3: number
  //avg: number
  [key: string]: number | string | undefined
}

export type IFormVariable = {
  name: string
  type: IfieldType
  display?: string
  description?: string
  options?: OptionType[]

  // options?: string[] | { label: string; value: string }[]

  default?: string | number | boolean | null
  required?: boolean
  group?: number
  API?: string
  showInUpdate?: boolean
  dependedField?: string
  engineerDrop?: string
  managerDrop?: string
  dependedDrop?: string
  bomIndex?: number
  triggers?: string[]
  dependsOn?: string
  value?:string
  className?:string
  onChange?: (value: any) => void
  items?: IFormVariable[]
  filterOptions?:
    | {
        [key: string]: string[]
      }
    | ((data: any[]) => any[])
  APIKey?: "plantDD" | "siteDD" | "employeeDD" | "Engineer_DD" | "Manager_DD"

  label?: string
  defaultValue?: string | number | boolean | null
  placeholder?: string
}
export type OptionType = string | { label: string; value: string } | any

export type ITableHeader = {
  name: string
  display: string
  visible?: boolean
}
export interface ITableRow {
  [key: string]: any
  moc_request_no?: string
  // moc_request_no?: string;
  status?: string
  title?: string
  station_name?: string
  created_by?: string
  date?: string
  action?: string
  mocClosure?: string
  hira_reviewer_id?: string | null
}

export type ITableData = ITableRow[]

// Define and export IUserData
export interface IUserData {
  slNo: number
  employeeId: string
  firstName: string
  lastName: string
  employeeName: string
  role: string
  email: string
  phoneNo: string
  createdBy: string
  modifiedBy: string
  ModifiedDate: string
  validFrom: string
  validTo: string
  accessToken: string
}
export interface IUserUpdateData {
  employeeId: string
  firstName: string
  lastName: string
  emailAddress: string
  validFrom: string
  role: string
  contactNumber: string
  validTo: string
}

export interface IMapUserData {
  slNo: number
  employeeId: string
  role: string
  underSupervisor: string
  underManager: string
}
