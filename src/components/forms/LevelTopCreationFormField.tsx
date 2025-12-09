import { IFormVariable } from "@/utils/types"
import { groupFormVariable } from "@/utils/forms"

import StringField from "@/components/forms/fields/StringField"
import NumberField from "@/components/forms/fields/NumberField"
import SelectField from "@/components/forms/fields/SelectField"
import BooleanField from "@/components/forms/fields/BooleanField"
import RadioField from "@/components/forms/fields/RadioField"
import TextareaField from "@/components/forms/fields/TextareaField"
import DateField from "@/components/forms/fields/DateField"
import SelectOneField from "./fields/SelectOneField"

interface ILevelTopCreationFormFieldProps {
  formVariables: IFormVariable[]
}

const LevelTopCreationFormField: React.FunctionComponent<
  ILevelTopCreationFormFieldProps
> = ({ formVariables }) => {
  const formatFormVars = groupFormVariable(formVariables)

  const renderFields = (variable: IFormVariable) => {
    switch (variable.type) {
      case "string":
        return <StringField variable={variable} />
      case "string(textarea)":
        return <TextareaField variable={variable} />
      case "number":
        return <NumberField variable={variable} />
      case "select":
        return <SelectField variable={variable} />
      case "selectone":
        return <SelectOneField variable={variable} />
      case "bool":
        return <BooleanField variable={variable} />
      case "radio":
        return <RadioField variable={variable} />
      case "date":
        return <DateField variable={variable} />

      default:
        return <StringField variable={variable} displayLabel={false} />
    }
  }

  return (
    <div className="w-full">
      {Object.keys(formatFormVars).map((groupFormKey) => {
        return (
          <div
            className="grid sm:grid-cols-1 lg:grid-cols-4 gap-4 w-[50vw]"
            key={groupFormKey}
          >
            {formatFormVars[groupFormKey].map((variable: IFormVariable) => (
              <div className="w-full relative" key={variable.name}>
                <div className="w-full">{renderFields(variable)}</div>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

export default LevelTopCreationFormField
