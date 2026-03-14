import { Router } from 'express'
import {
  getAnalytics,
  getContent,
  getDeployments,
  postCommand
} from '../controllers/commandController.js'
import { authMiddleware } from '../middleware/authMiddleware.js'

const router = Router()

router.get('/analytics', authMiddleware, getAnalytics)
router.get('/deployments', authMiddleware, getDeployments)
router.get('/content', authMiddleware, getContent)
router.post('/command', authMiddleware, postCommand)

export default router
