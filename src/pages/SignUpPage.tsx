import React, { useState } from "react";
import {
  Button,
  Input,
  FormGroup,
  Label,
  VGrid,
  tombac,
  Heading,
  useToasts,
} from "tombac";
import z from "zod";
import styled from "styled-components";
import { useRegister } from "../hooks/useRegister";
import { useNavigate } from "react-router-dom";

const schema = z
  .object({
    login: z.string().min(1, { message: "Login is required" }),
    email: z.string().email({ message: "Valid email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirmPassword: z.string().min(8, { message: "Confirm your password" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUpPage: React.FC = () => {
  const [login, setLogin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    login?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});
  const [formValid, setFormValid] = useState(false);

  const { loading, register } = useRegister();
  const { addToast } = useToasts();
  const navigate = useNavigate();

  const validateForm = (
    loginValue: string,
    emailValue: string,
    passwordValue: string,
    confirmPasswordValue: string
  ) => {
    const result = schema.safeParse({
      login: loginValue,
      email: emailValue,
      password: passwordValue,
      confirmPassword: confirmPasswordValue,
    });
    setFormValid(result.success);
  };

  const validateLogin = () => {
    const result = schema.shape.login.safeParse(login);
    if (!result.success) {
      setErrors((prev) => ({ ...prev, login: result.error.issues[0].message }));
    } else {
      setErrors((prev) => ({ ...prev, login: undefined }));
    }
    validateForm(login, email, password, confirmPassword);
  };

  const validateEmail = () => {
    const result = schema.shape.email.safeParse(email);
    if (!result.success) {
      setErrors((prev) => ({ ...prev, email: result.error.issues[0].message }));
    } else {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
    validateForm(login, email, password, confirmPassword);
  };

  const validatePassword = () => {
    const result = schema.shape.password.safeParse(password);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        password: result.error.issues[0].message,
      }));
    } else {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
    validateForm(login, email, password, confirmPassword);
  };

  const validateConfirmPassword = () => {
    const result = schema.shape.confirmPassword.safeParse(confirmPassword);
    if (!result.success) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: result.error.issues[0].message,
      }));
    } else if (password !== confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
    } else {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
    validateForm(login, email, password, confirmPassword);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    validateForm(login, email, password, confirmPassword);
    if (!formValid) return;
    try {
      await register(login, email, password);
      addToast("Registration successful!", "success");
      navigate("/sign-in");
    } catch (err: any) {
      addToast(err.message || "Registration failed", "danger");
    }
  };

  return (
    <Container>
      <Title level={1}>Register</Title>
      <form onSubmit={handleSubmit}>
        <VGrid>
          <FormGroupStyled>
            <LabelStyled htmlFor="login">Login:</LabelStyled>
            <InputStyled
              type="text"
              id="login"
              placeholder="Enter your login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              onBlur={validateLogin}
              invalid={!!errors.login}
            />
          </FormGroupStyled>
          <ErrorContainer>
            {errors.login && <ErrorText>{errors.login}</ErrorText>}
          </ErrorContainer>
          <FormGroupStyled>
            <LabelStyled htmlFor="email">Email:</LabelStyled>
            <InputStyled
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              invalid={!!errors.email}
            />
          </FormGroupStyled>
          <ErrorContainer>
            {errors.email && <ErrorText>{errors.email}</ErrorText>}
          </ErrorContainer>
          <FormGroupStyled>
            <LabelStyled htmlFor="password">Password:</LabelStyled>
            <InputStyled
              type="password"
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={validatePassword}
              invalid={!!errors.password}
            />
          </FormGroupStyled>
          <ErrorContainer>
            {errors.password && <ErrorText>{errors.password}</ErrorText>}
          </ErrorContainer>
          <FormGroupStyled>
            <LabelStyled htmlFor="confirmPassword">
              Confirm Password:
            </LabelStyled>
            <InputStyled
              type="password"
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onBlur={validateConfirmPassword}
              invalid={!!errors.confirmPassword}
            />
          </FormGroupStyled>
          <ErrorContainer>
            {errors.confirmPassword && (
              <ErrorText>{errors.confirmPassword}</ErrorText>
            )}
          </ErrorContainer>
        </VGrid>
        <ButtonContainer>
          <StyledButton type="submit" disabled={!formValid || loading}>
            {loading ? "Registering..." : "Register"}
          </StyledButton>
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

const Title = styled(Heading)`
  margin-bottom: ${tombac.space(5)};
`;

const FormGroupStyled = styled(FormGroup)`
  display: flex;
  flex-direction: column;
`;

const LabelStyled = styled(Label)`
  width: ${tombac.unit(100)};
  display: flex;
  align-items: center;
`;

const InputStyled = styled(Input)`
  width: ${tombac.unit(230)};
`;

const ErrorContainer = styled.div`
  height: 20px;
`;

const ErrorText = styled.div`
  font-size: ${tombac.unit(10)};
  color: ${tombac.color("danger", 500)};
  margin-left: ${tombac.space(14)};
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${tombac.space(4)};
`;

const StyledButton = styled(Button)`
  width: 50%;
  margin-top: ${tombac.space(2)};
  margin-left: auto;
  margin-right: auto;
`;

export default SignUpPage;
