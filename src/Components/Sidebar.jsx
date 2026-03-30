// Sidebar.jsx
// Now receives activePage and setActivePage as props
// Props = data passed from parent (App.jsx) to child (Sidebar)

function Sidebar({ activePage, setActivePage }) {

  // Nav items defined as an array
  // Makes it easy to add more pages later
  const navItems = [
    { id: 'chat', label: '💬 Chat' },
    { id: 'dashboard', label: '📊 Dashboard' },
    { id: 'projects', label: '📁 Projects' },
    { id: 'settings', label: '⚙️ Settings' },
  ]

  return (
    <div className="h-screen w-64 bg-gray-900 flex flex-col border-r border-gray-800">

      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-blue-400">⚡ InsightAI</h1>
        <p className="text-xs text-gray-500 mt-1">AI Analytics Dashboard</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors
              ${activePage === item.id
                ? 'bg-blue-600 text-white'        // active = blue
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'  // inactive = gray
              }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
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