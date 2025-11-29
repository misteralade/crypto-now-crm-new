import { X } from 'lucide-react';
import { Formik, Form } from 'formik';
import MFLabeledPillInput from '../../global/LabeledPillInput';
import MFLabeledPillSelect from '../../global/LabeledPillSelect';
import MFLabeledPillTextarea from '../../global/LabeledPillTextarea';
import { CreateTestimonialRequestSchema } from '../../../schemas/testimonial.schema';
import { zodToFormikValidation } from '../../../util/formik-validation.util';
import type { CreateTestimonialRequestType } from '../../../schemas/testimonial.schema';

interface TestimonialFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: Partial<CreateTestimonialRequestType>;
  onClose: () => void;
  onSubmit: (values: CreateTestimonialRequestType) => void;
}

const TestimonialFormModal = ({ 
  open, 
  mode, 
  initialValues, 
  onClose, 
  onSubmit 
}: TestimonialFormModalProps) => {
  if (!open) return null;

  const contentTypeOptions = [
    { value: 'VIDEO', label: 'Video' },
    { value: 'IMAGE', label: 'Image' },
    { value: 'TEXT', label: 'Text' },
  ];

  const defaultValues: CreateTestimonialRequestType = {
    contentLink: initialValues?.contentLink || '',
    name: initialValues?.name || undefined,
    description: initialValues?.description || undefined,
    contentType: initialValues?.contentType || 'VIDEO',
    isPublished: initialValues?.isPublished || false,
  };

  return (
    <section
      className="fixed inset-0 z-50 overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute py-[53px] inset-0 bg-black/20"
        onClick={onClose}
      />

      <div className="absolute inset-0 grid place-items-center">
        <div className="w-4xl bg-white rounded-2xl shadow-sm border px-4 py-4 border-[#ECECEC] max-h-[90vh] overflow-y-auto">
          <div className="px-6 pt-6 pb-2 flex items-start justify-between">
            <div className="flex-1 text-center text-[24px] leading-7 font-medium">
              {mode === 'create' ? 'Create Testimonial' : 'Edit Testimonial'}
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
            validate={zodToFormikValidation(CreateTestimonialRequestSchema)}
            onSubmit={(values) => {
              onSubmit(values);
            }}
            enableReinitialize
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <div className="px-6 space-y-[32px] mt-4">
                  {/* Content Link */}
                  <div>
                    <MFLabeledPillInput
                      label="Content Link *"
                      placeholder="https://example.com/content"
                      value={values.contentLink}
                      onChange={(e) => setFieldValue('contentLink', e.target.value)}
                      valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
                    />
                    {errors.contentLink && touched.contentLink && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.contentLink}</p>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <MFLabeledPillInput
                      label="Name (Optional)"
                      placeholder="e.g. John Doe"
                      value={values.name || ''}
                      onChange={(e) => setFieldValue('name', e.target.value || undefined)}
                      valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.name}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div>
                    <MFLabeledPillTextarea
                      label="Description (Optional)"
                      placeholder="Enter testimonial description..."
                      value={values.description || ''}
                      onChange={(e) => setFieldValue('description', e.target.value || undefined)}
                      valueClass="text-[18px] placeholder:text-[#9A9A9A] text-black"
                      rows={4}
                    />
                    {errors.description && touched.description && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.description}</p>
                    )}
                  </div>

                  {/* Content Type */}
                  <div>
                    <MFLabeledPillSelect
                      label="Content Type"
                      value={values.contentType}
                      onChange={(e) => setFieldValue('contentType', e.target.value)}
                      options={contentTypeOptions}
                    />
                    {errors.contentType && touched.contentType && (
                      <p className="text-red-500 text-sm mt-1 ml-4">{errors.contentType}</p>
                    )}
                  </div>

                  {/* Is Published */}
                  <div className="flex items-center gap-3">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        id="isPublished"
                        type="checkbox"
                        className="sr-only peer"
                        checked={values.isPublished}
                        onChange={(e) => setFieldValue('isPublished', e.target.checked)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-3 peer-focus:ring-gray-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#7c7c97] peer-checked:after:bg-[#03034D]"></div>
                    </label>
                    <span className="text-[16px] font-semibold text-[#454745]">Publish Testimonial</span>
                  </div>
                </div>

                <div className="px-6 pb-6 flex mt-6 md:mt-[50px] flex-col md:flex-row items-center justify-center gap-6">
                  <button
                    type="button"
                    className="text-[#03034D] hover:bg-[#FF8B5A] rounded-full hover:text-white px-10 py-3 text-base font-semibold w-full hover:cursor-pointer md:w-fit"
                    onClick={onClose}
                  >
                    Go back
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#03034D] hover:bg-[#FF8B5A] text-white px-10 py-3 text-base font-semibold w-full hover:cursor-pointer md:w-fit"
                  >
                    {mode === 'create' ? 'Create Testimonial' : 'Update Testimonial'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </section>
  );
};

export default TestimonialFormModal;

