// MainContent.jsx
// This is the right side of our app
// For now it shows a placeholder — we'll add chat here next

function MainContent() {
  return (
    // flex-1 = takes all remaining space after sidebar
    // p-8 = padding inside
    // flex flex-col = stack children vertically
    <div className="flex-1 p-8 flex flex-col items-center justify-center">
      
      {/* Placeholder content */}
      <div className="text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          Welcome to InsightAI 👋
        </h2>
        <p className="text-gray-400 text-lg">
          Ask anything. Get instant AI-powered insights.
        </p>

        {/* A simple input box placeholder */}
        <div className="mt-8 w-full max-w-2xl">
          <div className="bg-gray-800 rounded-2xl p-4 flex items-center gap-3 border border-gray-700">
            <input
              type="text"
              placeholder="Ask InsightAI anything..."
              className="flex-1 bg-transparent text-white outline-none placeholder-gray-500"
            />
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium">
              Send
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MainContent