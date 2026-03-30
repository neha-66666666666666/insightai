import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import { trackMessage, trackNewChat } from '../utils/stats'
function MainContent() {

  // Load conversations from localStorage when app starts
  // If nothing saved yet, start with empty array
  const [conversations, setConversations] = useState(() => {
    const saved = localStorage.getItem('conversations')
    return saved ? JSON.parse(saved) : []
  })

  // Currently active conversation index
  const [activeConvIndex, setActiveConvIndex] = useState(null)

  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)

  // Current messages = messages of active conversation
  const messages = activeConvIndex !== null
    ? conversations[activeConvIndex]?.messages || []
    : []

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [conversations, activeConvIndex])

  // Save conversations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('conversations', JSON.stringify(conversations))
  }, [conversations])

  // Start a brand new conversation
  const startNewConversation = () => {
    const newConv = {
      id: Date.now(),
      title: 'New Conversation',
      messages: [],
      createdAt: new Date().toLocaleTimeString()
    }
    const updated = [newConv, ...conversations]
    setConversations(updated)
    // Set active to the new one (index 0)
    setActiveConvIndex(0)
    trackNewChat()
  }

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return

    // If no active conversation, create one automatically
    let convIndex = activeConvIndex
    let currentConversations = conversations

    if (convIndex === null) {
      const newConv = {
        id: Date.now(),
        // Use first 30 chars of message as title
        title: inputValue.slice(0, 30),
        messages: [],
        createdAt: new Date().toLocaleTimeString()
      }
      currentConversations = [newConv, ...conversations]
      setConversations(currentConversations)
      convIndex = 0
      setActiveConvIndex(0)
    }

    const userMessage = { role: "user", content: inputValue }
    trackMessage()

    // Update title if it's the first message
    const updatedConvs = [...currentConversations]
    if (updatedConvs[convIndex].messages.length === 0) {
      updatedConvs[convIndex].title = inputValue.slice(0, 35)
    }

    // Add user message
    updatedConvs[convIndex] = {
      ...updatedConvs[convIndex],
      messages: [...updatedConvs[convIndex].messages, userMessage]
    }
    setConversations(updatedConvs)
    setInputValue("")
    setIsLoading(true)

    // Add empty AI message
    const withAI = [...updatedConvs]
    withAI[convIndex] = {
      ...withAI[convIndex],
      messages: [...withAI[convIndex].messages, { role: "assistant", content: "" }]
    }
    setConversations(withAI)

    try {
      const response = await fetch("http://localhost:3001/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedConvs[convIndex].messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

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
              setConversations(prev => {
                const updated = [...prev]
                const msgs = [...updated[convIndex].messages]
                msgs[msgs.length - 1] = {
                  ...msgs[msgs.length - 1],
                  content: msgs[msgs.length - 1].content + parsed.text
                }
                updated[convIndex] = { ...updated[convIndex], messages: msgs }
                return updated
              })
            } catch (e) {}
          }
        }
      }

    } catch (error) {
      console.error('Error:', error)
      setIsLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend()
  }

  return (
    <div className="flex-1 flex h-screen">

      {/* Conversations Sidebar */}
      <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col">

        {/* New Chat Button */}
        <div className="p-3 border-b border-gray-800">
          <button
            onClick={startNewConversation}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
          >
            + New Chat
          </button>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.length === 0 && (
            <p className="text-gray-500 text-xs text-center mt-4">
              No conversations yet
            </p>
          )}
          {conversations.map((conv, index) => (
            <button
              key={conv.id}
              onClick={() => setActiveConvIndex(index)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors
                ${activeConvIndex === index
                  ? 'bg-gray-700 text-white'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              {/* Conversation title */}
              <p className="truncate font-medium">{conv.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{conv.createdAt}</p>
            </button>
          ))}
        </div>

      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">

        {/* Top bar */}
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-white font-semibold">
            {activeConvIndex !== null
              ? conversations[activeConvIndex]?.title
              : '💬 Chat'
            }
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">

          {/* Welcome screen */}
          {messages.length === 0 && (
            <div className="text-center mt-20">
              <h2 className="text-4xl font-bold text-white mb-4">
                Welcome to InsightAI 👋
              </h2>
              <p className="text-gray-400 text-lg">
                Ask anything. Get instant AI-powered insights.
              </p>
              <button
                onClick={startNewConversation}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium"
              >
                Start a conversation
              </button>
            </div>
          )}

          {/* Messages list */}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
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
                {msg.role === "assistant" && isLoading && index === messages.length - 1 && (
                  <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse" />
                )}
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
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
              {isLoading ? "..." : "Send"}
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">Press Enter to send</p>
        </div>

      </div>
    </div>
  )
}

export default MainContent