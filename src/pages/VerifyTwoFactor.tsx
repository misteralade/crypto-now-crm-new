import { Fragment } from "react";
import { Link } from "@tanstack/react-router";
import AuthLayout from "../layout/AuthLayout";
import { ROUTES } from "../util/constants.util";
import { useVerifyTwoFactorPage } from "../hooks/pages/useVerifyTwoFactorPage";

const VerifyTwoFactor = () => {
  const {
    error,
    verificationCode,
    inputRefs,
    verifyCodeMutation,
    resendCodeMutation,
    handleCodeChange,
    handleKeyDown,
    handlePaste,
    handleResendCode,
  } = useVerifyTwoFactorPage();

  return (
    <Fragment>
      <AuthLayout layoutType={2}>
        <div className="mb-10">
          <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-1 md:mb-2">
            Two-Factor Verification
          </h1>
          <p className="md:text-[18px] text-base text-[#454745] font-normal">
            Enter the verification code sent to your email address.
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#EB5757] text-[14px] font-medium">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <label className="block text-sm font-medium text-[#454745]">
            Verification code
          </label>
          <div className="flex gap-2 items-center justify-between md:gap-3">
            {verificationCode.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleCodeChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={verifyCodeMutation.isPending}
                className="w-10 h-12 md:w-12 md:h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#03034D] focus:ring-2 focus:ring-[#03034D]/20 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            ))}
          </div>
        </div>

        {verifyCodeMutation.isPending && (
          <div className="flex items-center justify-center gap-2 text-[#454745] mt-6">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Verifying...</span>
          </div>
        )}

        <div className="text-center mt-6">
          <button
            type="button"
            className="text-sm text-[#948EEE] hover:text-[#03034D] font-medium transition-colors cursor-pointer disabled:opacity-50"
            onClick={handleResendCode}
            disabled={resendCodeMutation.isPending}
          >
            Resend code
          </button>
        </div>

        <div className="mt-4 text-center">
          <Link
            to={ROUTES.LOGIN}
            className="text-[14px] text-[#6B7280] hover:text-[#1E1B4B] underline transition-colors duration-200"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    </Fragment>
  );
};

export default VerifyTwoFactor;
