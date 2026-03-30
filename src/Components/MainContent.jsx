import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

function MainContent() {

  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Auto scroll to bottom when new messages arrive
  const messagesEndRef = useRef(null)
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    // Add user message
    const userMessage = { role: "user", content: inputValue }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInputValue("")
    setIsLoading(true)

    // Add empty AI message — words will fill in one by one
    setMessages(prev => [...prev, { role: "assistant", content: "" }])

    try {
      // Send to our backend server
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      // Read streaming response word by word
      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)

            if (data === '[DONE]') {
              setIsLoading(false)
              break
            }

            try {
             const parsed = JSON.parse(data)
setMessages(prev => {
  const updated = [...prev]
  // Create a NEW object instead of mutating the old one
  updated[updated.length - 1] = {
    ...updated[updated.length - 1],
    content: updated[updated.length - 1].content + parsed.text
  }
  return updated
})
              
            } catch (e) {}
          }
        }
      }

    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "❌ Error connecting to server. Is the server running?"
      }])
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend()
  }

  return (
    <div className="flex-1 flex flex-col h-screen">

      {/* Top bar */}
      <div className="p-4 border-b border-gray-800">
        <h2 className="text-white font-semibold">💬 Chat</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">

        {/* Welcome screen when no messages */}
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

        {/* Render each message */}
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {/* AI avatar */}
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold mr-2 mt-1 shrink-0">
                AI
              </div>
            )}

            <div
              className={`max-w-2xl px-4 py-3 rounded-2xl text-sm leading-relaxed
                ${msg.role === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-100"
                }`}
            >
              <ReactMarkdown>{msg.content}</ReactMarkdown>
              {/* Blinking cursor while AI is typing */}
              {msg.role === "assistant" && isLoading && index === messages.length - 1 && (
                <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse" />
              )}
            </div>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
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
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
        <p className="text-xs text-gray-600 mt-2 text-center">Press Enter to send</p>
      </div>

    </div>
  )
}

export default MainContent