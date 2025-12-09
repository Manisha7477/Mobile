import { useState } from "react"
import { Field, ErrorMessage } from "formik"
import { GoEye, GoEyeClosed } from "react-icons/go"
import { IFormVariable } from "@/utils/types"

interface IPasswordFieldProps {
  variable: IFormVariable
  displayLabel?: boolean
}

const PasswordField: React.FC<IPasswordFieldProps> = ({
  variable,
  displayLabel,
}) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="form-control">
      {displayLabel && (
        <label htmlFor={variable.name} className="w-full">
          {variable.display}
          {variable.required && (
            <span className="text-error text-left ml-1">*</span>
          )}
        </label>
      )}

      <Field name={variable.name}>
        {({ field, meta }: any) => (
          <div
            className={`input input-sm input-bordered flex ${
              meta.touched && meta.error ? "border-red-500" : "border-gray-300"
            }`}
          >
            <input
              {...field}
              type={showPassword ? "text" : "password"}
              id={variable.name}
              placeholder={variable.description || variable.display}
              className="focus:border-transparent w-full"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="toggle-password "
            >
              {showPassword ? <GoEye /> : <GoEyeClosed />}
            </button>
          </div>
        )}
      </Field>

      <ErrorMessage
        name={variable.name}
        component="div"
        className="error-message text-red-500 text-[12px] "
      />
    </div>
  )
}

export default PasswordField
