import React, { useState } from "react";
import { Button, Input, FormGroup, Label, VGrid } from "tombac";
import "./SignInPage.css";

const SignInPage: React.FC = () => {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Login:", login);
    console.log("Password:", password);
  };

  return (
    <div className="form-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <VGrid>
          <FormGroup>
            <Label htmlFor="login">Login</Label>
            <Input
              type="text"
              id="login"
              placeholder="Login"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
            />
          </FormGroup>
          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </FormGroup>
        </VGrid>
        <Button type="submit" className="Button">
          Sign in
        </Button>
      </form>
    </div>
  );
};

export default SignInPage;
