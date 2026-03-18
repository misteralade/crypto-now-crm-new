import { Fragment } from "react";
import { Link } from '@tanstack/react-router'
import AuthLayout from '../layout/AuthLayout'
import { useSignInPage } from "../hooks/pages/useSignInPage";
import CustomButton from "../components/global/Button";
import { ROUTES } from '../util/constants.util'
import { PillInput } from '../components/ui/input'
import { Switch } from '../components/ui/switch'
import { Eye, EyeOff } from 'lucide-react'

const Signin = () => {
  const {
    error,
    email,
    password,
    showPassword,
    keepLoggedIn,
    isLoading,
    handleSubmit,
    setEmail,
    setPassword,
    setShowPassword,
    setKeepLoggedIn,
  } = useSignInPage();

  return (
    <Fragment>
      <AuthLayout layoutType={2}>
        <div className="mb-10">
          <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-1 md:mb-2">
            Sign in
          </h1>
          <p className="md:text-[18px] text-base text-[#454745] font-normal">
            Please login to continue to your account.
          </p>
        </div>

        {error && (
          <div className="mb-5 px-4 py-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] text-[#EB5757] text-[14px] font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <PillInput
            label="Email address"
            id="email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@cryptonow.io"
            autoComplete="email"
          />

          <PillInput
            label="Password"
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            iconRight={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#9A9A9A] hover:text-[#03034D] transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            }
          />

          <div className="flex justify-end -mt-2">
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-[13px] text-[#948EEE] hover:text-[#03034D] font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Switch
            id="keep-logged-in"
            label="Keep me logged in for 7 days"
            checked={keepLoggedIn}
            onCheckedChange={(checked) => setKeepLoggedIn(checked)}
          />

          <div className="pt-2">
            <CustomButton
              type="submit"
              className="w-full py-4 text-[16px]"
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
