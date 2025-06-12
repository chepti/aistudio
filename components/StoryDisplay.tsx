
import React from 'react';
import type { GeneratedStory } from '../types';
import { DownloadIcon, NikudIcon } from './icons';

interface StoryDisplayProps {
  story: GeneratedStory;
}

const StoryDisplay: React.FC<StoryDisplayProps> = ({ story }) => {
  
  const handleDownloadHtml = () => {
    const { title, sections } = story;
    let htmlContent = `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>${title} - סיפור להדפסה</title>
    <link href="https://fonts.googleapis.com/css2?family=Varela+Round&display=swap" rel="stylesheet">
    <style>
        body { 
            font-family: 'Varela Round', sans-serif; 
            direction: rtl; 
            text-align: right; 
            margin: 30px; 
            background-color: #fdf6e3; /* Light cream background for print */
            color: #333;
        }
        h1 { 
            color: #865DFF; /* Purple */
            text-align: center; 
            margin-bottom: 25px; 
            font-size: 28px;
        }
        .story-section { 
            margin-bottom: 25px; 
            padding: 20px; 
            border: 2px dashed #FFC26F; /* Orange dashed border */
            border-radius: 12px; 
            background-color: #fff9ef; /* Lighter cream for sections */
            page-break-inside: avoid;
        }
        .story-section img { 
            display: block;
            max-width: 80%; 
            height: auto; 
            border-radius: 10px; 
            margin: 0 auto 15px auto; 
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        .story-section p { 
            line-height: 1.8; 
            font-size: 18px; 
            text-align: justify;
            white-space: pre-wrap; /* Preserve line breaks from story */
        }
         @media print {
            body { margin: 20px; background-color: #fff; }
            .story-section { border: 1px solid #ccc; box-shadow: none; }
        }
    </style>
</head>
<body>
    <h1>${title}</h1>`;

    sections.forEach((section, index) => {
      htmlContent += `
    <div class="story-section">
        <h2 style="text-align: center; color: #FF8C00; margin-bottom: 15px;">חלק ${index + 1}</h2>
        ${section.imageUrl ? `<img src="${section.imageUrl}" alt="איור לחלק ${index + 1} של הסיפור">` : ''}
        <p>${section.story_text_hebrew.replace(/\n/g, '<br>')}</p>
    </div>`;
    });

    htmlContent += `
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${title.replace(/\s+/g, '_')}_story.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  const handleAddNikud = () => {
    alert('פונקציית הוספת ניקוד תהיה זמינה בקרוב!');
  };

  return (
    <div className="bg-yellow-50 p-6 sm:p-10 rounded-xl shadow-2xl max-w-4xl mx-auto my-10 border-2 border-yellow-300">
      <h1 className="text-4xl font-bold text-center text-yellow-700 mb-8">{story.title}</h1>
      
      <div className="space-y-12">
        {story.sections.map((section, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-lg border border-yellow-200 transform transition-all hover:shadow-xl hover:scale-105">
            <h2 className="text-2xl font-semibold text-yellow-600 mb-4 text-center">חלק {index + 1}</h2>
            {section.imageUrl && (
              <img 
                src={section.imageUrl} 
                alt={`איור לחלק ${index + 1}`} 
                className="w-full max-w-md mx-auto h-auto object-contain rounded-lg mb-6 shadow-md border-2 border-yellow-200" 
              />
            )}
            <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-line text-justify">{section.story_text_hebrew}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 sm:space-x-reverse">
        <button
          onClick={handleAddNikud}
          className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out w-full sm:w-auto"
        >
          <NikudIcon className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          הוסף ניקוד
        </button>
        <button
          onClick={handleDownloadHtml}
          className="flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-md text-base font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out w-full sm:w-auto"
        >
          <DownloadIcon className="w-5 h-5 mr-2 rtl:ml-2 rtl:mr-0" />
          הורד כ-HTML (להדפסה)
        </button>
      </div>
    </div>
  );
};

export default StoryDisplay;
