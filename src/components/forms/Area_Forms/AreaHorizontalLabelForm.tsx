import { useNavigate } from "react-router-dom"
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikHelpers,
  FormikValues,
} from "formik"
import { FieldArrayRenderProps } from "formik"

// Assuming these imports are correct and available

import { IFormVariable } from "@/utils/types"
import HorizontalLabelFormField from "../HorizontalLabelFormField"

import { formValidationSchema, initialFormikValues } from "@/utils/forms"

// HorizontalLabelForm is imported but not directly used in this component's render logic,
// keeping it as it was in the original code snippet.

interface IAreaHorizontalLabelFormProps {
  formVariables: IFormVariable[]
  // initialDefaultValueData: {}
  // rmFormVariables: IFormVariable[]
  rmInitialDefaultValues: FormikValues
  formValidationSchemaData: any
  rmFormValidationSchemaData: any
  handleCancelForm: Function
  handleSubmitForm: Function
  showSaveCancelButtons?: boolean
}

const AreaHorizontalLabelForm: React.FunctionComponent<
  IAreaHorizontalLabelFormProps
> = ({
  formVariables,
  // initialDefaultValueData,
  formValidationSchemaData,
  rmFormValidationSchemaData,
  // rmFormVariables,
  rmInitialDefaultValues,
  handleCancelForm,
  handleSubmitForm,
}) => {
  const navigate = useNavigate()

  const handleCancel = () => {
    handleCancelForm()
  }

  const handleSubmit = (answerValues: FormikValues, actions: FormikValues) => {
    handleSubmitForm(answerValues, actions)
  }

  // Helper function to create an initial object for a new area block
  // This ensures each new block gets its own set of default values + isCollapsed state.
  const createNewAreaBlockInitialValues = () => {
    const defaultValues: FormikValues = {}
    formVariables.forEach((variable) => {
      defaultValues[variable.name] = variable.defaultValue || ""
    })
    // Add the collapse state for each new area block
    return { ...defaultValues, isCollapsed: false }
  }

  // Initialize Formik's initialValues
  const initialDVD = {
    // ...initialDefaultValueData,
    AreaLevelItem: Array.isArray(rmInitialDefaultValues)
      ? rmInitialDefaultValues.map((item: FormikValues) => ({
          ...item,
          isCollapsed: false, // Initialize existing items as not collapsed
        }))
      : [createNewAreaBlockInitialValues()], // Fallback if rmInitialDefaultValues isn't an array
  }

  return (
    <div className="w-full p-4 md:p-8 bg-gray-50 rounded-lg shadow-inner">
      <Formik
        initialValues={initialDVD}
        validationSchema={formValidationSchemaData}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions)
        }}
        validateOnMount
        enableReinitialize
      >
        {({ isSubmitting, values, setFieldValue }) => (
          <Form autoComplete="on">
            <div className="border border-gray-200 -mt-2 p-4 mb-3 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out">
              <HorizontalLabelFormField formVariables={formVariables} />
            </div>

            <FieldArray name="AreaLevelItem">
              {({ push, remove }: FieldArrayRenderProps) => (
                <>
                  {values.AreaLevelItem?.map(
                    (areaBlock: any, index: number) => {
                      const prefixedFormVariables: IFormVariable[] =
                        formVariables.map((variable) => ({
                          ...variable,
                          name: `AreaLevelItem.${index}.${variable.name}`,
                        }))

                      // Modified: Show only the first 2 variables (Area Name, Site) when collapsed
                      const displayedFormVariables = areaBlock.isCollapsed
                        ? prefixedFormVariables.slice(0, 2) // Show first 2 variables when collapsed (Area Name, Site)
                        : prefixedFormVariables // Show all when expanded

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 p-4 mb-4 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-lg text-gray-700">
                              Area Block {index + 1}
                            </h2>
                            <div className="flex space-x-2">
                              {/* Collapse/Expand Button */}
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue(
                                    `AreaLevelItem.${index}.isCollapsed`,
                                    !areaBlock.isCollapsed,
                                  )
                                }
                                className={`btn btn-sm ${
                                  areaBlock.isCollapsed
                                    ? "btn-outline btn-info"
                                    : "btn-outline btn-warning"
                                } text-sm font-medium px-4 py-2 rounded-md transition-colors duration-200 ease-in-out`}
                              >
                                {areaBlock.isCollapsed ? "Expand" : "Collapse"}
                              </button>
                              {/* Delete Button */}
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="btn btn-sm btn-error text-white text-sm font-medium px-4 py-2 rounded-md shadow-md hover:bg-red-700 transition-colors duration-200 ease-in-out"
                              >
                                Delete
                              </button>
                            </div>
                          </div>

                          {/* Render HorizontalLabelFormField with the dynamically selected variables */}
                          <HorizontalLabelFormField
                            formVariables={displayedFormVariables}
                          />
                        </div>
                      )
                    },
                  )}

                  <div className="w-full mt-2">
                    <button
                      type="button"
                      onClick={() => push(createNewAreaBlockInitialValues())}
                      className="btn btn-sm btn-primary text-base-100 "
                    >
                      Add Area
                    </button>
                  </div>
                </>
              )}
            </FieldArray>

            {/* Save/Cancel Buttons - Reverted to original styling and positioning */}
            <div className="mt-2 -mb-10">
              <button
                type="submit"
                className="btn btn-sm btn-primary text-base-100"
                disabled={isSubmitting}
              >
                Save
              </button>
              <button
                type="button"
                className="btn btn-sm btn-primary ml-4 text-base-100"
                disabled={isSubmitting}
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default AreaHorizontalLabelForm
