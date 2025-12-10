import { IFormVariable } from "@/utils/types"
import * as yup from "yup"
const _ = require("lodash")

const emailDisplayNames = [
  "Email",
  "User Email",
  "Contact Person Email",
  "Contact Email",
]
const contactNumberDisplayNames = [
  "Contact Number",
  "Phone Number",
  "Contact Phone",
  // "contPersNum",
  "Contact Person number",
  "Phone",
]

// Group variables by their 'group' property
export const groupFormVariable = (variableList: IFormVariable[]) => {
  return _.groupBy(variableList, "group")
}
// Set up initial values for Formik
export const initialFormikValues = (variableList: IFormVariable[]) => {
  let initialFormData = variableList.reduce((formatDefault, formVarsData) => {
    const defaultValue = formVarsData.default !== "" ? formVarsData.default : ""
    return { ...formatDefault, [formVarsData.name]: defaultValue }
  }, {})
  return initialFormData
}
// Build validation schema for a flat list
const buildSchemaFromVariables = (variables: IFormVariable[] = []) => {
  const validationObject: Record<string, any> = {}
  let formValidationData: { [key: string]: any } = {}

  variables.forEach((variable) => {
    // Skip if not required
    if (!variable.required) return
    const message = `A value for ${variable.display} is required`
    switch (variable.type) {
      case "string":
      case "string(textarea)":
        if (emailDisplayNames.includes(variable.display ?? "")) {
          validationObject[variable.name] = yup
            .string()
            .email("Invalid email format")
            .matches(
              /^[^@]+@[^@]+\.[^@]{2,}$/,
              "Email must be a valid email address",
            )
            .required(message)
        } else if (contactNumberDisplayNames.includes(variable.display ?? "")) {
          validationObject[variable.name] = yup
            .string()
            .matches(
              /^\d{10}$/,
              `${variable.display} must be a 10-digit number`,
            )
            .required(message)
        } else {
          validationObject[variable.name] = yup
            .string()
            .min(1, "Too Short!")
            .required(message)
        }
        break

      case "number":
        validationObject[variable.name] = yup
          .number()
          .min(1, "-ve values not allowed")
          .required(message)
        break
      case "select":
      case "selectcustom":
      case "selectone":
      case "radio":
      case "depended":
      case "supervisorDD":
      case "managerDD":
        validationObject[variable.name] = yup.string().required(message)
        break

      case "bool":
        validationObject[variable.name] = yup.boolean().required(message)
        break

      case "date":
        if (
          variable.display?.toLowerCase().includes("valid to") ||
          variable.name.toLowerCase().includes("end")
        ) {
          validationObject[variable.name] = yup
            .date()
            .required(message)
            .test(
              "endDateAfterStartDate",
              "Valid To date cannot be earlier than Valid From date",
              function (value) {
                // Support both "Valid From" and "startDate"
                const { validFrom, startDate } = this.parent
                const start = validFrom || startDate
                return !value || !start || value >= start
              },
            )
        } else {
          validationObject[variable.name] = yup.date().required(message)
        }
        break
      case "password":
        // Password validation
        validationObject[variable.name] = yup
          .string()
          .min(8, "Password is too short - should be 8 characters minimum.")
          .matches(
            /[!@#$%^&*(),.?":{}|<>]/,
            "Password must contain at least one special character.",
          )
          // .required(`A value for ${variable.display} is required`)
          .required(message)
        // Retype password field validation
        // validationObject[`${variable.name}_retype`] = yup
        //   .string()
        //   .oneOf(
        //     [yup.ref(variable.name)],
        //     `${variable.display} does not match the retyped password.`,
        //   )
        //   .required(`Please retype the ${variable.display}.`)
        break
      case "retypepassword":
        // Retype password field validation
        validationObject[`${variable.name}_retype`] = yup
          .string()
          .oneOf(
            [yup.ref(variable.name)],
            `${variable.display} does not match the retyped password.`,
          )
          .required(`Please retype the ${variable.display}.`)
        break
      case "time":
        validationObject[variable.name] = yup
          .string()
          .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format")
          .required(message)
        break
      case "array":
        validationObject[variable.name] = yup
          .array()
          .of(yup.string())
          .required(message)
        break
      default:
        validationObject[variable.name] = yup.string().required(message)
        break
    }
  })
  return yup.object().shape(validationObject)
}
// Unified schema for forms with both main and nested groups
export const formValidationSchema = (
  mainVariables: IFormVariable[],
  nestedGroups?: {
    key: string
    variables: IFormVariable[]
  }[],
) => {
  const schemaMap: Record<string, any> = {}
  schemaMap["__self"] = buildSchemaFromVariables(mainVariables)

  if (nestedGroups && nestedGroups.length > 0) {
    nestedGroups.forEach(({ key, variables }) => {
      schemaMap[key] = yup
        .array()
        .of(buildSchemaFromVariables(variables))
        .min(1, `At least one ${key} block is required`)
    })
  }
  const topSchemaFields = (schemaMap["__self"] as yup.ObjectSchema<any>).fields
  return yup.object().shape({
    ...topSchemaFields,
    ...(nestedGroups?.reduce((acc, group) => {
      acc[group.key] = schemaMap[group.key]
      return acc
    }, {} as Record<string, any>) || {}),
  })
}