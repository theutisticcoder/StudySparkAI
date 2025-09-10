export interface Flashcard {
  term: string;
  definition: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
}

// New types for Practice Exam
export interface McqQuestion {
  question: string;
  options: { [key: string]: string }; // e.g., { "A": "Option 1", "B": "Option 2" }
  correctAnswer: string; // e.g., "A"
}

export interface Document {
  source: string;
  content: string;
}

export interface FrqQuestion {
  question:string;
  questionType: string; // e.g., 'Short Answer Question', 'Long Essay Question'
  documents?: Document[]; // For DBQs
}

export interface PracticeExam {
  subject: string;
  mcqs: McqQuestion[];
  frqs: FrqQuestion[];
  recommendedTime: number; // in minutes
}

export interface UserAnswers {
  mcqs: { [key: number]: string };
  frqs: { [key: number]: string };
}

export interface FrqGradingResult {
  score: number;
  feedback: string;
}

export interface ExamGradingResult {
  mcqScore: number;
  totalMcqs: number;
  frqResults: FrqGradingResult[];
}