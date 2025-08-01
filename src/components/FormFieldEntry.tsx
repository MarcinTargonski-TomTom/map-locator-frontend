import React from "react";
import { Input, FormGroup, Label, Box, tombac } from "tombac";
import styled from "styled-components";

type FormFieldEntryProps = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  errorHeightInPixels?: number;
};

export const FormFieldEntry = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  errorHeightInPixels = 20,
}: FormFieldEntryProps) => (
  <>
    <FormGroupStyled>
      <LabelStyled htmlFor={id}>{label}</LabelStyled>
      <Input
        $width="230px"
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        invalid={!!error}
      />
    </FormGroupStyled>
    <Box $height={`${errorHeightInPixels}px`}>
      {error && <ErrorText>{error}</ErrorText>}
    </Box>
  </>
);

const FormGroupStyled = styled(FormGroup)`
  display: flex;
  flex-direction: column;
`;

const LabelStyled = styled(Label)`
  width: ${tombac.unit(100)};
  display: flex;
  align-items: center;
`;

const ErrorText = styled.div`
  font-size: ${tombac.unit(10)};
  color: ${tombac.color("danger", 500)};
  margin-left: ${tombac.space(14)};
`;
