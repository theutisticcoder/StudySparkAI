import React, { useState, useEffect } from 'react';
import type { PracticeExam, UserAnswers } from '../types';

interface ExamTakerProps {
    exam: PracticeExam;
    onSubmit: (answers: UserAnswers) => void;
    timeMultiplier: number;
}

const ExamTaker: React.FC<ExamTakerProps> = ({ exam, onSubmit, timeMultiplier }) => {
    const [mcqAnswers, setMcqAnswers] = useState<{ [key: number]: string }>({});
    const [frqAnswers, setFrqAnswers] = useState<{ [key: number]: string }>({});
    const [timeLeft, setTimeLeft] = useState(exam.recommendedTime * timeMultiplier * 60);

    useEffect(() => {
        setTimeLeft(exam.recommendedTime * timeMultiplier * 60);
        
        const timer = setInterval(() => {
            setTimeLeft(prevTime => (prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [exam, timeMultiplier]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        const parts = [];
        if (hours > 0) parts.push(hours.toString().padStart(2,'0'));
        parts.push(minutes.toString().padStart(2, '0'));
        parts.push(secs.toString().padStart(2, '0'));
        return parts.join(":");
    };

    const handleMcqChange = (qIndex: number, optionKey: string) => {
        setMcqAnswers(prev => ({ ...prev, [qIndex]: optionKey }));
    };

    const handleFrqChange = (qIndex: number, text: string) => {
        setFrqAnswers(prev => ({ ...prev, [qIndex]: text }));
    };

    const handleSubmit = () => {
        const isConfirmed = window.confirm("Are you sure you want to submit your exam? You won't be able to make changes after submitting.");
        if (isConfirmed) {
            onSubmit({ mcqs: mcqAnswers, frqs: frqAnswers });
        }
    };

    return (
        <div className="space-y-8">
            <div className="sticky top-16 bg-white/80 backdrop-blur-sm py-4 border-b z-10 text-center">
                 <h3 className="text-2xl font-bold text-primary">AP {exam.subject} Practice Exam</h3>
                 <div className={`mt-2 text-2xl font-mono ${timeLeft < 300 ? 'text-red-500' : 'text-text-primary'}`}>
                    Time Remaining: {formatTime(timeLeft)}
                 </div>
                 {timeLeft === 0 && <p className="text-red-600 font-semibold mt-1">Time's up! Please submit your exam.</p>}
            </div>

            <div className="space-y-6">
                <h4 className="text-xl font-semibold border-b pb-2">Multiple-Choice Questions ({exam.mcqs.length} questions)</h4>
                {exam.mcqs.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <p className="font-semibold mb-3 whitespace-pre-wrap">{qIndex + 1}. {q.question}</p>
                        <div className="space-y-2">
                            {Object.entries(q.options).map(([key, value]) => (
                                <label key={key} className="flex items-center p-2 border rounded-lg cursor-pointer transition-colors bg-white hover:bg-gray-100 has-[:checked]:bg-blue-100 has-[:checked]:border-primary">
                                    <input
                                        type="radio"
                                        name={`mcq-${qIndex}`}
                                        value={key}
                                        checked={mcqAnswers[qIndex] === key}
                                        onChange={() => handleMcqChange(qIndex, key)}
                                        className="mr-3 h-4 w-4 text-primary focus:ring-primary"
                                    />
                                    <span><strong>{key}.</strong> {value}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <h4 className="text-xl font-semibold border-b pb-2">Free-Response Questions ({exam.frqs.length} questions)</h4>
                 {exam.frqs.map((q, qIndex) => (
                    <div key={qIndex} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="mb-3">
                            <p className="font-semibold">FRQ #{qIndex + 1} <span className="font-normal text-sm text-gray-500">({q.questionType})</span></p>
                             {q.documents && q.documents.length > 0 && (
                                <div className="mt-4 mb-4 border-t border-b py-4 space-y-4">
                                    <h6 className="font-semibold text-gray-700">Documents for this question:</h6>
                                    {q.documents.map((doc, docIndex) => (
                                        <div key={docIndex} className="p-3 bg-gray-100 border border-gray-300 rounded-md">
                                            <p className="text-sm font-semibold text-gray-600 italic">{doc.source}</p>
                                            <p className="mt-1 text-sm whitespace-pre-wrap">{doc.content}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                            <p className="whitespace-pre-wrap">{q.question}</p>
                        </div>
                        <textarea
                            value={frqAnswers[qIndex] || ''}
                            onChange={(e) => handleFrqChange(qIndex, e.target.value)}
                            placeholder="Type your answer here..."
                            rows={10}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
                            aria-label={`Answer for free response question ${qIndex + 1}`}
                        />
                    </div>
                ))}
            </div>

            <div className="text-center pt-4">
                <button
                    onClick={handleSubmit}
                    className="bg-green-500 text-white font-bold px-12 py-4 rounded-lg hover:bg-green-600 transition-colors text-lg"
                >
                    Submit Exam for Grading
                </button>
            </div>
        </div>
    );
};

export default ExamTaker;