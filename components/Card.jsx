import React from "react"

const Card = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-card-bg rounded-xl shadow-lg p-6 md:p-8 transition-shadow hover:shadow-xl ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
