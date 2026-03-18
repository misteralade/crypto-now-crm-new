import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import { PillInput } from '../../ui/input';
import { LabeledSelect } from '../../ui/select';
import { PillTextarea } from '../../ui/textarea';
import { Switch } from '../../ui/switch';
import { CreateTestimonialRequestSchema } from '../../../schemas/testimonial.schema';
import type { CreateTestimonialRequestType } from '../../../schemas/testimonial.schema';

interface TestimonialFormModalProps {
  open: boolean;
  mode: 'create' | 'edit';
  initialValues?: Partial<CreateTestimonialRequestType>;
  onClose: () => void;
  onSubmit: (values: CreateTestimonialRequestType) => void;
}

const contentTypeOptions = [
  { value: 'VIDEO', label: 'Video' },
  { value: 'IMAGE', label: 'Image' },
  { value: 'TEXT', label: 'Text' },
];

const TestimonialFormModal = ({ open, mode, initialValues, onClose, onSubmit }: TestimonialFormModalProps) => {
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

  if (!shouldRender) return null;

  const defaultValues: CreateTestimonialRequestType = {
    contentLink: initialValues?.contentLink || '',
    name: initialValues?.name || undefined,
    description: initialValues?.description || undefined,
    contentType: initialValues?.contentType || 'VIDEO',
    isPublished: initialValues?.isPublished || false,
  };

  return (
    <section className="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
      <div className={`absolute inset-0 bg-black/30 ${isClosing ? 'animate-modal-backdrop-out' : 'animate-modal-backdrop-in'}`} onClick={onClose} />

      <div className="absolute inset-0 grid place-items-center p-4">
        <div className={`w-full max-w-xl bg-white rounded-2xl shadow-xl border border-[#ECECEC] max-h-[90vh] overflow-y-auto ${isClosing ? 'animate-modal-content-out' : 'animate-modal-content-in'}`}>
          <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#ECECEC]">
            <h2 className="text-[18px] font-semibold text-[#0E0F0C]">
              {mode === 'create' ? 'Create Testimonial' : 'Edit Testimonial'}
            </h2>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#F5F5FF] transition-colors text-[#9A9A9A]">
              <X size={18} />
            </button>
          </div>

          <Formik
            initialValues={defaultValues}
            validationSchema={toFormikValidationSchema(CreateTestimonialRequestSchema as any)}
            onSubmit={(values) => onSubmit(values)}
            enableReinitialize
          >
            {({ values, setFieldValue, errors, touched }) => (
              <Form>
                <div className="px-6 py-5 space-y-5">
                  <div>
                    <PillInput
                      label="Content Link *"
                      placeholder="https://example.com/content"
                      value={values.contentLink}
                      onChange={(e) => setFieldValue('contentLink', e.target.value)}
                    />
                    {errors.contentLink && touched.contentLink && (
                      <p className="text-red-500 text-[12px] mt-1 ml-2">{errors.contentLink}</p>
                    )}
                  </div>

                  <div>
                    <PillInput
                      label="Name (Optional)"
                      placeholder="e.g. John Doe"
                      value={values.name || ''}
                      onChange={(e) => setFieldValue('name', e.target.value || undefined)}
                    />
                    {errors.name && touched.name && (
                      <p className="text-red-500 text-[12px] mt-1 ml-2">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <PillTextarea
                      label="Description (Optional)"
                      placeholder="Enter testimonial description..."
                      value={values.description || ''}
                      onChange={(e) => setFieldValue('description', e.target.value || undefined)}
                      rows={4}
                    />
                    {errors.description && touched.description && (
                      <p className="text-red-500 text-[12px] mt-1 ml-2">{errors.description}</p>
                    )}
                  </div>

                  <div>
                    <LabeledSelect
                      label="Content Type"
                      value={values.contentType}
                      onValueChange={(v) => setFieldValue('contentType', v)}
                      options={contentTypeOptions}
                    />
                    {errors.contentType && touched.contentType && (
                      <p className="text-red-500 text-[12px] mt-1 ml-2">{errors.contentType}</p>
                    )}
                  </div>

                  <Switch
                    id="isPublished"
                    label="Publish Testimonial"
                    checked={values.isPublished}
                    onCheckedChange={(checked) => setFieldValue('isPublished', checked)}
                  />
                </div>

                <div className="px-6 pb-6 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-[#ECECEC] pt-4">
                  <button
                    type="button"
                    className="text-[#03034D] font-medium text-[14px] px-6 py-2.5 rounded-full border border-[#ECECEC] hover:bg-[#F5F5FF] transition-colors w-full sm:w-auto"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#03034D] hover:bg-[#050568] active:scale-[0.98] text-white px-6 py-2.5 text-[14px] font-medium w-full sm:w-auto transition-all"
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
