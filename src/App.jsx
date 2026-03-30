// App.jsx
// Now manages which page is active
// useState tracks the current page — 'chat' or 'dashboard'

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import Dashboard from './components/Dashboard'

function App() {
  // activePage = which page is currently showing
  const [activePage, setActivePage] = useState('chat')

  return (
    <div className="flex h-screen bg-gray-950">

      {/* Pass activePage and setActivePage to Sidebar */}
      {/* so it knows which button to highlight */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Show Chat or Dashboard based on activePage */}
      {activePage === 'chat' && <MainContent />}
      {activePage === 'dashboard' && <Dashboard />}

    </div>
  )
}

export default App