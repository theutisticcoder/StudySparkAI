import React from "react"
import Card from "./Card"

const ExamResults = ({ exam, results, userAnswers, onRetake }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold text-primary">Your Exam Results</h3>
        <p className="text-lg text-text-secondary mt-1">AP {exam.subject}</p>
      </div>

      <Card className="bg-blue-50">
        <h4 className="text-xl font-semibold text-center mb-4">
          Overall Performance
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-lg text-text-secondary">MCQ Score</p>
            <p className="text-3xl font-bold text-primary">
              {results.mcqScore} / {results.totalMcqs}
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow">
            <p className="text-lg text-text-secondary">FRQ Average Score</p>
            <p className="text-3xl font-bold text-primary">
              {results.frqResults.length > 0
                ? `${(
                    results.frqResults.reduce((acc, r) => acc + r.score, 0) /
                    results.frqResults.length
                  ).toFixed(1)} / 9.0`
                : "N/A"}
            </p>
          </div>
        </div>
      </Card>

      <div className="space-y-6">
        <h4 className="text-2xl font-semibold text-center">
          Free-Response Question Feedback
        </h4>
        {exam.frqs.map((frq, index) => (
          <Card key={index}>
            <h5 className="text-lg font-bold mb-2">
              FRQ #{index + 1} ({frq.questionType}): AI Grader Feedback
            </h5>

            {frq.documents && frq.documents.length > 0 && (
              <div className="mb-4 p-3 bg-gray-100 border rounded-md">
                <h6 className="font-semibold text-gray-700 mb-2">
                  Question Documents
                </h6>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {frq.documents.map((doc, docIndex) => (
                    <div key={docIndex} className="p-2 border bg-white rounded">
                      <p className="text-xs font-semibold text-gray-600 italic">
                        {doc.source}
                      </p>
                      <p className="mt-1 text-xs whitespace-pre-wrap">
                        {doc.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="font-semibold text-text-primary bg-gray-100 p-3 rounded-md mb-3 whitespace-pre-wrap">
              {frq.question}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h6 className="font-semibold mb-2 text-text-secondary">
                  Your Answer
                </h6>
                <div className="p-3 bg-gray-50 border rounded-md h-64 overflow-y-auto text-sm">
                  <p className="whitespace-pre-wrap">
                    {userAnswers.frqs[index] || "No answer provided."}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h6 className="font-semibold text-text-secondary">
                    AI Feedback
                  </h6>
                  <span className="px-3 py-1 bg-primary text-white font-bold rounded-full text-sm">
                    Score: {results.frqResults[index].score}/9
                  </span>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-md h-64 overflow-y-auto text-sm">
                  <p className="whitespace-pre-wrap">
                    {results.frqResults[index].feedback}
                  </p>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center pt-4">
        <button
          onClick={onRetake}
          className="bg-primary text-white font-bold px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Take Another Exam
        </button>
      </div>
    </div>
  )
}

export default ExamResults
