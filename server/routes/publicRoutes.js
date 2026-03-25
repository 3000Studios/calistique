import { Router } from 'express'
import {
  getPublicSiteSnapshot,
  postLeadCapture,
  postSiteEvent,
} from '../controllers/publicController.js'

const router = Router()

router.get('/site', getPublicSiteSnapshot)
router.post('/events', postSiteEvent)
router.post('/leads', postLeadCapture)

export default router
