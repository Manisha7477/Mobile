import { IFormVariable } from "@/utils/types"
import { ErrorMessage, Field } from "formik"

interface IBooleanFieldProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const BooleanField: React.FunctionComponent<IBooleanFieldProps> = ({
  variable,
  displayLabel = true,
}) => {
  return (
    <div className="form-control" key={variable.name}>
      {displayLabel && (
        <label htmlFor={variable.name} className="w-full">
          {variable.display}
          {variable.required && (
            <span className="text-error text-left ml-1">*</span>
          )}
        </label>
      )}
      <div className="w-full">
        <Field
          type="checkbox"
          id={variable.name}
          name={variable.name}
          placeholder={variable.display}
          className="toggle toggle-primary"
        />

        <div className="text-error text-xs text-left">
          <ErrorMessage name={variable.name} />
        </div>

        <div className="text-sm text-faint mt-1">{variable.description}</div>
      </div>
    </div>
  )
}

export default BooleanField
