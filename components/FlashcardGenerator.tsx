import React, { useState, useCallback } from 'react';
import { generateFlashcards } from '../services/geminiService';
import type { Flashcard } from '../types';
import LoadingSpinner from './LoadingSpinner';

const FlashcardGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedCard, setFlippedCard] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError('Please enter a topic.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setFlashcards([]);
    setFlippedCard(null);

    const result = await generateFlashcards(topic);
    
    if (result.length === 0) {
        setError("Sorry, I couldn't generate flashcards for this topic. Please try another one.");
    } else {
        setFlashcards(result);
    }

    setIsLoading(false);
  }, [topic]);

  const handleCardFlip = (index: number) => {
    setFlippedCard(flippedCard === index ? null : index);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-text-primary">Create Flashcards Instantly</h3>
      <p className="text-center text-text-secondary">Enter a subject to generate a set of flashcards for active recall practice.</p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Key Events of World War II, Cell Organelles..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {isLoading && <LoadingSpinner />}
      {flashcards.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {flashcards.map((card, index) => (
            <div key={index} className="perspective-1000" onClick={() => handleCardFlip(index)}>
              <div 
                className={`relative w-full h-48 rounded-lg shadow-md cursor-pointer transition-transform duration-500 transform-style-3d ${flippedCard === index ? 'rotate-y-180' : ''}`}
              >
                <div className="absolute w-full h-full backface-hidden bg-white border border-gray-200 rounded-lg flex items-center justify-center p-4 text-center">
                  <p className="font-semibold text-lg text-primary">{card.term}</p>
                </div>
                <div className="absolute w-full h-full backface-hidden bg-blue-100 border border-blue-200 rounded-lg flex items-center justify-center p-4 text-center transform rotate-y-180">
                  <p className="text-text-secondary">{card.definition}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FlashcardGenerator;
