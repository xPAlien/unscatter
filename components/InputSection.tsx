
import React, { useState } from 'react';
import { ImageFile } from '../App';

interface InputSectionProps {
  userInput: string;
  setUserInput: (value: string) => void;
  imageFiles: ImageFile[];
  setImageFiles: (files: ImageFile[]) => void;
  onSubmit: () => void;
  isLoading: boolean;
  setError: (message: string | null) => void;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];
const MAX_FILES = 10;


export const InputSection: React.FC<InputSectionProps> = ({ userInput, setUserInput, imageFiles, setImageFiles, onSubmit, isLoading, setError }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      onSubmit();
    }
  };

  const processFiles = (files: FileList) => {
    setError(null);

    const filesArray = Array.from(files);
    const remainingSlots = MAX_FILES - imageFiles.length;

    if (filesArray.length > remainingSlots) {
      setError(`You can only upload up to ${MAX_FILES} images total. You have ${imageFiles.length} already uploaded.`);
      return;
    }

    const validFiles: ImageFile[] = [];

    for (const file of filesArray) {
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setError(`Invalid file type for "${file.name}". Please use PNG, JPG, or WEBP.`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File "${file.name}" is too large. Maximum size is 4MB.`);
        continue;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        validFiles.push({ file, base64: base64String });

        if (validFiles.length === filesArray.length) {
          setImageFiles([...imageFiles, ...validFiles]);
        }
      };
      reader.onerror = () => {
        setError(`Failed to read file "${file.name}".`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    processFiles(files);
    e.target.value = ''; // Reset file input
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (isLoading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(imageFiles.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div
        className="relative"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter scattered tasks, notes, ideas... or drag & drop images here. (Cmd/Ctrl + Enter to submit)"
          className={`w-full h-48 p-4 text-base border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none shadow-sm dark:bg-gray-800 dark:placeholder-gray-400 ${
            isDragging
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          disabled={isLoading}
        />
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 dark:bg-blue-900/30 border-2 border-dashed border-blue-500 rounded-lg pointer-events-none">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-blue-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop images here</p>
            </div>
          </div>
        )}
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="absolute bottom-4 right-4 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </>
          ) : (
            'Unscatter'
          )}
        </button>
      </div>

      <div className="mt-4">
        {imageFiles.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Attached Images ({imageFiles.length}/{MAX_FILES})
              </h3>
              {imageFiles.length < MAX_FILES && (
                <label className={`cursor-pointer flex items-center px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <svg className="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add More
                  <input type="file" multiple className="hidden" onChange={handleFileChange} accept={ACCEPTED_FILE_TYPES.join(',')} disabled={isLoading} />
                </label>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {imageFiles.map((imageFile, index) => (
                <div key={index} className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                  <img src={`data:${imageFile.file.type};base64,${imageFile.base64}`} alt={`Preview ${index + 1}`} className="h-12 w-12 rounded object-cover flex-shrink-0" />
                  <div className="text-sm flex-1 min-w-0">
                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{imageFile.file.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">{(imageFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    onClick={() => removeImage(index)}
                    disabled={isLoading}
                    className="p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 flex-shrink-0"
                    aria-label={`Remove ${imageFile.file.name}`}
                  >
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <label className={`cursor-pointer flex items-center justify-center px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <svg className="w-5 h-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Click to upload or drag & drop images
            <input type="file" multiple className="hidden" onChange={handleFileChange} accept={ACCEPTED_FILE_TYPES.join(',')} disabled={isLoading} />
          </label>
        )}
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-center">
          Accepts: PNG, JPG, WEBP. Max {MAX_FILES} images, 4MB each.
        </p>
      </div>

    </div>
  );
};
