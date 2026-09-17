import { useRef, useState } from "react";
import type React from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { ROUTES } from "../../util/constants.util.ts";
import {
  useResendTwoFactorCodeMutation,
  useVerifyTwoFactorCodeMutation,
} from "../../queries/auth.query.ts";

export const useVerifyTwoFactorPage = () => {
  const navigate = useNavigate();
  const { email } = useSearch({ from: "/verify-2fa" });

  const verifyCodeMutation = useVerifyTwoFactorCodeMutation();
  const resendCodeMutation = useResendTwoFactorCodeMutation();

  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleSubmit = async (code: string) => {
    setError("");
    try {
      const { success, message } = await verifyCodeMutation.mutateAsync(code);
      if (success) {
        navigate({ to: ROUTES.DASHBOARD });
      } else {
        setError(message || "Invalid verification code");
      }
    } catch (err: any) {
      setError(err.message || "Invalid verification code");
    }
  };

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newCode = [...verificationCode];
    newCode[index] = value.toUpperCase();
    setVerificationCode(newCode);

    if (value && index < verificationCode.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    const fullCode = newCode.join("");
    if (fullCode.length === verificationCode.length && index === verificationCode.length - 1) {
      handleSubmit(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim().toUpperCase().slice(0, 8);
    const newCode = [...verificationCode];

    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i];
    }

    setVerificationCode(newCode);

    const nextEmptyIndex = newCode.findIndex((code) => code === "");
    const focusIndex = nextEmptyIndex === -1 ? verificationCode.length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();

    if (pastedData.length === verificationCode.length) {
      handleSubmit(pastedData);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Email not found. Please sign in again.");
      return;
    }
    await resendCodeMutation.mutateAsync(email);
  };

  return {
    // Values
    email,
    error,
    verificationCode,
    inputRefs,
    verifyCodeMutation,
    resendCodeMutation,

    // Functions
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleResendCode,
  };
};
