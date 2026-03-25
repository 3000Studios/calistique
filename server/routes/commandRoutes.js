import { Router } from 'express'
import commandApiRouter from '../../api/command.js'
import {
  getAnalytics,
  getContent,
  getDeployments,
  getLogs,
  getMetrics,
  getRevenueQueue,
  patchLeadStage,
} from '../controllers/commandController.js'
import { adminAuth } from '../middleware/adminAuth.js'
import {
  getSecureLogsSnapshot,
  postClientLog,
  postSelfHealRun,
} from '../controllers/logController.js'

const router = Router()

router.get('/analytics', adminAuth, getAnalytics)
router.get('/deployments', adminAuth, getDeployments)
router.get('/content', adminAuth, getContent)
router.get('/logs', adminAuth, getLogs)
router.get('/logs/secure', adminAuth, getSecureLogsSnapshot)
router.post('/logs/client', adminAuth, postClientLog)
router.get('/metrics', adminAuth, getMetrics)
router.post('/heal', adminAuth, postSelfHealRun)
router.get('/revenue', adminAuth, getRevenueQueue)
router.patch('/revenue/leads/:id', adminAuth, patchLeadStage)
router.use('/command', adminAuth, commandApiRouter)

export default router
