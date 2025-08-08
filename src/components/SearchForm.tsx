import { Button, Input, Select, Label, tombac } from "tombac";
import type { BudgetType, TravelMode } from "../types/api";
import { useState } from "react";
import styled from "styled-components";

function SearchForm({
  onAddPhrase,
  budgetOptions,
  travelModeOptions,
}: {
  onAddPhrase: (
    text: string,
    budget: number,
    budgetType: BudgetType,
    travelMode: TravelMode
  ) => void;
  budgetOptions: Array<{ value: BudgetType; label: string }>;
  travelModeOptions: Array<{ value: TravelMode; label: string }>;
}) {
  const [text, setText] = useState("");
  const [budget, setBudget] = useState<number>(0);
  const [budgetType, setBudgetType] = useState(budgetOptions[0]);
  const [travelMode, setTravelMode] = useState(travelModeOptions[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && budget > 0) {
      onAddPhrase(text.trim(), budget, budgetType.value, travelMode.value);
      setText("");
      setBudget(0);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FieldContainer>
        <StyledLabel>Searched phrase:</StyledLabel>
        <StyledInput
          type="text"
          placeholder="Enter search phrase (e.g. 'restaurant')"
          value={text}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setText(e.target.value)
          }
        />
      </FieldContainer>

      <FieldRow>
        <FieldContainer>
          <StyledLabel>Budget:</StyledLabel>
          <StyledInput
            type="number"
            placeholder="Budget"
            value={budget || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setBudget(Number(e.target.value))
            }
            min="0"
            step="0.1"
          />
        </FieldContainer>

        <FieldContainer>
          <StyledLabel>Budget type:</StyledLabel>
          <Select
            value={budgetType}
            options={budgetOptions}
            onChange={(selectedOption) => {
              if (selectedOption && !Array.isArray(selectedOption)) {
                setBudgetType(
                  selectedOption as { value: BudgetType; label: string }
                );
              }
            }}
            $width="100%"
          />
        </FieldContainer>
      </FieldRow>

      <FieldContainer>
        <StyledLabel>Travel mode:</StyledLabel>
        <Select
          value={travelMode}
          options={travelModeOptions}
          onChange={(selectedOption) => {
            if (selectedOption && !Array.isArray(selectedOption)) {
              setTravelMode(
                selectedOption as { value: TravelMode; label: string }
              );
            }
          }}
          $width="100%"
        />
      </FieldContainer>

      <StyledButton
        type="submit"
        variant="primary"
        disabled={!text.trim() || budget <= 0}
      >
        Add phrase
      </StyledButton>
    </FormContainer>
  );
}

export default SearchForm;

const FormContainer = styled.form<React.FormHTMLAttributes<HTMLFormElement>>`
  margin-top: ${tombac.unit(10)};
`;

const StyledLabel = styled(Label)`
  display: block;
  margin-bottom: ${tombac.unit(4)};
  font-size: ${tombac.unit(12)};
  font-weight: bold;
`;

const StyledButton = styled(Button)`
  margin-top: ${tombac.unit(8)};
  border-radius: ${tombac.unit(4)};
  width: 100%;
  font-size: ${tombac.unit(12)};
`;

const StyledInput = styled(Input)`
  width: 100%;
  padding: ${tombac.space(1)};
  border-color: ${tombac.color("neutral", 500)};
  border-radius: ${tombac.unit(4)};
  box-sizing: border-box;
  font-size: ${tombac.unit(12)};
`;

const FieldContainer = styled.div`
  margin-bottom: ${tombac.unit(12)};
`;

const FieldRow = styled.div`
  display: flex;
  gap: ${tombac.space(1)};
  margin-bottom: ${tombac.space(1)};

  ${FieldContainer} {
    flex: 1;
    margin-bottom: 0;
  }
`;
