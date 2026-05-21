import { Fragment, useState } from 'react'
import { Formik, Form } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { Link, useNavigate, useSearch } from '@tanstack/react-router'
import { Eye, EyeOff } from 'lucide-react'
import AuthLayout from '../layout/AuthLayout'
import CustomButton from '../components/global/Button'
import { authServiceApi } from '../api/auth.api'
import { ROUTES } from '../util/constants.util'
import { PasswordResetUpdateRequestSchema } from '../schemas/user.schema'
import type { PasswordResetUpdateRequestType } from '../schemas/user.schema'

import { PillInput } from '../components/ui/input'

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useSearch({ from: '/reset-password' }) as { token: string }
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const initialValues: PasswordResetUpdateRequestType = {
    token: token || '',
    password: '',
    confirmPassword: '',
  }

  const handleSubmit = async (values: PasswordResetUpdateRequestType) => {
    setError('')
    setSuccess('')

    try {
      const { success: apiSuccess, message } = await authServiceApi.confirmPasswordReset(values)

      if (apiSuccess) {
        setSuccess(message || 'Password reset successfully. Redirecting to sign in...')
        setTimeout(() => {
          navigate({ to: ROUTES.LOGIN })
        }, 2000)
      } else {
        setError(message || 'Failed to reset password. Please try again.')
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else if (err.errors && err.errors[0]) {
        setError(err.errors[0].message || 'Validation error')
      } else {
        setError('An error occurred. Please try again.')
      }
    }
  }

  if (!token) {
    return (
      <Fragment>
        <AuthLayout layoutType={2}>
          <div className="mb-10">
            <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-1 md:mb-2">
              Invalid Reset Link
            </h1>
            <p className="md:text-[18px] text-base md:leading-[24px] text-[#454745] font-normal mb-6">
              The password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              to={ROUTES.FORGOT_PASSWORD}
              className="text-[14px] text-[#6B7280] hover:text-[#1E1B4B] underline transition-colors duration-200"
            >
              Request New Reset Link
            </Link>
          </div>
        </AuthLayout>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <AuthLayout layoutType={2}>
        {/* Form Header */}
        <div className="mb-10">
          <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-1 md:mb-2">
            Reset Password
          </h1>
          <p className="md:text-[18px] text-base md:leading-[24px] text-[#454745] font-normal">
            Enter your new password below.
          </p>
        </div>

        {/* Form */}
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-sm">{success}</p>}

        <Formik
          initialValues={initialValues}
          validationSchema={toFormikValidationSchema(PasswordResetUpdateRequestSchema)}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, handleBlur, errors, touched, isSubmitting }) => (
            <Form className="space-y-6">
              {/* Password Field */}
              <PillInput
                label="New Password"
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter new password"
                disabled={isSubmitting}
                error={errors.password && touched.password ? errors.password : undefined}
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

              {/* Confirm Password Field */}
              <PillInput
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                value={values.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Confirm new password"
                disabled={isSubmitting}
                error={errors.confirmPassword && touched.confirmPassword ? errors.confirmPassword : undefined}
                iconRight={
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#9A9A9A] hover:text-[#03034D] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />

              {/* Submit Button */}
              <div className="pt-2">
                <CustomButton
                  type="submit"
                  className="w-full cursor-pointer"
                  buttonText={isSubmitting ? 'Resetting Password...' : 'Reset Password'}
                  disabled={isSubmitting}
                />
              </div>
            </Form>
          )}
        </Formik>

        {/* Back to Sign In Link */}
        <div className="mt-6 text-center">
          <Link
            to={ROUTES.LOGIN}
            className="text-[14px] text-[#6B7280] hover:text-[#1E1B4B] underline transition-colors duration-200"
          >
            Back to Sign In
          </Link>
        </div>
      </AuthLayout>
    </Fragment>
  )
}

export default ResetPassword

