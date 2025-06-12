
import React, { useState, useCallback } from 'react';
import StoryForm from './components/StoryForm';
import StoryDisplay from './components/StoryDisplay';
import LoadingSpinner from './components/LoadingSpinner';
import { SparklesIcon } from './components/icons';
import type { CharacterInput, GeneratedStory, StorySection, GeminiStoryResponse } from './types';
import { generateStoryAndImagePrompts, generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [characterInput, setCharacterInput] = useState<CharacterInput | null>(null);
  const [storyOutput, setStoryOutput] = useState<GeneratedStory | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStorySubmit = useCallback(async (data: CharacterInput) => {
    setCharacterInput(data);
    setIsLoading(true);
    setError(null);
    setStoryOutput(null);

    try {
      const storyData: GeminiStoryResponse = await generateStoryAndImagePrompts(data);
      
      const sectionsWithImages: StorySection[] = [];
      for (const section of storyData.sections) {
        try {
            const imageUrl = await generateImage(section.image_prompt_english);
            sectionsWithImages.push({ ...section, imageUrl });
        } catch (imgError) {
            console.error(`Failed to generate image for a section: ${section.image_prompt_english}`, imgError);
            // Continue without image for this section, or handle more gracefully
            sectionsWithImages.push({ ...section, imageUrl: undefined }); 
            setError(prevError => prevError ? `${prevError}\nשגיאה ביצירת תמונה לחלק מהסיפור.` : 'שגיאה ביצירת תמונה לחלק מהסיפור.');
        }
      }
      
      setStoryOutput({ title: storyData.title, sections: sectionsWithImages });

    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(`אופס! משהו השתבש ביצירת הסיפור: ${err.message}. נסו שוב מאוחר יותר או בדקו את מפתח ה-API שלכם.`);
      } else {
        setError("אופס! משהו השתבש ביצירת הסיפור. שגיאה לא ידועה.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 py-8 px-4 selection:bg-purple-500 selection:text-white" style={{ fontFamily: "'Varela Round', sans-serif" }}>
      <header className="text-center mb-12">
        <div className="inline-flex items-center bg-white p-4 rounded-xl shadow-lg">
          <SparklesIcon className="w-12 h-12 text-yellow-500 mr-3" />
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">
            מחולל הסיפורים של כיתה ב'
          </h1>
        </div>
        <p className="text-purple-700 mt-4 text-lg max-w-2xl mx-auto">
          הזינו פרטים על הדמות והעלילה, ואנחנו ניצור עבורכם סיפור קסום ומאויר!
        </p>
      </header>

      <main>
        {!storyOutput && <StoryForm onSubmit={handleStorySubmit} isLoading={isLoading} />}
        
        {isLoading && <LoadingSpinner />}
        
        {error && !isLoading && (
          <div className="max-w-xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md" role="alert">
            <p className="font-bold">שגיאה!</p>
            <p>{error}</p>
          </div>
        )}
        
        {storyOutput && !isLoading && !error && (
          <>
            <StoryDisplay story={storyOutput} />
            <div className="text-center mt-8">
              <button
                onClick={() => {
                  setStoryOutput(null);
                  setCharacterInput(null);
                  setError(null);
                }}
                className="px-8 py-3 bg-gradient-to-r from-pink-500 to-orange-400 text-white font-semibold rounded-lg shadow-md hover:from-pink-600 hover:to-orange-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition duration-150"
              >
                צור סיפור חדש
              </button>
            </div>
          </>
        )}
      </main>

      <footer className="text-center text-purple-600 mt-12 py-6 border-t border-purple-300">
        <p>&copy; {new Date().getFullYear()} מחולל הסיפורים. כל הזכויות שמורות לדמיון!</p>
      </footer>
    </div>
  );
};

export default App;
