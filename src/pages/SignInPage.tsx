import React, { useEffect, useState } from "react";
import { Button, VGrid, tombac, Heading, useToasts } from "tombac";
import styled from "styled-components";
import { useSignIn } from "../hooks/useSignIn";
import { useNavigate } from "react-router-dom";
import { useToken } from "../hooks/useToken";
import type { Credentials, Tokens } from "../types/signIn";
import { isSignInSchemaValid, getSignInErrors } from "../schemas/userSchemas";
import { FormTextFieldEntry } from "../components/FormTextFieldEntry";
import { FormPasswordFieldEntry } from "../components/FormPasswordFieldEntry";

const SignInPage = () => {
  const { signIn } = useSignIn();
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [, setTokens] = useToken();

  const [credentials, setCredentials] = useState<Credentials>({
    login: "",
    password: "",
  });
  const [formValid, setFormValid] = useState(false);
  const [errors, setErrors] = useState<{ login?: string; password?: string }>(
    {}
  );

  useEffect(() => {
    setFormValid(isSignInSchemaValid(credentials));
  }, [credentials]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const tokens: Tokens = await signIn(credentials);
      addToast("Sign in successful!", "success");
      setTokens(tokens.auth);
      navigate("/map");
    } catch (err: Error | unknown) {
      addToast((err as Error).message || "Sign in failed", "danger");
    }
  };

  return (
    <Container>
      <Heading level={1} $marginBottom="5sp">
        Sign in
      </Heading>
      <form onSubmit={handleSubmit}>
        <VGrid>
          <FormTextFieldEntry
            id="login"
            label="Login:"
            placeholder="Enter your login"
            value={credentials.login}
            onChange={(e) =>
              setCredentials({ ...credentials, login: e.target.value })
            }
            onBlur={() => {
              const { login } = getSignInErrors(credentials);
              setErrors((prev) => ({ ...prev, login }));
            }}
            error={errors.login}
          />

          <FormPasswordFieldEntry
            id="password"
            label="Password:"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
            onBlur={() => {
              const { password } = getSignInErrors(credentials);
              setErrors((prev) => ({ ...prev, password }));
            }}
            error={errors.password}
          />
        </VGrid>
        <ButtonContainer>
          <Button
            $margin={`2sp 0`}
            $width="30%"
            type="submit"
            disabled={!formValid}
          >
            Sign In
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

export default SignInPage;
