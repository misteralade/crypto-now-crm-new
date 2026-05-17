import { useEffect, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { authServiceApi } from "../../api/auth.api";
import { ROUTES } from "../../util/constants.util.ts";
import type { FormEvent } from "react";
import type { AuthAPIResponse } from "../../types/response.payload.types";

export const useSignInPage = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { email: queryEmail, password: queryPassword } = useSearch({
    from: "/",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    pingAdminUser();
  }, []);

  useEffect(() => {
    if (queryEmail) setEmail(queryEmail);
    if (queryPassword) setPassword(queryPassword);
  }, [queryEmail, queryPassword]);

  const pingAdminUser = async () => {
    try {
      const { success } = await authServiceApi.pingAdmin();
      if (success) {
        navigate({ to: ROUTES.DASHBOARD });
      }
    } catch {
      // Not authenticated — stay on login page
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const { success, message }: AuthAPIResponse = await authServiceApi.login({
        email,
        password,
        keepLoggedIn,
      });

      if (!success) {
        setError(message || "Login failed. Please check your credentials.");
      } else {
        navigate({ to: ROUTES.DASHBOARD });
      }
    } catch (error: any) {
      setError(
        error.response.data.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // 🧩 Values
    error,
    email,
    password,
    showPassword,
    keepLoggedIn,
    isLoading,

    // ⚙️ Functions
    handleSubmit,
    setEmail,
    setPassword,
    setShowPassword,
    setKeepLoggedIn,
  };
};
