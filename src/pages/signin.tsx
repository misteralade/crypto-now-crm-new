import {Fragment} from "react";
import AuthLayout from '../layout/AuthLayout'
import {useSignInPage} from "../hooks/pages/useSignInPage";
import CustomButton from "../components/global/Button";

const Signin = () => {
  const {
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
  } = useSignInPage();

  return (
    <Fragment>
      <AuthLayout layoutType={2}>
        {/* Form Header */}
        <div className="mb-10">
          <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-1 md:mb-2">
            Sign in
          </h1>
          <p className="md:text-[18px] text-base md:leading-[24px] text-[#454745] font-normal">
            Please login to continue to your account.
          </p>
        </div>

        {/* Form */}
        <p className="text-red-500 mb-2">{error}</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-[14px] font-medium text-[#374151] mb-2"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full h-[52px] px-4 py-3 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
              placeholder="jonas@gmail.com"
            />
          </div>

          {/* Password Field */}
          <div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[52px] px-4 py-3 pr-12 border-[1.5px] border-[#E5E7EB] rounded-[26px] focus:ring-2 focus:ring-[#3B82F6] focus:border-[#3B82F6] outline-none transition-all duration-200 text-[16px] placeholder-[#9CA3AF]"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280] transition-colors duration-200"
              >
                {showPassword ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="flex justify-end mt-3">
              <a
                href="/forgot-password"
                className="text-[14px] text-[#6B7280] hover:text-[#1E1B4B] underline transition-colors duration-200"
              >
                Forgot password?
              </a>
            </div>
          </div>

          {/* Keep me logged in checkbox */}
          <div className="flex items-center">
            <input
              id="keep-logged-in"
              name="keep-logged-in"
              type="checkbox"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
              className="h-4 w-4 text-[#3B82F6] focus:ring-[#3B82F6] border-[#D1D5DB] rounded"
            />
            <label
              htmlFor="keep-logged-in"
              className="ml-3 text-[14px] text-[#374151]"
            >
              Keep me logged in for 7 days
            </label>
          </div>

          {/* Sign In Button */}
          <div className="pt-2">
            <CustomButton
              type="submit"
              className="w-full cursor-pointer"
              buttonText={isLoading ? "Signing in..." : "Sign in"}
              disabled={isLoading}
            />
          </div>
        </form>
      </AuthLayout>
    </Fragment>
  )
}

export default Signin;
