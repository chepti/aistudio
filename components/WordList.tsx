
import React from 'react';
import { Word } from '../types';
import WordItem from './WordItem';
import { UI_TEXT } from '../constants';

interface WordListProps {
  words: Word[];
  onToggleMastered: (id: string) => void;
  onGenerateStory: (word: Word) => void;
  onSpeak: (text: string) => void;
  apiKeyAvailable: boolean;
}

const WordList: React.FC<WordListProps> = ({
  words,
  onToggleMastered,
  onGenerateStory,
  onSpeak,
  apiKeyAvailable,
}) => {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
        {UI_TEXT.WORD_LIST_TITLE}
      </h2>
      <div className="space-y-4">
        {words.map(word => (
          <WordItem
            key={word.id}
            word={word}
            onToggleMastered={onToggleMastered}
            onGenerateStory={onGenerateStory}
            onSpeak={onSpeak}
            apiKeyAvailable={apiKeyAvailable}
          />
        ))}
      </div>
    </section>
  );
};

export default WordList;
