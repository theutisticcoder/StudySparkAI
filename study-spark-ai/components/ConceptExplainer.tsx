import React, { useState, useCallback } from 'react';
import { generateExplanation } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';

const ConceptExplainer: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setExplanation('');
    
    const result = await generateExplanation(topic);
    
    if (result.startsWith("Sorry")) {
        setError(result);
    } else {
        setExplanation(result);
    }
    
    setIsLoading(false);
  }, [topic]);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-text-primary">Stuck on a concept?</h3>
      <p className="text-center text-text-secondary">Enter any topic, concept, or question, and get a simple explanation.</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Photosynthesis, The Pythagorean Theorem..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Explaining...' : 'Explain'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {isLoading && <LoadingSpinner />}
      {explanation && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="font-bold text-lg mb-2 text-primary">Explanation:</h4>
          <p className="text-text-secondary whitespace-pre-wrap">{explanation}</p>
        </div>
      )}
    </div>
  );
};

export default ConceptExplainer;
