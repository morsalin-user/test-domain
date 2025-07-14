"use client"

import { useState, useEffect } from "react"

let showToastFunction = null

export function showToast(message, type = "info") {
  if (showToastFunction) {
    showToastFunction(message, type)
  }
}

export function Toast() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    showToastFunction = (message, type) => {
      const id = Date.now()
      setToasts((prev) => [...prev, { id, message, type }])

      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id))
      }, 5000)
    }

    return () => {
      showToastFunction = null
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          <div className="flex items-center justify-between">
            <span>{toast.message}</span>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="ml-4 text-gray-400 hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
