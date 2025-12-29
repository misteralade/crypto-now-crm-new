/**
 * Validates if a string is a valid URL
 * @param url - The string to validate
 * @returns true if valid URL, false otherwise
 */
export const isValidUrl = (url: string | undefined | null): boolean => {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return false
  }

  try {
    const urlObj = new URL(url)
    // Check if it has a valid protocol (http, https, etc.)
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Cleans URL fields from an object, removing invalid URLs
 * @param payload - The payload object
 * @param urlFields - Array of field names that should be validated as URLs
 * @returns A new object with invalid URL fields set to undefined
 */
export const cleanUrlFields = <T extends Record<string, any>>(
  payload: T,
  urlFields: string[] = ['websiteUrl', 'whitepaperUrl']
): T => {
  const cleaned = { ...payload } as T
  
  for (const field of urlFields) {
    if (field in cleaned && !isValidUrl(cleaned[field as keyof T] as string | undefined)) {
      (cleaned as any)[field] = undefined
    }
  }
  
  return cleaned
}
