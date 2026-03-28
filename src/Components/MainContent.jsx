// MainContent.jsx
// This is where the chat lives
// We use useState to track messages and user input

import { useState } from 'react'

function MainContent() {

  // messages = array of chat messages [{role, content}, ...]
  // each message has a role ("user" or "ai") and content (the text)
  const [messages, setMessages] = useState([])

  // inputValue = what the user is currently typing
  const [inputValue, setInputValue] = useState("")

  // isLoading = true when AI is thinking, false otherwise
  const [isLoading, setIsLoading] = useState(false)

  // This function runs when user clicks Send
  const handleSend = async () => {

    // Don't send if input is empty or AI is still responding
    if (!inputValue.trim() || isLoading) return

    // Step 1: Save the user's message and clear the input box
    const userMessage = { role: "user", content: inputValue }
    setMessages(prev => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    // Step 2: For now, simulate an AI response (we'll connect real AI next)
    setTimeout(() => {
      const aiMessage = {
        role: "ai",
        content: "I'm InsightAI! I'll be connected to Claude AI in the next step. 🚀"
      }
      // ...prev means "keep all old messages, add the new one at the end"
      setMessages(prev => [...prev, aiMessage])
      setIsLoading(false)
    }, 1000) // wait 1 second to simulate thinking
  }

  // This runs when user presses Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend()
  }

  return (
    // flex flex-col = stack everything vertically
    // flex-1 = take all remaining width after sidebar
    <div className="flex-1 flex flex-col h-screen">

      {/* Top bar */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold">💬 Chat</h2>
      </div>

      {/* Messages Area */}
      {/* flex-1 = takes all space between topbar and input */}
      {/* overflow-y-auto = scroll when messages overflow */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Show welcome message when no messages yet */}
        {messages.length === 0 && (
          <div className="text-center mt-20">
            <h2 className="text-4xl font-bold text-white mb-4">
              Welcome to InsightAI 👋
            </h2>
            <p className="text-gray-400 text-lg">
              Ask anything. Get instant AI-powered insights.
            </p>
          </div>
        )}

        {/* Loop through messages and show each one */}
        {/* messages.map goes through each message one by one */}
        {messages.map((msg, index) => (
          <div
            key={index}
            // If user message → align right. If AI → align left
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === "user"
                  ? "bg-blue-600 text-white"        // user = blue bubble
                  : "bg-gray-800 text-gray-100"     // ai = dark bubble
                }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {/* Show "thinking" animation while AI is responding */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 px-4 py-3 rounded-2xl text-gray-400 text-sm">
              InsightAI is thinking...
            </div>
          </div>
        )}

      </div>

      {/* Input Area — always stays at the bottom */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask InsightAI anything..."
            className="flex-1 bg-transparent text-white outline-none placeholder-gray-500 text-sm"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium"
          >
            Send
          </button>
        </div>
      </div>

    </div>
  )
}

export default MainContent