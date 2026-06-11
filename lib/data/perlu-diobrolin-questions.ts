import raw from './perlu-diobrolin-questions.json';

export interface Question {
  id: string;
  text: string;
}

export interface QuestionCategory {
  id: string;
  name: string;
  questions: Question[];
}

export const questionCategories = raw as QuestionCategory[];

export const totalQuestions = questionCategories.reduce(
  (sum, cat) => sum + cat.questions.length,
  0
);
