import { X, Calendar } from 'lucide-react'
import { Formik, Form } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { useRef, useEffect, useState } from 'react'
import MFLabeledPillInput from '../../global/LabeledPillInput'
import { AdminUserProfileUpdateRequestSchema } from '../../../schemas/user.schema'
import type { AdminUserProfileUpdateRequestType } from '../../../schemas/user.schema'
import momentClient from '../../../util/moment'

interface EditUserModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (values: Omit<AdminUserProfileUpdateRequestType, 'id'>) => void
  initialValues?: {
    firstName?: string
    lastName?: string
    phoneNumber?: string | null
    dob?: Date | null
  }
  loading?: boolean
}

const EditUserModal = ({ 
  open, 
  onClose, 
  onSubmit,
  initialValues,
  loading = false
}: EditUserModalProps) => {
  const dobRef = useRef<HTMLInputElement>(null)
  const [isClosing, setIsClosing] = useState(false)
  const [shouldRender, setShouldRender] = useState(open)

  useEffect(() => {
    if (open) {
      setShouldRender(true)
      setIsClosing(false)
    } else if (shouldRender) {
      setIsClosing(true)
      const timer = setTimeout(() => {
        setShouldRender(false)
        setIsClosing(false)
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [open, shouldRender])

  if (!shouldRender) return null

  const defaultValues: Omit<AdminUserProfileUpdateRequestType, 'id'> = {
    firstName: initialValues?.firstName || '',
    lastName: initialValues?.lastName || '',
    phoneNumber: initialValues?.phoneNumber || '',
    dob: initialValues?.dob ? initialValues.dob.toISOString().split('T')[0] : '',
  }

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
      <div
        className={`absolute inset-0 bg-black/30 ${isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`}
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center">
        <div className={`w-full max-w-[464px] bg-white rounded-2xl shadow-sm border border-[#ECECEC] max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'}`}>
          <div className="px-6 pt-6 pb-2 flex items-start justify-between">
            <div className="flex-1 text-center text-2xl font-medium">
              Edit User
            </div>
            <button
              onClick={onClose}
              className="-mt-6 -mr-1 px-2 py-1 text-[#0E0F0C] cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          <Formik
            initialValues={defaultValues}
            validationSchema={toFormikValidationSchema(AdminUserProfileUpdateRequestSchema.omit({ id: true }) as any)}
            onSubmit={(values) => {
              // Transform the date string to ISO format if provided
              const payload: Omit<AdminUserProfileUpdateRequestType, 'id'> = {
                firstName: values.firstName || undefined,
                lastName: values.lastName || undefined,
                phoneNumber: values.phoneNumber || undefined,
                dob: values.dob ? momentClient.toISOStringFromDate(new Date(values.dob)) : undefined,
              }
              onSubmit(payload)
            }}
            enableReinitialize
          >
            {({ values, setFieldValue, errors, touched, isSubmitting }) => (
              <Form>
                <div className="px-6 pb-4 space-y-8 mt-8">
                  {/* First Name */}
                  <div>
                    <MFLabeledPillInput
                      label="First Name"
                      placeholder="e.g John"
                      value={values.firstName || ''}
                      onChange={(e) => setFieldValue('firstName', e.target.value)}
                      valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
                    />
                    {errors.firstName && touched.firstName && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.firstName as string}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <MFLabeledPillInput
                      label="Last Name"
                      placeholder="e.g Doe"
                      value={values.lastName || ''}
                      onChange={(e) => setFieldValue('lastName', e.target.value)}
                      valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
                    />
                    {errors.lastName && touched.lastName && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.lastName as string}</p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div>
                    <MFLabeledPillInput
                      label="Phone Number"
                      placeholder="e.g +1234567890"
                      value={values.phoneNumber || ''}
                      onChange={(e) => setFieldValue('phoneNumber', e.target.value || undefined)}
                      valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
                    />
                    {errors.phoneNumber && touched.phoneNumber && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.phoneNumber as string}</p>
                    )}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <fieldset className="rounded-full border-[1.5px] border-[#E4E7EC] px-[16px] py-[12px] transition-all duration-150 focus-within:border-[#948EEE] focus-within:shadow-[0_0_0_3px_rgba(211,212,248,0.5)]">
                      <legend className="px-3 font-medium text-[14px] leading-[24px] text-[#454745]">
                        Date of Birth
                      </legend>
                      <div className="relative">
                        {!values.dob && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-[#9A9A9A] text-sm pointer-events-none">
                            Select date
                          </span>
                        )}
                        <input
                          ref={dobRef}
                          type="date"
                          value={values.dob || ''}
                          onChange={(e) => setFieldValue('dob', e.target.value || undefined)}
                          className={`custom-date ${!values.dob ? 'empty' : ''} w-full border-0 text-sm text-[#101828] bg-transparent outline-none px-0 py-2 pr-12 focus:outline-none`}
                        />
                        <button
                          type="button"
                          aria-label="Open date picker"
                          onClick={() => {
                            if (dobRef.current?.showPicker) dobRef.current.showPicker()
                            else dobRef.current?.focus()
                          }}
                          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-gray-400"
                        >
                          <Calendar className="w-5 h-5" />
                        </button>
                      </div>
                    </fieldset>
                    {errors.dob && touched.dob && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.dob as string}</p>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 flex mt-12 flex-col md:flex-row items-center justify-center gap-6">
                  <button
                    type="button"
                    className="text-[#03034D] hover:bg-[#FF8B5A] rounded-full hover:text-white px-12 py-4 text-lg font-semibold w-full md:w-fit cursor-pointer transition-colors"
                    onClick={onClose}
                    disabled={loading || isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#03034D] text-white px-12 py-4 text-lg font-semibold w-full hover:bg-[#FF8B5A] hover:cursor-pointer md:w-fit transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={loading || isSubmitting}
                  >
                    {loading || isSubmitting ? 'Updating...' : 'Update User'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default EditUserModal;
