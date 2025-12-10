import { IFormVariable } from "@/utils/types"
import { Form, Formik, FormikValues } from "formik"
import LevelTopCreationFormField from "@/components/forms/LevelTopCreationFormField"

interface IManageUsersFilterFormProps {
  formVariables: IFormVariable[]
  initialDefaultValueData: FormikValues
  formValidationSchemaData: any
}

const ManageUsersFilterForm: React.FunctionComponent<
  IManageUsersFilterFormProps
> = ({ formVariables, initialDefaultValueData, formValidationSchemaData }) => {
  const handleSubmit = (answerValues: FormikValues, actions: FormikValues) => {
    // API call here on submit
    console.log(answerValues)
    setTimeout(() => {
      actions.setSubmitting(false)
    }, 1000)
  }

  return (
    <div className="w-full">
      <Formik
        initialValues={initialDefaultValueData}
        validationSchema={formValidationSchemaData}
        onSubmit={(values, actions) => {
          handleSubmit(values, actions)
        }}
        validateOnMount
      >
        {({ isSubmitting }) => (
          <Form autoComplete="on">
            <div className="w-full lg:flex lg:items-center mb-2">
              <div className="w-full">
                <LevelTopCreationFormField formVariables={formVariables} />
              </div>
              <div className="w-24 sm:text-right mr-64">
                <button
                  type="submit"
                  className="btn btn-sm btn-primary  text-base-100"
                  disabled={isSubmitting}
                >
                  Apply
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default ManageUsersFilterForm
