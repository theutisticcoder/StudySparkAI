import React, { useState, useCallback } from "react"
import { generateQuiz } from "../services/geminiService"
import LoadingSpinner from "./LoadingSpinner"

const QuizMe = () => {
  const [topic, setTopic] = useState("")
  const [questions, setQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = useCallback(async () => {
    if (!topic.trim()) {
      setError("Please enter a topic.")
      return
    }
    setIsLoading(true)
    setError(null)
    setQuestions([])
    setUserAnswers({})
    setSubmitted(false)
    setScore(0)

    const result = await generateQuiz(topic)
    if (result.length === 0) {
      setError(
        "Sorry, I couldn't generate a quiz for this topic. Please try another one."
      )
    } else {
      setQuestions(result)
    }

    setIsLoading(false)
  }, [topic])

  const handleAnswerSelect = (questionIndex, answer) => {
    if (submitted) return
    setUserAnswers(prev => ({ ...prev, [questionIndex]: answer }))
  }

  const handleSubmit = () => {
    let currentScore = 0
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        currentScore++
      }
    })
    setScore(currentScore)
    setSubmitted(true)
  }

  const getButtonClass = (questionIndex, option) => {
    if (!submitted) {
      return userAnswers[questionIndex] === option
        ? "bg-blue-200 border-primary"
        : "bg-white hover:bg-gray-100"
    }
    const isCorrect = questions[questionIndex].correctAnswer === option
    const isSelected = userAnswers[questionIndex] === option

    if (isCorrect) return "bg-green-200 border-green-500"
    if (isSelected && !isCorrect) return "bg-red-200 border-red-500"
    return "bg-white border-gray-300"
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-center text-text-primary">
        Test Your Knowledge
      </h3>
      <p className="text-center text-text-secondary">
        Challenge yourself with a quick quiz on any subject.
      </p>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g., The American Revolution, Basic Algebra..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
        />
        <button
          onClick={handleGenerate}
          disabled={isLoading}
          className="bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating Quiz..." : "Start Quiz"}
        </button>
      </div>
      {error && <p className="text-red-500 text-center">{error}</p>}
      {isLoading && <LoadingSpinner />}
      {questions.length > 0 && (
        <div className="mt-6 space-y-6">
          {questions.map((q, qIndex) => (
            <div
              key={qIndex}
              className="p-4 border border-gray-200 rounded-lg bg-gray-50"
            >
              <p className="font-semibold mb-3">
                {qIndex + 1}. {q.question}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {q.options.map((option, oIndex) => (
                  <button
                    key={oIndex}
                    onClick={() => handleAnswerSelect(qIndex, option)}
                    disabled={submitted}
                    className={`p-2 w-full text-left border rounded-lg transition-colors ${getButtonClass(
                      qIndex,
                      option
                    )}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}
          {!submitted ? (
            <div className="text-center">
              <button
                onClick={handleSubmit}
                className="bg-green-500 text-white font-bold px-8 py-3 rounded-lg hover:bg-green-600 transition-colors"
              >
                Submit Answers
              </button>
            </div>
          ) : (
            <div className="text-center p-6 bg-blue-100 rounded-lg">
              <h3 className="text-2xl font-bold text-primary">
                Quiz Complete!
              </h3>
              <p className="text-xl mt-2">
                Your score:{" "}
                <span className="font-bold">
                  {score} / {questions.length}
                </span>
              </p>
              <button
                onClick={handleGenerate}
                className="mt-4 bg-primary text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-600"
              >
                Try a new quiz on "{topic}"
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default QuizMe
