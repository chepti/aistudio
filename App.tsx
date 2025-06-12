
import React, { useState, useCallback, useEffect } from 'react';
import { Word } from './types';
import { UI_TEXT, GEMINI_MODEL_TEXT } from './constants';
import WordInput from './components/WordInput';
import WordList from './components/WordList';
import { generateStoryForWord } from './services/geminiService';
import { speakText } from './services/speechService';
import { Info } from 'lucide-react';


// This would typically be process.env.API_KEY, but for web-based example, we check its availability.
const IS_API_KEY_CONFIGURED = typeof process !== 'undefined' && process.env && process.env.API_KEY && process.env.API_KEY.trim() !== '';

const App: React.FC = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [apiKeyAvailable, setApiKeyAvailable] = useState<boolean>(false);
  const [showApiKeyWarning, setShowApiKeyWarning] = useState<boolean>(false);

  useEffect(() => {
    // In a real build process, process.env.API_KEY would be substituted.
    // For this environment, we simulate checking if it might have been configured.
    // If process.env.API_KEY is not available or empty, features requiring it will be limited.
    const key = (window as any).GEMINI_API_KEY || (typeof process !== 'undefined' && process.env.API_KEY);
    if (key && key.trim() !== '') {
      setApiKeyAvailable(true);
      setShowApiKeyWarning(false);
    } else {
      setApiKeyAvailable(false);
      setShowApiKeyWarning(true);
      console.warn(UI_TEXT.NO_API_KEY_MESSAGE);
    }
  }, []);

  const handleAddWords = useCallback((inputText: string) => {
    const newWordsArray = inputText
      .split(',')
      .map(word => word.trim().toLowerCase())
      .filter(word => word.length > 0)
      .map(text => ({
        id: crypto.randomUUID(),
        text,
        mastered: false,
        isGeneratingStory: false,
      }));
    
    // Filter out duplicates based on text, keeping existing words if they were already added
    setWords(prevWords => {
      const existingTexts = new Set(prevWords.map(w => w.text));
      const uniqueNewWords = newWordsArray.filter(nw => !existingTexts.has(nw.text));
      return [...prevWords, ...uniqueNewWords];
    });
  }, []);

  const handleToggleMastered = useCallback((id: string) => {
    setWords(prevWords =>
      prevWords.map(word =>
        word.id === id ? { ...word, mastered: !word.mastered, story: undefined } : word // Clear story if mastery changes
      )
    );
  }, []);

  const handleGenerateStory = useCallback(async (wordToGetStory: Word) => {
    if (!apiKeyAvailable) {
      alert(UI_TEXT.NO_API_KEY_MESSAGE);
      return;
    }

    setWords(prevWords =>
      prevWords.map(w =>
        w.id === wordToGetStory.id ? { ...w, isGeneratingStory: true } : w
      )
    );

    try {
      const story = await generateStoryForWord(wordToGetStory.text, GEMINI_MODEL_TEXT);
      setWords(prevWords =>
        prevWords.map(w =>
          w.id === wordToGetStory.id ? { ...w, story, isGeneratingStory: false } : w
        )
      );
    } catch (error) {
      console.error('Failed to generate story:', error);
      alert(UI_TEXT.ERROR_GENERATING_STORY);
      setWords(prevWords =>
        prevWords.map(w =>
          w.id === wordToGetStory.id ? { ...w, isGeneratingStory: false } : w
        )
      );
    }
  }, [apiKeyAvailable]);

  const handleSpeak = useCallback((text: string) => {
    speakText(text);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 sm:p-6 md:p-8 font-sans">
      <div className="container mx-auto max-w-3xl bg-white/90 backdrop-blur-md rounded-xl shadow-2xl p-6 sm:p-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600">
            {UI_TEXT.APP_TITLE}
          </h1>
        </header>

        {showApiKeyWarning && (
          <div className="mb-6 p-4 bg-yellow-100 border-s-4 border-yellow-500 text-yellow-700 rounded-md flex items-center space-s-3">
            <Info className="h-6 w-6 text-yellow-600" />
            <p>{UI_TEXT.NO_API_KEY_MESSAGE_DETAILED}</p>
          </div>
        )}

        <WordInput onAddWords={handleAddWords} />

        {words.length > 0 ? (
          <WordList
            words={words}
            onToggleMastered={handleToggleMastered}
            onGenerateStory={handleGenerateStory}
            onSpeak={handleSpeak}
            apiKeyAvailable={apiKeyAvailable}
          />
        ) : (
          <div className="text-center text-slate-600 mt-10 p-6 bg-slate-50 rounded-lg shadow">
            <p className="text-lg">{UI_TEXT.NO_WORDS_PROMPT}</p>
          </div>
        )}
         <footer className="text-center mt-12 text-sm text-slate-500">
          <p>כלי עזר ללימוד אנגלית מבית היוצר של Gemini</p>
        </footer>
      </div>
    </div>
  );
};

export default App;
