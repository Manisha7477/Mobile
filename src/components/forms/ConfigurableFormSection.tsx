import {
  Formik,
  Form,
  FieldArray,
  FieldArrayRenderProps,
  FormikValues,
} from "formik"
import HorizontalLabelFormField from "./HorizontalLabelFormField"

interface ConfigurableFormSectionProps {
  sectionName: string
  fieldName: string
  formVariables: any[]
  initialValues: FormikValues
  validationSchema: any
  collapsedItemCount: number
  buttonLabel: string
  handleSubmitForm: (values: FormikValues, actions: any) => void
  handleCancelForm: () => void
}

const ConfigurableFormSection: React.FC<ConfigurableFormSectionProps> = ({
  sectionName,
  fieldName,
  formVariables,
  initialValues,
  validationSchema,
  collapsedItemCount,
  buttonLabel,
  handleSubmitForm,
  handleCancelForm,
}) => {
  const createNewBlockInitialValues = () => {
    const defaultValues: FormikValues = {}
    formVariables.forEach((v) => (defaultValues[v.name] = v.defaultValue || ""))
    return { ...defaultValues, isCollapsed: false }
  }
  return (
    <div className="w-full p-4 md:p-8 bg-gray-50 rounded-lg shadow-inner">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmitForm}
        validateOnMount
        enableReinitialize
      >
        {({ values, setFieldValue, isSubmitting }) => (
          <Form autoComplete="on">
            <div className="border border-gray-200 -mt-2 p-4 mb-3 rounded-lg bg-white shadow-sm">
              {/* <HorizontalLabelFormField formVariables={formVariables} /> */}
              <HorizontalLabelFormField
                formVariables={formVariables.map((v) => ({
                  ...v,
                  name: v.name, // keep plain name since it's top-level
                }))}
              />
            </div>

            <FieldArray name={fieldName}>
              {({ push, remove }: FieldArrayRenderProps) => (
                <>
                  {/* {values[fieldName]?.map((block: any, index: number) => { */}
                  {(values[fieldName] || []).map(
                    (block: any, index: number) => {
                      const prefixedVars = formVariables.map((v) => ({
                        ...v,
                        name: `${fieldName}.${index}.${v.name}`,
                      }))
                      const visibleVars = block.isCollapsed
                        ? prefixedVars.slice(0, collapsedItemCount)
                        : prefixedVars

                      return (
                        <div
                          key={index}
                          className="border border-gray-200 p-4 mb-4 rounded-lg bg-white shadow-sm transition-all"
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-lg text-gray-700">
                              {sectionName} Block {index + 1}
                            </h2>
                            <div className="flex space-x-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFieldValue(
                                    `${fieldName}.${index}.isCollapsed`,
                                    !block.isCollapsed,
                                  )
                                }
                                className={`btn btn-sm ${
                                  block.isCollapsed
                                    ? "btn-outline btn-info"
                                    : "btn-outline btn-warning"
                                }`}
                              >
                                {block.isCollapsed ? "Expand" : "Collapse"}
                              </button>
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="btn btn-sm btn-error"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <HorizontalLabelFormField
                            formVariables={visibleVars}
                          />
                        </div>
                      )
                    },
                  )}

                  <div className="w-full mt-2 mb-10 flex justify-between ">
                    <button
                      type="button"
                      onClick={() => push(createNewBlockInitialValues())}
                      className="px-3 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
                    >
                      {buttonLabel}
                    </button>
                    <div className="flex gap-4">
                      <button
                        type="submit"
                        className="px-3 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
                        disabled={isSubmitting}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        className="px-3 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition"
                        disabled={isSubmitting}
                        onClick={handleCancelForm}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </FieldArray>

            {/* <div className="mt-2 mb-10 flex gap-4">
              <button
                type="submit"
                className="px-3 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition "
                disabled={isSubmitting}
              >
                Save
              </button>
              <button
                type="button"
                className="px-3 py-2 text-sm flex items-center gap-1 border border-primary text-primary rounded hover:bg-primary hover:text-white transition "
                disabled={isSubmitting}
                onClick={handleCancelForm}
              >
                Cancel
              </button>
            </div> */}
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ConfigurableFormSection
