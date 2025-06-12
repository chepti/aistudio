
export interface CharacterInput {
  name: string;
  gender: 'boy' | 'girl';
  appearance: string;
  favoriteAnimal: string;
  setting: string;
}

export interface StorySection {
  story_text_hebrew: string;
  image_prompt_english: string;
  imageUrl?: string;
}

export interface GeneratedStory {
  title: string;
  sections: StorySection[];
}

// Type for the expected JSON structure from the story generation API
export interface GeminiStoryResponse {
  title: string;
  sections: Array<{
    story_text_hebrew: string;
    image_prompt_english: string;
  }>;
}
