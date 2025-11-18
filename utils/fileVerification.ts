/**
 * File type verification using magic numbers
 */

/**
 * Verify image file type by checking magic numbers (file signature)
 * This prevents file type spoofing via extension/MIME type manipulation
 */
export const verifyImageType = async (file: File): Promise<{ valid: boolean; detectedType?: string; error?: string }> => {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = (e) => {
      try {
        const result = e.target?.result as ArrayBuffer;
        if (!result) {
          resolve({ valid: false, error: 'Failed to read file' });
          return;
        }

        const arr = new Uint8Array(result).subarray(0, 12);
        let header = '';
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16).padStart(2, '0');
        }

        // Check magic numbers for supported formats
        // PNG: 89 50 4E 47 0D 0A 1A 0A
        if (header.startsWith('89504e47')) {
          resolve({ valid: true, detectedType: 'image/png' });
          return;
        }

        // JPEG: FF D8 FF
        if (header.startsWith('ffd8ff')) {
          resolve({ valid: true, detectedType: 'image/jpeg' });
          return;
        }

        // WEBP: RIFF .... WEBP (52 49 46 46 .... 57 45 42 50)
        if (header.startsWith('52494646') && header.includes('57454250')) {
          resolve({ valid: true, detectedType: 'image/webp' });
          return;
        }

        resolve({
          valid: false,
          error: `File "${file.name}" does not appear to be a valid image. Detected signature: ${header.substring(0, 16)}...`
        });
      } catch (error) {
        resolve({
          valid: false,
          error: `Failed to verify file type: ${error instanceof Error ? error.message : 'Unknown error'}`
        });
      }
    };

    reader.onerror = () => {
      resolve({ valid: false, error: `Failed to read file "${file.name}"` });
    };

    // Read first 12 bytes to check magic number
    reader.readAsArrayBuffer(file.slice(0, 12));
  });
};

/**
 * Comprehensive file validation
 */
export const validateFile = async (
  file: File,
  options: {
    maxSize?: number;
    acceptedTypes?: string[];
    verifyMagicNumbers?: boolean;
  } = {}
): Promise<{ valid: boolean; error?: string }> => {
  const {
    maxSize = 4 * 1024 * 1024, // 4MB default
    acceptedTypes = ['image/png', 'image/jpeg', 'image/webp'],
    verifyMagicNumbers = true
  } = options;

  // Check MIME type
  if (!acceptedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type for "${file.name}". Accepted types: ${acceptedTypes.join(', ')}`
    };
  }

  // Check file size
  if (file.size > maxSize) {
    const sizeMB = (maxSize / 1024 / 1024).toFixed(1);
    return {
      valid: false,
      error: `File "${file.name}" exceeds maximum size of ${sizeMB}MB`
    };
  }

  // Verify magic numbers if enabled
  if (verifyMagicNumbers) {
    const verification = await verifyImageType(file);
    if (!verification.valid) {
      return verification;
    }

    // Check if detected type matches declared MIME type
    if (verification.detectedType && verification.detectedType !== file.type) {
      return {
        valid: false,
        error: `File "${file.name}" has mismatched type. Claimed: ${file.type}, Detected: ${verification.detectedType}`
      };
    }
  }

  return { valid: true };
};
