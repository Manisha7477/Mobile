import { ErrorMessage, Field, useFormikContext } from "formik";
import { useEffect, useState } from "react";
import api from "@/api/axiosInstance";
import { IFormVariable } from "@/utils/types";

interface ISelectFieldProps {
  variable: IFormVariable;
  displayLabel?: boolean;

  value?: string;
  onChange?: (value: string) => void;
}

const SelectField: React.FC<ISelectFieldProps> = ({
  variable,
  displayLabel = true,
  value,
  onChange,
}) => {
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);

  // Detect Formik mode
  let formik: any = null;
  try {
    formik = useFormikContext();
  } catch {}

  const isFormikMode =
    !!formik && value === undefined && onChange === undefined;

  // ---------------------------------------------
  // NORMALIZER → converts ALL data to {label,value}
  // ---------------------------------------------
  const normalize = (list: any[]) => {
    return list.map((item) => {
      if (typeof item === "string") {
        return { label: item, value: item };
      }

      return {
        label: item.label ?? item.name ?? String(item.value ?? item.id),
        value: String(item.value ?? item.id ?? item.name),
      };
    });
  };

  // ---------------------------------------------
  // LOAD OPTIONS (API or static)
  // ---------------------------------------------
  useEffect(() => {
    const load = async () => {
      // static options
      if (!variable.API) {
        const finalData = normalize(variable.options || []);
        setOptions(finalData);
        return;
      }

      // API mode
      try {
        const result = await api.get(variable.API);
        const finalData = normalize(result?.data || []);
        setOptions(finalData);
      } catch (err) {
        console.error("SelectField API Error", err);
      }
    };

    load();
  }, [variable.API, variable.options]);

  // ---------------------------------------------
  // RENDER OPTIONS (never raw objects)
  // ---------------------------------------------
  const renderOptions = () =>
    options.map((opt, i) => (
      <option key={i} value={opt.value}>
        {opt.label}
      </option>
    ));

  // ---------------------------------------------
  // STANDALONE MODE
  // ---------------------------------------------
  if (!isFormikMode) {
    return (
      <div className="form-control">
        {displayLabel && (
          <label className="w-full">
            {variable.display}
            {variable.required && <span className="text-error ml-1">*</span>}
          </label>
        )}

        <select
          className="select select-sm select-bordered w-full"
          value={value ?? ""}
          onChange={(e) => onChange?.(e.target.value)}
        >
          <option value="">Select</option>
          {renderOptions()}
        </select>
      </div>
    );
  }

  // ---------------------------------------------
  // FORMIK MODE
  // ---------------------------------------------
  return (
    <div className="form-control">
      {displayLabel && (
        <label className="w-full">
          {variable.display}
          {variable.required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      <Field as="select" name={variable.name} className="select select-sm select-bordered w-full">
        <option value="">Select</option>
        {renderOptions()}
      </Field>

      <ErrorMessage
        name={variable.name}
        component="div"
        className="text-error text-xs"
      />
    </div>
  );
};

export default SelectField;
