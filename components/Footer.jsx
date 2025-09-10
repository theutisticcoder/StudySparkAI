import React from "react"

const Footer = () => {
  return (
    <footer className="bg-white mt-12 py-6 border-t">
      <div className="container mx-auto px-4 text-center text-text-secondary">
        <p>
          &copy; {new Date().getFullYear()} Study Spark AI. All rights reserved.
        </p>
        <p className="text-sm mt-1">Powered by Google Gemini</p>
      </div>
    </footer>
  )
}

export default Footer
