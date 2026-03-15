import { Router } from 'express'
import commandApiRouter from '../../api/command.js'
import {
  getAnalytics,
  getContent,
  getDeployments,
  getMetrics,
} from '../controllers/commandController.js'
import { adminAuth } from '../middleware/adminAuth.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/analytics', authMiddleware, getAnalytics)
router.get('/deployments', authMiddleware, getDeployments)
router.get('/content', authMiddleware, getContent)
router.get('/metrics', adminAuth, getMetrics)
router.use('/command', adminAuth, commandApiRouter)

export default router
