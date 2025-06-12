
import React, { useState } from 'react';
import { Word } from '../types';
import { UI_TEXT } from '../constants';
import { Volume2, CheckCircle, XCircle, BookOpen, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

interface WordItemProps {
  word: Word;
  onToggleMastered: (id: string) => void;
  onGenerateStory: (word: Word) => void;
  onSpeak: (text: string) => void;
  apiKeyAvailable: boolean;
}

const WordItem: React.FC<WordItemProps> = ({
  word,
  onToggleMastered,
  onGenerateStory,
  onSpeak,
  apiKeyAvailable,
}) => {
  const [storyVisible, setStoryVisible] = useState(false);

  return (
    <div className="bg-white p-5 rounded-lg shadow-lg border border-slate-200 transition-all duration-300 hover:shadow-xl">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-2xl font-semibold text-indigo-700 capitalize" lang="en">
            {word.text}
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-end">
          <button
            onClick={() => onSpeak(word.text)}
            title={UI_TEXT.READ_ALOUD}
            className="p-2 text-slate-600 hover:text-indigo-600 transition-colors rounded-full hover:bg-indigo-100"
          >
            <Volume2 size={22} />
          </button>

          <button
            onClick={() => onToggleMastered(word.id)}
            title={word.mastered ? UI_TEXT.NEED_HELP : UI_TEXT.I_KNOW_IT}
            className={`p-2 rounded-full transition-colors ${
              word.mastered
                ? 'text-green-600 hover:bg-green-100'
                : 'text-red-600 hover:bg-red-100'
            }`}
          >
            {word.mastered ? <CheckCircle size={22} /> : <XCircle size={22} />}
          </button>

          {!word.mastered && apiKeyAvailable && !word.story && (
            <button
              onClick={() => onGenerateStory(word)}
              disabled={word.isGeneratingStory}
              title={UI_TEXT.GENERATE_STORY}
              className="p-2 text-purple-600 hover:text-purple-800 transition-colors rounded-full hover:bg-purple-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {word.isGeneratingStory ? <LoadingSpinner className="w-5 h-5"/> : <Sparkles size={22} />}
            </button>
          )}
        </div>
      </div>

      {word.story && (
        <div className="mt-4 pt-4 border-t border-slate-200">
          <button 
            onClick={() => setStoryVisible(!storyVisible)}
            className="flex items-center justify-between w-full text-start text-indigo-700 font-semibold mb-2 hover:text-indigo-900"
          >
            <span>{UI_TEXT.STORY_FOR_WORD_PREFIX}: <em lang="en" className="font-bold capitalize">{word.text}</em></span>
            {storyVisible ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
          {storyVisible && (
             <div className="p-3 bg-indigo-50 rounded-md prose prose-sm max-w-none text-slate-700" lang="en">
                {word.story.split('\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                ))}
            </div>
          )}
        </div>
      )}
       {!word.mastered && !apiKeyAvailable && !word.story && (
         <p className="mt-2 text-xs text-slate-500 italic">{UI_TEXT.NO_API_KEY_MESSAGE}</p>
       )}
    </div>
  );
};

export default WordItem;
