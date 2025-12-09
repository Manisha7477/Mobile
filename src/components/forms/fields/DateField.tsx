import { IFormVariable } from "@/utils/types"
import { ErrorMessage, Field } from "formik"

interface IDateFieldProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const DateField: React.FunctionComponent<IDateFieldProps> = ({
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
          id={variable.name}
          name={variable.name}
          type="date"
          className="input input-sm input-bordered w-full"
        />
        <div className="text-error text-xs text-left">
          <ErrorMessage name={variable.name} />
        </div>

        <div className="text-sm text-faint mt-1">{variable.description}</div>
      </div>
    </div>
  )
}

export default DateField
