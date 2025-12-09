import { useNavigate } from "react-router-dom"
import { IFormVariable } from "@/utils/types"
import { Form, Formik, FormikValues } from "formik"
import HorizontalLabelFormField from "@/components/forms/HorizontalLabelFormField"
import * as yup from "yup"
// import AutoSiteField from "./AutoSiteField"
interface IHorizontalLabelFormProps {
  formVariables: IFormVariable[]
  initialDefaultValueData: FormikValues
  formValidationSchemaData: any
  handleCancelForm: Function
  handleSubmitForm: Function
  showSaveCancelButtons?: boolean // Add this prop
  enableReinitialize?: boolean
}

const HorizontalLabelForm: React.FunctionComponent<
  IHorizontalLabelFormProps
> = ({
  formVariables,
  initialDefaultValueData,
  formValidationSchemaData,
  handleCancelForm,
  handleSubmitForm,
  showSaveCancelButtons = true, // Default value is true
  enableReinitialize = false,
}) => {
    const navigate = useNavigate()

    const handleCancel = () => {
      handleCancelForm()
    }

    const handleSubmit = async (answerValues: FormikValues, actions: any) => {
      // Resetting errors before validation
      actions.setErrors({})
      actions.setSubmitting(true)

      try {
        // Validate the form using the validation schema
        await formValidationSchemaData.validate(answerValues, {
          abortEarly: false,
        })

        if (
          answerValues.ValidFrom &&
          answerValues.ValidTo &&
          new Date(answerValues.ValidFrom) > new Date(answerValues.ValidTo)
        ) {
          actions.setFieldError(
            "ValidTo",
            "Valid To should be greater than Valid From",
          )
          actions.setSubmitting(false)
          return
        }

        // If everything is valid, call the submit handler
        handleSubmitForm(answerValues, actions)
      } catch (validationErrors) {
        // Handle form validation errors
        if (validationErrors instanceof yup.ValidationError) {
          const errors = validationErrors.inner.reduce((acc: any, error: any) => {
            acc[error.path] = error.message
            return acc
          }, {})

          actions.setErrors(errors)
        }

        // Ensure submitting state is reset
        actions.setSubmitting(false)
      }
    }

    return (
      <div className="w-full">
        <Formik
          initialValues={initialDefaultValueData}
          validationSchema={formValidationSchemaData}
          onSubmit={(values, actions) => handleSubmit(values, actions)}
          validateOnMount
          enableReinitialize={enableReinitialize}   // <-- USE PROP
        >
          {({ isSubmitting, isValid }) => (
            // <Form autoComplete="on">
            //   <HorizontalLabelFormField formVariables={formVariables} />
            //   {showSaveCancelButtons && (
            //     <div className="mt-10 mb-4">
            //       <button
            //         type="submit"
            //         className="btn btn-sm btn-primary text-base-100"
            //         disabled={!isValid}
            //       >
            //         Save
            //       </button>
            //       <button
            //         type="button"
            //         className="btn btn-sm btn-primary ml-4 text-base-100"
            //         disabled={isSubmitting}
            //         onClick={handleCancel}
            //       >
            //         Cancel
            //       </button>
            //     </div>
            //   )}
            // </Form>
            <Form autoComplete="on">
              <HorizontalLabelFormField formVariables={formVariables} />
              {showSaveCancelButtons && (
                <div className="mt-2 mb-4 flex gap-4 justify-end">
                  <button
                    type="submit"
                    // className="btn btn-sm btn-primary text-base-100"
                    className={`px-3 py-2 text-sm flex items-center gap-1 border rounded transition
                  ${!isValid
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-primary hover:text-white"
                      }`}
                    disabled={!isValid}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="px-3 py-2 text-sm flex items-center gap-1 bg-blue-600 text-white rounded hover:bg-primary hover:text-white transition"
                    disabled={isSubmitting}
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </Form>
          )}
        </Formik>
      </div>
    )
  }

export default HorizontalLabelForm
