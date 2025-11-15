import {useEffect, useState} from 'react'
import { useNavigate } from '@tanstack/react-router'
import { authServiceApi } from '../../api/auth.api'
import {LOCAL_STORAGE_KEYS, ROUTES} from '../../util/constants.util.ts'
import type { FormEvent } from 'react'
import type { AuthAPIResponse } from '../../types/response.payload.types'

export const useSignInPage = () => {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [keepLoggedIn, setKeepLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  useEffect(() => {
    pingAdminUser();
  }, []);
  
  const pingAdminUser = async () => {
    const { success } = await authServiceApi.pingAdmin();
    
    if (success) {
      navigate({ to: ROUTES.DASHBOARD })
    }
  }
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    if (!email || !password) {
      setError('Please fill in all fields')
      setIsLoading(false)
      return
    }

    try {
      const { success, message }: AuthAPIResponse = await authServiceApi.login({
        email,
        password,
        keepLoggedIn,
      })

      if (!success) {
        setError(message || 'Login failed. Please check your credentials.')
      } else {
        navigate({ to: ROUTES.DASHBOARD })
      }
    } catch (error: any) {
      setError(
        error.response.data.message ||
          'Login failed. Please check your credentials.',
      )
    } finally {
      setIsLoading(false)
    }
  }

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
  }
}
