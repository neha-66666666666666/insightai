// Sidebar.jsx
// This is the left panel of our app
// It contains the logo and navigation links

function Sidebar() {
  return (
    // h-screen = full height of the screen
    // w-64 = fixed width of 256px
    // bg-gray-900 = slightly lighter than the main dark background
    // flex flex-col = stack children vertically
    // border-r = thin line on the right side separating sidebar from main
    <div className="h-screen w-64 bg-gray-900 flex flex-col border-r border-gray-800">
      
      {/* Logo Area */}
      <div className="p-6 border-b border-gray-800">
        {/* text-xl = large text, font-bold = thick, text-blue-400 = blue color */}
        <h1 className="text-xl font-bold text-blue-400">⚡ InsightAI</h1>
        <p className="text-xs text-gray-500 mt-1">AI Analytics Dashboard</p>
      </div>

      {/* Navigation Links */}
      {/* flex-1 = takes remaining space, p-4 = padding inside */}
      <nav className="flex-1 p-4 space-y-2">

        {/* Each nav item is a button */}
        {/* w-full = full width, text-left = align text left */}
        <button className="w-full text-left px-4 py-3 rounded-lg bg-blue-600 text-white font-medium">
          💬 Chat
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          📊 Dashboard
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          📁 Projects
        </button>

        <button className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white">
          ⚙️ Settings
        </button>

      </nav>

      {/* Bottom user section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          {/* User avatar circle */}
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold">
            U
          </div>
          <div>
            <p className="text-sm text-white font-medium">User</p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Sidebar