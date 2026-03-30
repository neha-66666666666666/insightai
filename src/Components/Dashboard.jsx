// Dashboard.jsx
// Now shows REAL data from localStorage

import { useState, useEffect } from 'react'
import {
  LineChart, Line,
  BarChart, Bar,
  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import { getWeeklyStats, getTotalStats } from '../utils/stats'

function Dashboard() {

  // Load real stats from localStorage
  const [weeklyData, setWeeklyData] = useState([])
  const [totalStats, setTotalStats] = useState({
    totalMessages: 0,
    totalChats: 0,
    activeDays: 0
  })
  const [recentConversations, setRecentConversations] = useState([])

  // Load data when Dashboard mounts
  useEffect(() => {
    // Get weekly chart data
    setWeeklyData(getWeeklyStats())

    // Get total stats for KPI cards
    setTotalStats(getTotalStats())

    // Get recent conversations from localStorage
    const saved = JSON.parse(localStorage.getItem('conversations') || '[]')
    setRecentConversations(saved.slice(0, 5)) // show last 5
  }, [])

  // KPI cards using real data
  const stats = [
    {
      label: 'Total Chats',
      value: totalStats.totalChats.toString(),
      color: 'text-blue-400',
      icon: '💬'
    },
    {
      label: 'Messages Sent',
      value: totalStats.totalMessages.toString(),
      color: 'text-green-400',
      icon: '📨'
    },
    {
      label: 'Active Days',
      value: totalStats.activeDays.toString(),
      color: 'text-purple-400',
      icon: '📅'
    },
    {
      label: 'Avg per Chat',
      value: totalStats.totalChats > 0
        ? Math.round(totalStats.totalMessages / totalStats.totalChats).toString()
        : '0',
      color: 'text-yellow-400',
      icon: '📊'
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">

      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold text-white">📊 Dashboard</h1>
        <p className="text-gray-400 text-sm mt-1">
          Your real AI usage analytics
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 rounded-2xl p-5 border border-gray-800"
          >
            <p className="text-2xl mb-2">{stat.icon}</p>
            <p className={`text-3xl font-bold ${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Messages Chart */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h2 className="text-white font-semibold mb-1">Messages This Week</h2>
          <p className="text-gray-500 text-xs mb-4">Real data from your chats</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Bar dataKey="messages" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chats Chart */}
        <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
          <h2 className="text-white font-semibold mb-1">Chats This Week</h2>
          <p className="text-gray-500 text-xs mb-4">Number of conversations started</p>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="day" stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#fff'
                }}
              />
              <Line
                type="monotone"
                dataKey="chats"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={{ fill: '#8B5CF6', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Recent Conversations — REAL DATA */}
      <div className="bg-gray-900 rounded-2xl p-5 border border-gray-800">
        <h2 className="text-white font-semibold mb-4">Recent Conversations</h2>

        {recentConversations.length === 0 && (
          <p className="text-gray-500 text-sm">
            No conversations yet — start chatting!
          </p>
        )}

        <div className="space-y-3">
          {recentConversations.map((conv, index) => (
            <div
              key={conv.id}
              className="flex items-center justify-between py-3 border-b border-gray-800 last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center text-sm">
                  💬
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{conv.title}</p>
                  <p className="text-gray-500 text-xs">{conv.createdAt}</p>
                </div>
              </div>
              <span className="text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded-full">
                {conv.messages.length} messages
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

export default Dashboard