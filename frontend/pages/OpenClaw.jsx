import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AnimatedBackground from '../components/AnimatedBackground.jsx'
import './OpenClaw.css'

const OpenClaw = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [adminCode, setAdminCode] = useState('')
  const [adminEmail, setAdminEmail] = useState('')
  const [authError, setAuthError] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [agents, setAgents] = useState([])
  const [tasks, setTasks] = useState([])
  const [revenue, setRevenue] = useState(0)
  const [isExecuting, setIsExecuting] = useState(false)
  const [command, setCommand] = useState('')
  const [logs, setLogs] = useState([])

  useEffect(() => {
    // Check if already authenticated
    const auth = localStorage.getItem('openclaw_auth')
    if (auth) {
      setIsAuthenticated(true)
      fetchDashboardData()
    }
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [agentsRes, tasksRes, revenueRes] = await Promise.all([
        fetch('/api/openclaw/agents'),
        fetch('/api/openclaw/tasks'),
        fetch('/api/openclaw/revenue'),
      ])

      if (agentsRes.ok) {
        const agentsData = await agentsRes.json()
        setAgents(agentsData)
      }

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setTasks(tasksData)
      }

      if (revenueRes.ok) {
        const revenueData = await revenueRes.json()
        setRevenue(revenueData.daily || 0)
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    }
  }

  const handleAuthenticate = (e) => {
    e.preventDefault()

    // Validate credentials
    if (adminEmail === 'mr.jwswain@gmail.com' && adminCode === '5555') {
      setIsAuthenticated(true)
      localStorage.setItem('openclaw_auth', 'true')
      setAuthError('')
      fetchDashboardData()
    } else {
      setAuthError('Invalid credentials. Please try again.')
    }
  }

  const executeCommand = async () => {
    if (!command.trim()) return

    setIsExecuting(true)
    const timestamp = new Date().toISOString()
    const logEntry = { type: 'command', message: command, timestamp }
    setLogs((prev) => [logEntry, ...prev])

    try {
      const response = await fetch('/api/openclaw/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      })

      const result = await response.json()
      const resultEntry = {
        type: 'response',
        message: result.message || 'Command executed successfully',
        timestamp: new Date().toISOString(),
        success: response.ok,
      }
      setLogs((prev) => [resultEntry, ...prev])

      if (response.ok) {
        setCommand('')
        fetchDashboardData() // Refresh data
      }
    } catch (error) {
      const errorEntry = {
        type: 'error',
        message: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
      }
      setLogs((prev) => [errorEntry, ...prev])
    } finally {
      setIsExecuting(false)
    }
  }

  const deployWebsite = async () => {
    setIsExecuting(true)
    try {
      const response = await fetch('/api/openclaw/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })

      const result = await response.json()
      if (response.ok) {
        alert('Website deployed successfully to myappai.net!')
        fetchDashboardData()
      } else {
        alert(`Deployment failed: ${result.error}`)
      }
    } catch (error) {
      alert(`Deployment error: ${error.message}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const renderAuthentication = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="auth-container"
    >
      <div className="auth-card">
        <div className="auth-header">
          <h1>🦞 OpenClaw Control Center</h1>
          <p>Autonomous AI System Manager</p>
        </div>

        <form onSubmit={handleAuthenticate} className="auth-form">
          <div className="form-group">
            <label htmlFor="adminEmail">Admin Email</label>
            <input
              type="email"
              id="adminEmail"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="Enter admin email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="adminCode">Admin Code</label>
            <input
              type="password"
              id="adminCode"
              value={adminCode}
              onChange={(e) => setAdminCode(e.target.value)}
              placeholder="Enter admin code"
              required
            />
          </div>

          {authError && <div className="auth-error">{authError}</div>}

          <motion.button
            type="submit"
            className="auth-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Access OpenClaw
          </motion.button>
        </form>
      </div>
    </motion.div>
  )

  const renderDashboard = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard-container"
    >
      <header className="dashboard-header">
        <h1>🦞 OpenClaw Control Center</h1>
        <div className="header-stats">
          <div className="stat-card">
            <h3>${revenue.toFixed(2)}</h3>
            <p>Today's Revenue</p>
          </div>
          <div className="stat-card">
            <h3>{agents.length}</h3>
            <p>Active Agents</p>
          </div>
          <div className="stat-card">
            <h3>{tasks.filter((t) => t.status === 'active').length}</h3>
            <p>Running Tasks</p>
          </div>
        </div>
      </header>

      <div className="dashboard-tabs">
        {['dashboard', 'agents', 'tasks', 'website', 'revenue', 'logs'].map(
          (tab) => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          )
        )}
      </div>

      <div className="tab-content">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && renderDashboardTab()}
          {activeTab === 'agents' && renderAgentsTab()}
          {activeTab === 'tasks' && renderTasksTab()}
          {activeTab === 'website' && renderWebsiteTab()}
          {activeTab === 'revenue' && renderRevenueTab()}
          {activeTab === 'logs' && renderLogsTab()}
        </AnimatePresence>
      </div>
    </motion.div>
  )

  const renderDashboardTab = () => (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="tab-panel"
    >
      <div className="command-interface">
        <h2>Command Interface</h2>
        <div className="command-input-group">
          <input
            type="text"
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            placeholder="Enter OpenClaw command..."
            onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
          />
          <motion.button
            onClick={executeCommand}
            disabled={isExecuting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="execute-button"
          >
            {isExecuting ? 'Executing...' : 'Execute'}
          </motion.button>
        </div>
      </div>

      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-grid">
          <motion.button
            onClick={deployWebsite}
            disabled={isExecuting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-button"
          >
            🚀 Deploy Website
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-button"
          >
            📊 Generate Report
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-button"
          >
            🔄 Sync Agents
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="action-button"
          >
            💰 Optimize Revenue
          </motion.button>
        </div>
      </div>
    </motion.div>
  )

  const renderAgentsTab = () => (
    <motion.div
      key="agents"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="tab-panel"
    >
      <h2>Agent Management</h2>
      <div className="agents-grid">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id || index}
            className="agent-card"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3>{agent.name || `Agent ${index + 1}`}</h3>
            <p className="agent-status">{agent.status || 'Active'}</p>
            <p className="agent-type">{agent.type || 'General Purpose'}</p>
            <div className="agent-actions">
              <button className="mini-button">Configure</button>
              <button className="mini-button">Restart</button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderTasksTab = () => (
    <motion.div
      key="tasks"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="tab-panel"
    >
      <h2>Task Management</h2>
      <div className="tasks-list">
        {tasks.map((task, index) => (
          <motion.div
            key={task.id || index}
            className={`task-item ${task.status || 'pending'}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="task-info">
              <h4>{task.name || `Task ${index + 1}`}</h4>
              <p>{task.description || 'No description'}</p>
            </div>
            <div className="task-status">
              <span className={`status-badge ${task.status || 'pending'}`}>
                {task.status || 'Pending'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )

  const renderWebsiteTab = () => (
    <motion.div
      key="website"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="tab-panel"
    >
      <h2>Website Wizard</h2>
      <div className="website-controls">
        <div className="control-section">
          <h3>Live Deployment</h3>
          <p>Deploy changes directly to myappai.net</p>
          <motion.button
            onClick={deployWebsite}
            disabled={isExecuting}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="deploy-button"
          >
            {isExecuting ? 'Deploying...' : '🚀 Deploy Now'}
          </motion.button>
        </div>

        <div className="control-section">
          <h3>Site Configuration</h3>
          <div className="config-options">
            <label>
              <input type="checkbox" defaultChecked />
              Enable Auto-Deploy
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Revenue Optimization
            </label>
            <label>
              <input type="checkbox" defaultChecked />
              Performance Monitoring
            </label>
          </div>
        </div>

        <div className="control-section">
          <h3>Analytics</h3>
          <div className="analytics-grid">
            <div className="metric">
              <h4>Visitors Today</h4>
              <p>1,234</p>
            </div>
            <div className="metric">
              <h4>Conversion Rate</h4>
              <p>3.2%</p>
            </div>
            <div className="metric">
              <h4>Page Load Time</h4>
              <p>1.2s</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderRevenueTab = () => (
    <motion.div
      key="revenue"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="tab-panel"
    >
      <h2>Revenue Generation</h2>
      <div className="revenue-overview">
        <div className="revenue-card primary">
          <h3>Today's Revenue</h3>
          <p className="revenue-amount">${revenue.toFixed(2)}</p>
          <p className="revenue-goal">Goal: $1,000.00</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${Math.min((revenue / 1000) * 100, 100)}%` }}
            />
          </div>
        </div>
      </div>

      <div className="revenue-streams">
        <h3>Revenue Streams</h3>
        <div className="streams-grid">
          <div className="stream-card">
            <h4>🎯 Google AdSense</h4>
            <p>$450.00</p>
            <span className="trend positive">+12%</span>
          </div>
          <div className="stream-card">
            <h4>💳 Premium Features</h4>
            <p>$320.00</p>
            <span className="trend positive">+8%</span>
          </div>
          <div className="stream-card">
            <h4>🤖 AI Services</h4>
            <p>$180.00</p>
            <span className="trend positive">+25%</span>
          </div>
          <div className="stream-card">
            <h4>📊 Analytics Pro</h4>
            <p>$50.00</p>
            <span className="trend neutral">0%</span>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderLogsTab = () => (
    <motion.div
      key="logs"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="tab-panel"
    >
      <h2>System Logs</h2>
      <div className="logs-container">
        {logs.length === 0 ? (
          <p className="no-logs">No logs yet. Execute a command to see logs.</p>
        ) : (
          logs.map((log, index) => (
            <div key={index} className={`log-entry ${log.type}`}>
              <span className="log-timestamp">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
              <span className="log-message">{log.message}</span>
              {log.success !== undefined && (
                <span
                  className={`log-status ${log.success ? 'success' : 'error'}`}
                >
                  {log.success ? '✓' : '✗'}
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="openclaw-container">
      <AnimatedBackground />
      <AnimatePresence mode="wait">
        {isAuthenticated ? renderDashboard() : renderAuthentication()}
      </AnimatePresence>
    </div>
  )
}

export default OpenClaw
