import React, { useState, useCallback } from 'react';
import { AP_SUBJECTS } from '../constants';
import { generateApPlan } from '../services/geminiService';
import Card from './Card';
import LoadingSpinner from './LoadingSpinner';

const ApPracticePlanner: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [plan, setPlan] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePlan = useCallback(async (subject: string) => {
    setSelectedSubject(subject);
    setIsLoading(true);
    setError(null);
    setPlan('');
    
    const result = await generateApPlan(subject);
    
    if (result.startsWith("Sorry")) {
        setError(result);
    } else {
        setPlan(result);
    }
    
    setIsLoading(false);
  }, []);

  return (
    <section id="ap-planner">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary">AP Exam Practice Plans</h2>
        <p className="text-md text-text-secondary max-w-2xl mx-auto mt-2">
          Select an AP subject to get a personalized 4-week study plan from our AI.
        </p>
      </div>
      <Card>
        <div className="flex flex-wrap justify-center gap-3">
          {AP_SUBJECTS.map((subject) => (
            <button
              key={subject}
              onClick={() => handleGeneratePlan(subject)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                selectedSubject === subject
                  ? 'bg-primary text-white'
                  : 'bg-gray-200 text-text-secondary hover:bg-gray-300'
              }`}
            >
              {subject}
            </button>
          ))}
        </div>

        <div className="mt-8">
            {isLoading && <LoadingSpinner />}
            {error && <p className="text-red-500 text-center">{error}</p>}
            {plan && (
                <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h3 className="text-2xl font-bold text-primary mb-4">4-Week Study Plan for AP {selectedSubject}</h3>
                    <div className="text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {plan}
                    </div>
                </div>
            )}
        </div>
      </Card>
    </section>
  );
};

export default ApPracticePlanner;
