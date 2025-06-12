
import React, { useState } from 'react';
import { UI_TEXT } from '../constants';
import { PlusCircle } from 'lucide-react';

interface WordInputProps {
  onAddWords: (inputText: string) => void;
}

const WordInput: React.FC<WordInputProps> = ({ onAddWords }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      onAddWords(inputValue);
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gradient-to-r from-sky-100 to-indigo-100 rounded-lg shadow-md">
      <label htmlFor="word-input" className="block text-lg font-semibold text-slate-700 mb-2">
        {UI_TEXT.ENGLISH_WORD}
      </label>
      <textarea
        id="word-input"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder={UI_TEXT.INPUT_PLACEHOLDER}
        className="w-full p-3 border border-slate-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out text-slate-700"
        rows={3}
      />
      <button
        type="submit"
        className="mt-4 w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out disabled:opacity-50"
        disabled={!inputValue.trim()}
      >
        <PlusCircle className="me-2 h-5 w-5" />
        {UI_TEXT.ADD_WORDS_BUTTON}
      </button>
    </form>
  );
};

export default WordInput;
