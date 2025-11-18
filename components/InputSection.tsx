
import React from 'react';
import { ImageFile } from '../App';

interface InputSectionProps {
  userInput: string;
  setUserInput: (value: string) => void;
  imageFile: ImageFile | null;
  setImageFile: (file: ImageFile | null) => void;
  onSubmit: () => void;
  isLoading: boolean;
  setError: (message: string | null) => void;
}

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB
const ACCEPTED_FILE_TYPES = ['image/png', 'image/jpeg', 'image/webp'];


export const InputSection: React.FC<InputSectionProps> = ({ userInput, setUserInput, imageFile, setImageFile, onSubmit, isLoading, setError }) => {
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      onSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setError(`Invalid file type. Please use PNG, JPG, or WEBP.`);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError(`File is too large. Maximum size is 4MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setImageFile({ file, base64: base64String });
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    }
    reader.readAsDataURL(file);
    e.target.value = ''; // Reset file input
  };
  
  return (
    <div>
      <div className="relative">
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter scattered tasks, notes, ideas... or attach an image below. (Cmd/Ctrl + Enter to submit)"
          className="w-full h-48 p-4 text-base border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow duration-200 resize-none shadow-sm dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
          disabled={isLoading}
        />
        <button
          onClick={onSubmit}
          disabled={isLoading}
          className="absolute bottom-4 right-4 flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:scale-100"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
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

      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {imageFile ? (
            <div className="flex items-center space-x-3 bg-gray-100 dark:bg-gray-800 p-2 rounded-lg">
                <img src={`data:${imageFile.file.type};base64,${imageFile.base64}`} alt="Preview" className="h-12 w-12 rounded object-cover" />
                <div className="text-sm">
                    <p className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-xs">{imageFile.file.name}</p>
                    <p className="text-gray-500 dark:text-gray-400">{(imageFile.file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button 
                    onClick={() => setImageFile(null)} 
                    disabled={isLoading}
                    className="ml-2 p-1 rounded-full text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                    aria-label="Remove image"
                >
                    <svg className="h-5 w-5" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        ) : (
          <label className={`cursor-pointer flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
            <svg className="w-5 h-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Attach Image
            <input type="file" className="hidden" onChange={handleFileChange} accept={ACCEPTED_FILE_TYPES.join(',')} disabled={isLoading} />
          </label>
        )}
        <p className="text-xs text-gray-500 dark:text-gray-400 text-right">
          Accepts: PNG, JPG, WEBP. Max size: 4MB.
        </p>
      </div>

    </div>
  );
};
