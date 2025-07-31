import React, { useState, useEffect } from "react";
import { Button, VGrid, tombac, Heading, useToasts } from "tombac";
import styled from "styled-components";
import { useSignUp } from "../hooks/useSignUp";
import { useNavigate } from "react-router-dom";
import { getSignUpErrors, signUpSchema } from "../schemas/userSchemas";
import { FormTextFieldEntry } from "../components/FormTextFieldEntry";
import { FormPasswordFieldEntry } from "../components/FormPasswordFieldEntry";
import type { SignUpFormData } from "../types/signUp";

const SignUpPage = () => {
  const [fields, setFields] = useState<SignUpFormData>({
    login: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{
    login?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formValid, setFormValid] = useState(false);

  const { signUp } = useSignUp();
  const { addToast } = useToasts();
  const navigate = useNavigate();

  useEffect(() => {
    const result = signUpSchema.safeParse(fields);
    setFormValid(result.success);
  }, [fields]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { confirmPassword, ...payload } = fields;
    try {
      await signUp(payload);
      addToast("Registration successful!", "success");
      navigate("/sign-in");
    } catch (err: any) {
      addToast(err.message || "Registration failed", "danger");
    }
  };

  return (
    <Container>
      <Heading level={1} $marginBottom="5sp">
        Register
      </Heading>
      <form onSubmit={handleSubmit}>
        <VGrid>
          <FormTextFieldEntry
            id="login"
            label="Login:"
            placeholder="Enter your login"
            value={fields.login}
            onChange={(e) =>
              setFields((prev) => ({ ...prev, login: e.target.value }))
            }
            onBlur={() => {
              const { login } = getSignUpErrors(fields);
              setErrors((prev) => ({ ...prev, login }));
            }}
            error={errors.login}
          />

          <FormTextFieldEntry
            id="email"
            label="Email:"
            placeholder="Enter your email"
            value={fields.email}
            onChange={(e) =>
              setFields((prev) => ({ ...prev, email: e.target.value }))
            }
            onBlur={() => {
              const { email } = getSignUpErrors(fields);
              setErrors((prev) => ({ ...prev, email }));
            }}
            error={errors.email}
          />

          <FormPasswordFieldEntry
            id="password"
            label="Password:"
            placeholder="Enter your password"
            value={fields.password}
            onChange={(e) =>
              setFields((prev) => ({ ...prev, password: e.target.value }))
            }
            onBlur={() => {
              const { password } = getSignUpErrors(fields);
              setErrors((prev) => ({ ...prev, password }));
            }}
            error={errors.password}
          />

          <FormPasswordFieldEntry
            id="confirmPassword"
            label="Confirm Password:"
            placeholder="Confirm your password"
            value={fields.confirmPassword}
            onChange={(e) =>
              setFields((prev) => ({
                ...prev,
                confirmPassword: e.target.value,
              }))
            }
            onBlur={() => {
              const { confirmPassword } = getSignUpErrors(fields);
              setErrors((prev) => ({ ...prev, confirmPassword }));
            }}
            error={errors.confirmPassword}
          />
        </VGrid>
        <ButtonContainer>
          <Button
            $margin={`2sp 0`}
            $width="30%"
            type="submit"
            disabled={!formValid}
          >
            Sign Up
          </Button>
        </ButtonContainer>
      </form>
    </Container>
  );
};

const Container = styled.div`
  width: ${tombac.unit(600)};
  margin: auto;
  margin-top: ${tombac.space(30)};
  padding: ${tombac.parse("2sp 4sp")};
  border-radius: ${tombac.unit(4)};
  box-shadow: 0 ${tombac.unit(2)} ${tombac.unit(4)} rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 30vh;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${tombac.space(4)};
`;

export default SignUpPage;
