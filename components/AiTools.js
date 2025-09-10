import React, { useState } from "react"
import Card from "./Card"
import ConceptExplainer from "./ConceptExplainer"
import FlashcardGenerator from "./FlashcardGenerator"
import QuizMe from "./QuizMe"

const AiTools = () => {
  const [activeTool, setActiveTool] = useState("explainer")

  const toolComponents = {
    explainer: <ConceptExplainer />,
    flashcards: <FlashcardGenerator />,
    quiz: <QuizMe />
  }

  const toolInfo = {
    explainer: {
      icon: "M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      name: "Concept Explainer"
    },
    flashcards: {
      icon:
        "M3 5a2 2 0 012-2h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm14 0H5v14h14V5z",
      name: "Flashcard Generator"
    },
    quiz: {
      icon:
        "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
      name: "Quiz Me"
    }
  }

  return (
    <section id="ai-tools" className="mb-16">
      <Card>
        <div className="flex flex-col sm:flex-row justify-center items-center mb-6 border-b border-gray-200">
          {["explainer", "flashcards", "quiz"].map(tool => (
            <button
              key={tool}
              onClick={() => setActiveTool(tool)}
              className={`flex items-center space-x-2 text-lg font-semibold py-4 px-6 -mb-px transition-colors duration-300 ${
                activeTool === tool
                  ? "border-b-2 border-primary text-primary"
                  : "text-gray-500 hover:text-primary"
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={toolInfo[tool].icon}
                />
              </svg>
              <span>{toolInfo[tool].name}</span>
            </button>
          ))}
        </div>
        <div>{toolComponents[activeTool]}</div>
      </Card>
    </section>
  )
}

export default AiTools
