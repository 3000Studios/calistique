import { Router } from 'express'
import {
  getTelegramBridgeStatus,
  getPublicSiteSnapshot,
  postLeadCapture,
  postPublicAssistant,
  postSiteEvent,
  postTelegramWebhook,
} from '../controllers/publicController.js'

const router = Router()

router.get('/site', getPublicSiteSnapshot)
router.post('/events', postSiteEvent)
router.post('/leads', postLeadCapture)
router.post('/assistant', postPublicAssistant)
router.get('/telegram/status', getTelegramBridgeStatus)
router.post('/telegram/webhook', postTelegramWebhook)

export default router
