
export interface Word {
  id: string;
  text: string;
  mastered: boolean;
  story?: string;
  isGeneratingStory: boolean;
}
