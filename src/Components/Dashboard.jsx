// Dashboard.jsx
// This is the analytics dashboard page
// Recharts gives us chart components just like React components

import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'

// --- FAKE DATA (we'll connect real data later) ---

// Data for the line chart — chat activity over 7 days
const weeklyData = [
  { day: 'Mon', chats: 4 },
  { day: 'Tue', chats: 7 },
  { day: 'Wed', chats: 3 },
  { day: 'Thu', chats: 9 },
  { day: 'Fri', chats: 12 },
  { day: 'Sat', chats: 6 },
  { day: 'Sun', chats: 8 },
]

// Data for the bar chart — messages sent per day
const messageData = [
  { day: 'Mon', messages: 12 },
  { day: 'Tue', messages: 23 },
  { day: 'Wed', messages: 8 },
  { day: 'Thu', messages: 31 },
  { day: 'Fri', messages: 45 },
  { day: 'Sat', messages: 19 },
  { day: 'Sun', messages: 27 },
]

// KPI cards data — the 4 stat boxes at the top
const stats = [
  { label: 'Total Chats', value: '49', change: '+12%', color: 'text-blue-400' },
  { label: 'Messages Sent', value: '165', change: '+8%', color: 'text-green-400' },
  { label: 'Avg Response', value: '1.2s', change: '-0.3s', color: 'text-purple-400' },
  { label: 'Active Days', value: '7', change: '100%', color: 'text-yellow-400' },
]

function Dashboard() {
  return (
    // overflow-y-auto = scroll if content is too tall
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">📊 Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">Your AI usage analytics at a glance</p>
      </div>

      {/* KPI Cards — 4 boxes at the top */}
      {/* grid = CSS grid layout */}
      {/* grid-cols-4 = 4 equal columns */}
      {/* gap-4 = space between cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-2xl p-5 border border-gray-800"
          >
            {/* Stat value — big number */}
            <p className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            {/* Stat label */}
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
            {/* Change indicator */}
            <p className="text-green-400 text-xs mt-2">{stat.change} this week</p>
          </div>
        ))}
      </div>

      {/* Charts Row — 2 charts side by side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Line Chart — Chat Activity */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h2 className="text-white font-semibold mb-4">Chat Activity</h2>

          {/* ResponsiveContainer makes chart fill its parent width */}
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>

              {/* Grid lines in the background */}
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

              {/* X axis = days of week */}
              <XAxis
                dataKey="day"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />

              {/* Y axis = number of chats */}
              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />

              {/* Tooltip = popup when you hover */}
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />

              {/* The actual line */}
              <Line
                type="monotone"
                dataKey="chats"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
              />

            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart — Messages Per Day */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h2 className="text-white font-semibold mb-4">Messages Per Day</h2>

          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={messageData}>

              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />

              <XAxis
                dataKey="day"
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />

              <YAxis
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF', fontSize: 12 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />

              {/* The bars */}
              <Bar dataKey="messages" fill="#8B5CF6" radius={[4, 4, 0, 0]} />

            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Recent Activity Section */}
      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
        <h2 className="text-white font-semibold mb-4">Recent Conversations</h2>

        {/* List of recent chats */}
        <div className="space-y-3">
          {[
            { title: 'Explain React hooks', time: '2 mins ago', messages: 8 },
            { title: 'Help with JavaScript arrays', time: '1 hour ago', messages: 12 },
            { title: 'What is an API?', time: '3 hours ago', messages: 5 },
            { title: 'Build a todo app', time: 'Yesterday', messages: 23 },
          ].map((chat, index) => (
            <div
              key={index}
              className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                {/* Chat icon */}
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-sm">
                  💬
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{chat.title}</p>
                  <p className="text-gray-500 text-xs">{chat.time}</p>
                </div>
              </div>
              {/* Message count badge */}
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                {chat.messages} messages
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard