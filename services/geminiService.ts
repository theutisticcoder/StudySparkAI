import { GoogleGenAI, Type } from "@google/genai";
import type { Flashcard, QuizQuestion, PracticeExam, UserAnswers, ExamGradingResult, FrqGradingResult } from '../types';

// Fix: Adhering to the coding guidelines to use process.env.API_KEY for the API key, which also resolves the TypeScript error with `import.meta.env`.
if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateExplanation = async (topic: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Explain the concept of "${topic}" in a clear, simple, and concise way suitable for a high school student. Use analogies if helpful.`,
             config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating explanation:", error);
        return "Sorry, I couldn't generate an explanation at the moment. Please try again.";
    }
};

export const generateFlashcards = async (topic: string): Promise<Flashcard[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate 8 flashcards for the topic: "${topic}". Each card should have a key term and a concise definition.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            term: { type: Type.STRING },
                            definition: { type: Type.STRING }
                        },
                        required: ["term", "definition"]
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as Flashcard[];
    } catch (error) {
        console.error("Error generating flashcards:", error);
        return [];
    }
};

export const generateQuiz = async (topic: string): Promise<QuizQuestion[]> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a 5-question multiple-choice quiz on the topic: "${topic}". For each question, provide 4 options and identify the correct answer. The options should be distinct and plausible.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            options: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            correctAnswer: { type: Type.STRING }
                        },
                        required: ["question", "options", "correctAnswer"]
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as QuizQuestion[];
    } catch (error) {
        console.error("Error generating quiz:", error);
        return [];
    }
};

export const generateApPlan = async (subject: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Create a comprehensive 4-week study plan for the AP ${subject} exam. Break it down week by week, covering key topics, practice exercises (like MCQs and FRQs), and review strategies. The plan should be actionable and well-structured. Use markdown for formatting.`,
             config: { thinkingConfig: { thinkingBudget: 0 } }
        });
        return response.text;
    } catch (error) {
        console.error("Error generating AP plan:", error);
        return `Sorry, I couldn't generate a study plan for AP ${subject} at the moment. Please try again.`;
    }
};

export const generatePracticeExam = async (subject: string): Promise<PracticeExam | null> => {
    try {
        const basePrompt = `Generate a high-quality, full-length practice exam for AP ${subject}. The exam must be structured like a real College Board exam with an accurate number and type of questions for this subject.`;

        let subjectSpecificInstructions = '';
        if (subject.includes("History") || subject.includes("Government")) {
            subjectSpecificInstructions = `
            - The Multiple-Choice section must contain exactly 55 questions. Each question must have 4 options labeled "A", "B", "C", and "D".
            - The Free-Response section must contain one Document-Based Question (DBQ), one Long Essay Question (LEQ), and three Short-Answer Questions (SAQs).
            - For the DBQ, you MUST provide 5-7 relevant, brief, text-based historical documents. Each document must have a 'source' and 'content'.
            - The recommendedTime for the full exam should be 195 minutes (3 hours and 15 minutes).
            `;
        } else if (["Calculus AB", "Calculus BC", "Physics 1", "Physics C: Mechanics", "Statistics", "Chemistry", "Biology", "Environmental Science", "Macroeconomics", "Microeconomics"].includes(subject)) {
            subjectSpecificInstructions = `
            - The Multiple-Choice section must contain exactly 50 questions. Each question must have 4 options labeled "A", "B", "C", and "D".
            - The Free-Response section must contain 3-6 questions, appropriate for the subject.
            - Crucially, for several of the multiple-choice and free-response questions, you MUST include necessary data, tables, functions, or detailed descriptions of scenarios that would normally be presented in a graph or diagram. For example, describe the graph of a function f(x), or provide a table of values for a statistics problem.
            - The recommendedTime for the full exam should be 180 minutes (3 hours).
            `;
        } else if (subject.includes("English") || subject.includes("Computer Science")) {
            subjectSpecificInstructions = `
            - The Multiple-Choice section must contain exactly 45 questions. Each question must have 4 options labeled "A", "B", "C", and "D".
            - The Free-Response section must contain exactly 3 questions.
            - For English subjects, the FRQs should be of standard types like Synthesis, Rhetorical Analysis, and Argument. For Computer Science, they should be coding-based problems.
            - The recommendedTime for the full exam should be 180 minutes (3 hours).
            `;
        } else {
            // Default for other subjects like Art History, Psychology
            subjectSpecificInstructions = `
            - The Multiple-Choice section must contain exactly 50 questions. Each question must have 4 options labeled "A", "B", "C", and "D".
            - The Free-Response section must contain 2-3 questions.
            - The recommendedTime for the full exam should be 120 minutes (2 hours).
            `;
        }

        const fullPrompt = `${basePrompt}\n\n${subjectSpecificInstructions}\n\nThe questions should cover a range of topics relevant to the AP ${subject} curriculum and be challenging.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: fullPrompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subject: { type: Type.STRING },
                        recommendedTime: { type: Type.INTEGER },
                        mcqs: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    options: {
                                        type: Type.OBJECT,
                                        properties: {
                                            A: { type: Type.STRING },
                                            B: { type: Type.STRING },
                                            C: { type: Type.STRING },
                                            D: { type: Type.STRING }
                                        },
                                        required: ["A", "B", "C", "D"]
                                    },
                                    correctAnswer: { type: Type.STRING }
                                },
                                required: ["question", "options", "correctAnswer"]
                            }
                        },
                        frqs: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    question: { type: Type.STRING },
                                    questionType: { type: Type.STRING },
                                    documents: {
                                        type: Type.ARRAY,
                                        items: {
                                            type: Type.OBJECT,
                                            properties: {
                                                source: { type: Type.STRING },
                                                content: { type: Type.STRING }
                                            },
                                            required: ["source", "content"]
                                        }
                                    }
                                },
                                required: ["question", "questionType"]
                            }
                        }
                    },
                    required: ["subject", "mcqs", "frqs", "recommendedTime"]
                }
            }
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PracticeExam;
    } catch (error) {
        console.error("Error generating practice exam:", error);
        return null;
    }
};

export const gradePracticeExam = async (exam: PracticeExam, answers: UserAnswers): Promise<ExamGradingResult | null> => {
    try {
        // Grade MCQs automatically
        let mcqScore = 0;
        exam.mcqs.forEach((mcq, index) => {
            if (answers.mcqs[index] === mcq.correctAnswer) {
                mcqScore++;
            }
        });

        // Prepare FRQs for AI grading
        const frqGradingPromises = exam.frqs.map(async (frq, index) => {
            const userAnswer = answers.frqs[index] || "No answer provided.";
            
            let frqPrompt = `You are an expert AP exam grader for the subject: AP ${exam.subject}.
                
            Question: "${frq.question}"
            This is a ${frq.questionType}.`;

            if (frq.documents && frq.documents.length > 0) {
                const docsText = frq.documents.map((doc, i) => `Document ${i+1} (${doc.source}):\n${doc.content}`).join('\n\n');
                frqPrompt += `\nThe student was provided with the following documents to answer the question:\n${docsText}\n`;
            }

            frqPrompt += `\nStudent's Answer: "${userAnswer}"
                
            Please grade this student's response on a scale of 0 to 9. Provide constructive feedback explaining the strengths and weaknesses of the answer and justify the score you've given. The feedback should be helpful and guide the student on how to improve.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: frqPrompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            score: { type: Type.INTEGER },
                            feedback: { type: Type.STRING }
                        },
                        required: ["score", "feedback"]
                    }
                }
            });
            const jsonText = response.text.trim();
            return JSON.parse(jsonText) as FrqGradingResult;
        });

        const frqResults = await Promise.all(frqGradingPromises);

        return {
            mcqScore,
            totalMcqs: exam.mcqs.length,
            frqResults,
        };
    } catch (error) {
        console.error("Error grading practice exam:", error);
        return null;
    }
};
