import { Fragment, useState, FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import AuthLayout from '../layout/AuthLayout'
import CustomButton from '../components/global/Button'
import { authServiceApi } from '../api/auth.api'
import { ROUTES } from '../util/constants.util'
import { EmailSchema } from '../schemas/common.schema'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setIsLoading(true)

    try {
      // Validate email
      const validatedEmail = EmailSchema.parse(email)
      
      const { success: apiSuccess, message } = await authServiceApi.requestPasswordReset(validatedEmail)

      if (apiSuccess) {
        setSuccess(message || 'Password reset email sent successfully. Please check your inbox.')
        setEmail('')
        // Optionally redirect after a delay
        setTimeout(() => {
          navigate({ to: ROUTES.LOGIN })
        }, 3000)
      } else {
        setError(message || 'Failed to send password reset email. Please try again.')
      }
    } catch (err: any) {
      if (err.errors && err.errors[0]) {
        setError(err.errors[0].message || 'Invalid email address')
      } else if (err.response?.data?.message) {
        setError(err.response.data.message)
      } else {
        setError('An error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Fragment>
      <AuthLayout layoutType={2}>
        {/* Form Header */}
        <div className="mb-10">
          <h1 className="md:text-[40px] text-3xl md:leading-[48px] font-semibold text-[#0E0F0C] mb-1 md:mb-2">
            Forgot Password
          </h1>
          <p className="md:text-[18px] text-base md:leading-[24px] text-[#454745] font-normal">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {/* Form */}
        {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-sm">{success}</p>}
        
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
              disabled={isLoading}
              autoFocus
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <CustomButton
              type="submit"
              className="w-full cursor-pointer"
              buttonText={isLoading ? "Sending..." : "Send Reset Link"}
              disabled={isLoading}
            />
          </div>
        </form>

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

export default ForgotPassword

