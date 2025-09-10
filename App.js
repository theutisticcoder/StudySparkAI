import React from "react"
import Header from "./components/Header"
import AiTools from "./components/AiTools"
import PracticeExamGenerator from "./components/PracticeExamGenerator"
import ApPracticePlanner from "./components/ApPracticePlanner"
import Footer from "./components/Footer"
import "./index.css"

const App = () => {
  return (
    <div className="min-h-screen flex flex-col font-sans text-text-primary">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-2">
            Supercharge Your Learning with AI
          </h1>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Your personal AI study assistant for any subject. Get explanations,
            generate flashcards, take quizzes, and create AP exam study plans.
          </p>
        </div>

        <AiTools />

        <PracticeExamGenerator />

        <ApPracticePlanner />
      </main>
      <Footer />
    </div>
  )
}

export default App
