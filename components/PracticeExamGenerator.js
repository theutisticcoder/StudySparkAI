import React, { useState, useCallback } from "react"
import { AP_SUBJECTS } from "../constants"
import {
  generatePracticeExam,
  gradePracticeExam
} from "../services/geminiService"
import Card from "./Card"
import LoadingSpinner from "./LoadingSpinner"
import ExamTaker from "./ExamTaker"
import ExamResults from "./ExamResults"

const timeOptions = [
  { label: "Standard Time", value: 1.0 },
  { label: "Time and a Half (1.5x)", value: 1.5 },
  { label: "Double Time (2x)", value: 2.0 }
]

const PracticeExamGenerator = () => {
  const [status, setStatus] = useState("selecting")
  const [selectedSubject, setSelectedSubject] = useState(AP_SUBJECTS[0])
  const [timeMultiplier, setTimeMultiplier] = useState(1.0)
  const [exam, setExam] = useState(null)
  const [gradingResult, setGradingResult] = useState(null)
  const [userAnswers, setUserAnswers] = useState(null)
  const [error, setError] = useState(null)

  const handleGenerateExam = useCallback(async subject => {
    setStatus("generating")
    setError(null)
    setExam(null)
    setGradingResult(null)

    const generatedExam = await generatePracticeExam(subject)
    if (generatedExam) {
      setExam(generatedExam)
      setStatus("taking")
    } else {
      setError(
        "Sorry, I couldn't generate an exam for this subject. Please try again or select another one."
      )
      setStatus("selecting")
    }
  }, [])

  const handleSubmitExam = useCallback(
    async answers => {
      if (!exam) return
      setUserAnswers(answers)
      setStatus("grading")
      setError(null)

      const result = await gradePracticeExam(exam, answers)
      if (result) {
        setGradingResult(result)
        setStatus("results")
      } else {
        setError(
          "Sorry, there was an error grading your exam. Please try submitting again."
        )
        setStatus("taking") // Go back to the exam
      }
    },
    [exam]
  )

  const handleReset = () => {
    setStatus("selecting")
    setExam(null)
    setGradingResult(null)
    setUserAnswers(null)
    setError(null)
  }

  const renderContent = () => {
    switch (status) {
      case "generating":
        return (
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-2 text-text-secondary">
              Generating your exam for AP {selectedSubject}... This might take a
              minute.
            </p>
          </div>
        )
      case "taking":
        if (exam) {
          return (
            <ExamTaker
              exam={exam}
              onSubmit={handleSubmitExam}
              timeMultiplier={timeMultiplier}
            />
          )
        }
        return null
      case "grading":
        return (
          <div className="text-center">
            <LoadingSpinner />
            <p className="mt-2 text-text-secondary">
              AI is grading your exam. This may take a moment...
            </p>
          </div>
        )
      case "results":
        if (gradingResult && exam && userAnswers) {
          return (
            <ExamResults
              exam={exam}
              results={gradingResult}
              userAnswers={userAnswers}
              onRetake={handleReset}
            />
          )
        }
        return null
      case "selecting":
      default:
        return (
          <div className="space-y-6 max-w-2xl mx-auto text-center">
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            <div>
              <label
                htmlFor="subject-select"
                className="block text-lg font-medium text-text-primary mb-2"
              >
                1. Choose your subject
              </label>
              <select
                id="subject-select"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                className="w-full max-w-xs px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:outline-none transition"
              >
                {AP_SUBJECTS.map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <h4 className="text-lg font-medium text-text-primary mb-2">
                2. Select time accommodations (if applicable)
              </h4>
              <div className="flex justify-center flex-wrap gap-3">
                {timeOptions.map(opt => (
                  <button
                    key={opt.value}
                    onClick={() => setTimeMultiplier(opt.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                      timeMultiplier === opt.value
                        ? "bg-primary text-white"
                        : "bg-gray-200 text-text-secondary hover:bg-gray-300"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => handleGenerateExam(selectedSubject)}
                className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg"
              >
                Generate Practice Exam
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <section id="ap-exam" className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-text-primary">
          AI-Graded Practice Exams
        </h2>
        <p className="text-md text-text-secondary max-w-2xl mx-auto mt-2">
          Take a full-length, AP-style practice exam with time accommodations
          and get instant, detailed feedback from our AI grader.
        </p>
      </div>
      <Card>{renderContent()}</Card>
    </section>
  )
}

export default PracticeExamGenerator
