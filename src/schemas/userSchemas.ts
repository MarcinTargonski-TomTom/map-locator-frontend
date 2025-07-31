import z from "zod";
import type { Credentials } from "../types/signIn";
import type { SignUpFormData } from "../types/signUp";

const loginField = z.string().min(1, { message: "Login is required" });
const passwordField = z
  .string()
  .min(8, { message: "Password must be at least 8 characters long" });

export const signInSchema = z.object({
  login: loginField,
  password: passwordField,
});

export const signUpSchema = z
  .object({
    login: loginField,
    email: z.string().email({ message: "Valid email is required" }),
    password: passwordField,
    confirmPassword: passwordField,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function getSignInErrors(credentials: Credentials) {
  const result = signInSchema.safeParse(credentials);
  const errors: { login?: string; password?: string } = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (field === "login" || field === "password") {
        errors[field] = issue.message;
      }
    });
  }
  return errors;
}

export function getSignUpErrors(fields: SignUpFormData) {
  const result = signUpSchema.safeParse(fields);
  const errors: {
    login?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  } = {};
  if (!result.success) {
    result.error.issues.forEach((issue) => {
      const field = issue.path[0];
      if (
        field === "login" ||
        field === "password" ||
        field === "email" ||
        field === "confirmPassword"
      ) {
        errors[field] = issue.message;
      }
    });
  }
  return errors;
}

export function isSignInSchemaValid(credentials: Credentials) {
  return signInSchema.safeParse(credentials).success;
}
