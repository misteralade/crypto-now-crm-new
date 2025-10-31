import { Fragment, useState } from 'react'
import { Upload, X } from 'lucide-react'
import type { UseMutationResult } from '@tanstack/react-query'

interface UploadCoinIconProps {
  oldImgUrl?: string;
  onChangeInputField: (
    field: any,
    value: any,
  ) => void
  uploadCryptoLogoIcon: UseMutationResult<
    string | undefined,
    Error,
    FormData,
    unknown
  >
}

const UploadCoinIcon = ({
  oldImgUrl,
  onChangeInputField,
  uploadCryptoLogoIcon,
}: UploadCoinIconProps) => {
  const [imageUrl, setImageUrl] = useState<string | undefined>(oldImgUrl)
  const [image, setImage] = useState<any>(null)
  const [error, setError] = useState('')

  const handleFileChange = async (e: any) => {
    const file = e.target.files[0]
    setError('')

    if (!file) return

    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file')
      return
    }

    // Check file size (2MB = 2 * 1024 * 1024 bytes)
    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Image size must be less than 2MB')
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      setImage({
        file: file,
        preview: reader.result,
        name: file.name,
      })
    }
    reader.readAsDataURL(file)

    // Create preview
    const formData = new FormData()
    formData.append('file', file)
    const url = await uploadCryptoLogoIcon.mutateAsync(formData)
    setImageUrl(url);
    onChangeInputField('logoUrl', url)
  }

  const handleRemove = () => {
    setImage(null)
    setImageUrl(undefined)
    setError('')
  }

  return (
    <Fragment>
      <div className="mb-8">
        <h2 className="text-xl font-medium text-gray-800 mb-2">Coin Icon</h2>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          {!(imageUrl || image) ? (
            <label className="cursor-pointer block">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Upload className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 mb-2">
                  <span className="text-indigo-600 font-medium">
                    Click to upload
                  </span>{' '}
                  or drag and drop
                </p>
                <p className="text-sm text-gray-400">PNG, JPG, GIF up to 2MB</p>
              </div>
            </label>
          ) : (
            <div className="flex items-center justify-center gap-6">
              <img
                src={image ? image?.preview : imageUrl}
                alt="Coin preview"
                className="w-24 h-24 object-cover rounded-lg border border-gray-200"
              />
              {image && (
                <div className="text-left flex-1">
                  <p className="text-gray-800 font-medium mb-1">{image.name || ''}</p>
                  <p className="text-sm text-gray-400">
                    {(image.file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}
              <button
                onClick={handleRemove}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                title="Remove image"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          )}
        </div>

        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>
    </Fragment>
  )
}

export default UploadCoinIcon
