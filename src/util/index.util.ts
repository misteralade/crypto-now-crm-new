export const formatNumber = (value: string | number) => {
  return parseFloat(value.toString()).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 8,
  })
}

export const getCurrencySymbolFromCode = (currencyCode: string): string => {
  const formatter = new Intl.NumberFormat('en', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  const parts = formatter.formatToParts(0);
  const symbolPart = parts.find(part => part.type === 'currency');
  return symbolPart ? symbolPart.value : '';
}

export const getFileType = (file: File) => {
  if (file.type.startsWith('image/')) return 'IMAGE';
  if (file.type.startsWith('video/')) return 'VIDEO';
  if (file.type === 'application/pdf') return 'PDF';
  if (file.type.startsWith('audio/')) return 'AUDIO';
  if (file.name.match(/\.(xls|xlsx|csv)$/)) return 'SPREADSHEET';
  return 'DOCUMENT';
};

export const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
