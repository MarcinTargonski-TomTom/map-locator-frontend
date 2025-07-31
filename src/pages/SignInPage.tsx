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
import { useSignIn, type Tokens } from "../hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import { useToken } from "../hooks/useToken";

const schema = z.object({
  login: z.string().min(1, { message: "Login is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long" }),
});

const SignInPage: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ login?: string; password?: string }>(
    {}
  );
  const [formValid, setFormValid] = useState(false);
  const { loading, signIn } = useSignIn();
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [, setTokens] = useToken();

  const validateForm = (loginValue: string, passwordValue: string) => {
    const result = schema.safeParse({
      login: loginValue,
      password: passwordValue,
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
    validateForm(login, password);
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
    validateForm(login, password);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const tokens: Tokens = await signIn(login, password);
      addToast("Sign in successful!", "success");
      setTokens(tokens);
      navigate("/map");
    } catch (err: any) {
      addToast(err.message || "Sign in failed", "danger");
    }
  };

  return (
    <Container>
      <Title level={1}>Sign in</Title>
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
        </VGrid>
        <ButtonContainer>
          <StyledButton type="submit" disabled={!formValid}>
            {loading ? "Signing in..." : "Sign in"}
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

export default SignInPage;
