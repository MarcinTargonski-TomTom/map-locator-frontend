import React from "react";
import { Input, FormGroup, Label, Box } from "tombac";
import styled from "styled-components";
import { FormFieldEntry } from "./FormFieldEntry";

type FormTextFieldEntryProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  errorHeightInPixels?: number;
};

export const FormTextFieldEntry = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  errorHeightInPixels = 20,
}: FormTextFieldEntryProps) => (
  <FormFieldEntry
    id={id}
    label={label}
    type="text"
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    error={error}
    errorHeightInPixels={errorHeightInPixels}
  />
);
