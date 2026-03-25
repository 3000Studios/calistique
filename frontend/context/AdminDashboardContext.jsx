import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getAdminSessionState,
  getAnalytics,
  getContent,
  getDeployments,
  getRevenueQueue,
  logoutAdmin,
  sendCommand,
  updateLeadStage,
} from '../src/adminApi.js'
import { clearAdminSession, getAdminSession } from '../src/adminSession.js'

const defaultCommand = JSON.stringify(
  {
    action: 'homepage_update',
    prompt: 'Refresh the homepage copy for an operator-first SaaS audience.',
    autoDeploy: false,
  },
  null,
  2
)

const defaultPrompt =
  'Rebrand the homepage around MyAppAI as an operator platform and prepare it for deployment.'

const AdminDashboardContext = createContext(null)

export function AdminDashboardProvider({ children }) {
  const navigate = useNavigate()
  const [adminSession] = useState(() => getAdminSession())
  const [consoleMode, setConsoleMode] = useState('prompt')
  const [commandText, setCommandText] = useState(defaultCommand)
  const [naturalLanguagePrompt, setNaturalLanguagePrompt] =
    useState(defaultPrompt)
  const [analytics, setAnalytics] = useState(null)
  const [deployments, setDeployments] = useState(null)
  const [contentBundle, setContentBundle] = useState(null)
  const [revenueQueue, setRevenueQueue] = useState(null)
  const [commandBusy, setCommandBusy] = useState(false)
  const [editorBusy, setEditorBusy] = useState(false)
  const [deployBusy, setDeployBusy] = useState(false)
  const [trafficBusy, setTrafficBusy] = useState(false)
  const [lastResult, setLastResult] = useState(null)
  const [operatorHistory, setOperatorHistory] = useState([])
  const [error, setError] = useState('')
  const [initialLoadDone, setInitialLoadDone] = useState(false)

  const refreshDashboard = useCallback(
    async (activeSession = adminSession) => {
      if (!activeSession?.adminEmail) {
        return
      }

      const [nextAnalytics, nextDeployments, nextContent, nextRevenueQueue] =
        await Promise.all([
          getAnalytics(activeSession),
          getDeployments(activeSession),
          getContent(activeSession),
          getRevenueQueue(activeSession),
        ])

      setAnalytics(nextAnalytics)
      setDeployments(nextDeployments)
      setContentBundle(nextContent)
      setRevenueQueue(nextRevenueQueue)
    },
    [adminSession]
  )

  useEffect(() => {
    if (!adminSession?.adminEmail) {
      return
    }

    getAdminSessionState()
      .then(() => refreshDashboard(adminSession))
      .catch((loadError) => setError(loadError.message))
      .finally(() => setInitialLoadDone(true))
  }, [adminSession, refreshDashboard])

  const recordResult = useCallback((result) => {
    setLastResult(result)
    setOperatorHistory((current) => [result, ...current].slice(0, 8))
  }, [])

  const handleRunCommand = useCallback(async () => {
    try {
      setError('')
      setCommandBusy(true)

      const payload =
        consoleMode === 'json'
          ? JSON.parse(commandText)
          : {
              command: naturalLanguagePrompt.trim(),
              mode: 'operator',
            }

      if (consoleMode !== 'json' && !payload.command) {
        throw new Error('Enter a prompt for the operator workspace.')
      }

      const result = await sendCommand(adminSession, payload)
      recordResult(result)
      await refreshDashboard(adminSession)
    } catch (runError) {
      setError(runError.message)
    } finally {
      setCommandBusy(false)
    }
  }, [
    adminSession,
    commandText,
    consoleMode,
    naturalLanguagePrompt,
    recordResult,
    refreshDashboard,
  ])

  const handleSaveFile = useCallback(
    async (targetPath, contents) => {
      try {
        setError('')
        setEditorBusy(true)
        const result = await sendCommand(adminSession, {
          action: 'edit_workspace_file',
          targetPath,
          contents,
          autoDeploy: false,
        })
        recordResult(result)
        await refreshDashboard(adminSession)
      } catch (saveError) {
        setError(saveError.message)
      } finally {
        setEditorBusy(false)
      }
    },
    [adminSession, recordResult, refreshDashboard]
  )

  const handleDeploy = useCallback(async () => {
    try {
      setError('')
      setDeployBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'deploy_site',
        message: 'Admin-triggered deploy',
      })
      recordResult(result)
      await refreshDashboard(adminSession)
    } catch (deployError) {
      setError(deployError.message)
    } finally {
      setDeployBusy(false)
    }
  }, [adminSession, recordResult, refreshDashboard])

  const handleRefresh = useCallback(async () => {
    try {
      setError('')
      await refreshDashboard(adminSession)
    } catch (connectError) {
      setError(connectError.message)
    }
  }, [adminSession, refreshDashboard])

  const handleDiscoverTopics = useCallback(async () => {
    try {
      setError('')
      setTrafficBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'discover_topics',
        limit: 6,
      })
      recordResult(result)
      await refreshDashboard(adminSession)
    } catch (trafficError) {
      setError(trafficError.message)
    } finally {
      setTrafficBusy(false)
    }
  }, [adminSession, recordResult, refreshDashboard])

  const handleRunTrafficCycle = useCallback(async () => {
    try {
      setError('')
      setTrafficBusy(true)
      const result = await sendCommand(adminSession, {
        action: 'run_traffic_cycle',
        count: 2,
        includeImages: true,
        autoDeploy: false,
      })
      recordResult(result)
      await refreshDashboard(adminSession)
    } catch (trafficError) {
      setError(trafficError.message)
    } finally {
      setTrafficBusy(false)
    }
  }, [adminSession, recordResult, refreshDashboard])

  const handleUpdateLeadStage = useCallback(
    async (leadId, patch) => {
      try {
        setError('')
        const result = await updateLeadStage(adminSession, leadId, patch)
        recordResult(result)
        await refreshDashboard(adminSession)
      } catch (updateError) {
        setError(updateError.message)
      }
    },
    [adminSession, recordResult, refreshDashboard]
  )

  const handleSignOut = useCallback(() => {
    logoutAdmin()
      .catch(() => {})
      .finally(() => {
        clearAdminSession()
        navigate('/admin/login', { replace: true })
      })
  }, [navigate])

  const value = useMemo(
    () => ({
      adminSession,
      initialLoadDone,
      consoleMode,
      setConsoleMode,
      commandText,
      setCommandText,
      naturalLanguagePrompt,
      setNaturalLanguagePrompt,
      analytics,
      deployments,
      contentBundle,
      revenueQueue,
      commandBusy,
      editorBusy,
      deployBusy,
      trafficBusy,
      lastResult,
      operatorHistory,
      error,
      setError,
      refreshDashboard: handleRefresh,
      handleRunCommand,
      handleSaveFile,
      handleDeploy,
      handleDiscoverTopics,
      handleRunTrafficCycle,
      handleUpdateLeadStage,
      handleSignOut,
    }),
    [
      adminSession,
      initialLoadDone,
      consoleMode,
      commandText,
      naturalLanguagePrompt,
      analytics,
      deployments,
      contentBundle,
      revenueQueue,
      commandBusy,
      editorBusy,
      deployBusy,
      trafficBusy,
      lastResult,
      operatorHistory,
      error,
      handleRefresh,
      handleRunCommand,
      handleSaveFile,
      handleDeploy,
      handleDiscoverTopics,
      handleRunTrafficCycle,
      handleUpdateLeadStage,
      handleSignOut,
    ]
  )

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  )
}

export function useAdminDashboard() {
  const ctx = useContext(AdminDashboardContext)
  if (!ctx) {
    throw new Error(
      'useAdminDashboard must be used inside AdminDashboardProvider'
    )
  }
  return ctx
}
