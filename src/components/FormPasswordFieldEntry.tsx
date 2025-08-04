import React from "react";
import { FormFieldEntry } from "./FormFieldEntry";

type FormPasswordFieldEntryProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  errorHeightInPixels?: number;
};

export const FormPasswordFieldEntry = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  errorHeightInPixels = 20,
}: FormPasswordFieldEntryProps) => (
  <FormFieldEntry
    id={id}
    label={label}
    type="password"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    error={error}
    errorHeightInPixels={errorHeightInPixels}
  />
);
