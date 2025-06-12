
export const speakText = (text: string, lang: string = 'en-US'): void => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    // Optional: find a specific voice if needed
    // const voices = window.speechSynthesis.getVoices();
    // utterance.voice = voices.find(voice => voice.lang === lang && voice.name.includes('Google')) || voices.find(voice => voice.lang === lang);
    
    // Cancel any ongoing speech before starting a new one
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  } else {
    console.warn('Browser SpeechSynthesis not supported.');
    // Fallback or alert mechanism if needed
    alert('מצטערים, הדפדפן שלך אינו תומך בהקראת טקסט.');
  }
};
