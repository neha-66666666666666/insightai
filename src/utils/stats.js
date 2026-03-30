// stats.js
// This file handles saving and reading chat statistics
// We'll use this in both MainContent and Dashboard

// Get today's date as a string like "2026-03-30"
export const getTodayKey = () => {
  return new Date().toISOString().split('T')[0]
}

// Get the last 7 days as keys
export const getLast7Days = () => {
  const days = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)
    days.push({
      key: date.toISOString().split('T')[0],
      // Short day name like "Mon", "Tue"
      label: date.toLocaleDateString('en-US', { weekday: 'short' })
    })
  }
  return days
}

// Save a new message to today's stats
export const trackMessage = () => {
  const today = getTodayKey()
  const stats = JSON.parse(localStorage.getItem('dailyStats') || '{}')

  // If no entry for today, create one
  if (!stats[today]) {
    stats[today] = { messages: 0, chats: 0 }
  }

  // Increment message count
  stats[today].messages += 1
  localStorage.setItem('dailyStats', JSON.stringify(stats))
}

// Save a new chat session to today's stats
export const trackNewChat = () => {
  const today = getTodayKey()
  const stats = JSON.parse(localStorage.getItem('dailyStats') || '{}')

  if (!stats[today]) {
    stats[today] = { messages: 0, chats: 0 }
  }

  stats[today].chats += 1
  localStorage.setItem('dailyStats', JSON.stringify(stats))
}

// Read stats for the last 7 days (for charts)
export const getWeeklyStats = () => {
  const days = getLast7Days()
  const stats = JSON.parse(localStorage.getItem('dailyStats') || '{}')

  return days.map(day => ({
    day: day.label,
    messages: stats[day.key]?.messages || 0,
    chats: stats[day.key]?.chats || 0
  }))
}

// Get total stats for KPI cards
export const getTotalStats = () => {
  const conversations = JSON.parse(localStorage.getItem('conversations') || '[]')
  const stats = JSON.parse(localStorage.getItem('dailyStats') || '{}')

  // Count total messages across all conversations
  const totalMessages = conversations.reduce((sum, conv) => {
    return sum + conv.messages.length
  }, 0)

  // Count total conversations
  const totalChats = conversations.length

  // Count active days (days with at least one message)
  const activeDays = Object.keys(stats).length

  return { totalMessages, totalChats, activeDays }
}