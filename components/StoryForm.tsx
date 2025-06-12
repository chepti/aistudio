
import React, { useState } from 'react';
import type { CharacterInput } from '../types';
import { MagicWandIcon } from './icons';

interface StoryFormProps {
  onSubmit: (data: CharacterInput) => void;
  isLoading: boolean;
}

const StoryForm: React.FC<StoryFormProps> = ({ onSubmit, isLoading }) => {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<'boy' | 'girl'>('boy');
  const [appearance, setAppearance] = useState('');
  const [favoriteAnimal, setFavoriteAnimal] = useState('');
  const [setting, setSetting] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !appearance.trim() || !favoriteAnimal.trim() || !setting.trim()) {
      alert("בבקשה מלא את כל השדות הדרושים.");
      return;
    }
    onSubmit({ name, gender, appearance, favoriteAnimal, setting });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-2xl max-w-2xl mx-auto my-8 border border-purple-200">
      <h2 className="text-3xl font-bold text-center text-purple-700 mb-8">ספרו לי על הדמות שלכם!</h2>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-purple-600 mb-1">שם הדמות:</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          placeholder="לדוגמה: דני, רוני..."
          required
        />
      </div>

      <div>
        <span className="block text-sm font-medium text-purple-600 mb-1">מין הדמות:</span>
        <div className="mt-2 flex space-x-4 space-x-reverse">
          {(['boy', 'girl'] as const).map((option) => (
            <label key={option} className="flex items-center space-x-2 space-x-reverse cursor-pointer">
              <input
                type="radio"
                name="gender"
                value={option}
                checked={gender === option}
                onChange={() => setGender(option)}
                className="form-radio h-5 w-5 text-purple-600 focus:ring-purple-500 border-purple-300 transition duration-150"
              />
              <span className="text-gray-700">{option === 'boy' ? 'בן' : 'בת'}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="appearance" className="block text-sm font-medium text-purple-600 mb-1">תיאור מראה ולבוש:</label>
        <textarea
          id="appearance"
          value={appearance}
          onChange={(e) => setAppearance(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          placeholder="לדוגמה: שיער חום קצר, עיניים כחולות, חולצה אדומה ומכנסי ג'ינס"
          required
        />
         <p className="mt-1 text-xs text-gray-500">תיאור זה יעזור לנו לצייר את הדמות בתמונות!</p>
      </div>

      <div>
        <label htmlFor="favoriteAnimal" className="block text-sm font-medium text-purple-600 mb-1">חיה אהובה:</label>
        <input
          type="text"
          id="favoriteAnimal"
          value={favoriteAnimal}
          onChange={(e) => setFavoriteAnimal(e.target.value)}
          className="mt-1 block w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          placeholder="לדוגמה: כלב, חתול, אריה"
          required
        />
      </div>

      <div>
        <label htmlFor="setting" className="block text-sm font-medium text-purple-600 mb-1">היכן יתרחש הסיפור?</label>
        <input
          type="text"
          id="setting"
          value={setting}
          onChange={(e) => setSetting(e.target.value)}
          className="mt-1 block w-full px-4 py-3 border border-purple-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
          placeholder="לדוגמה: יער קסום, חלל, אי בודד"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-lg text-base font-medium text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            מעבד...
          </>
        ) : (
          <>
            <MagicWandIcon className="w-5 h-5 mr-2" />
            צרו לי סיפור!
          </>
        )}
      </button>
    </form>
  );
};

export default StoryForm;
