import { Router } from 'express'
import {
  getPayPalCheckoutSuccess,
  getPublicSiteSnapshot,
  getStripeCheckoutSuccess,
  postAssistantMessage,
  postLeadCapture,
  postPayPalCheckout,
  postSiteEvent,
  postStripeCheckout
} from '../controllers/publicController.js'

const router = Router()

router.get('/site', getPublicSiteSnapshot)
router.post('/events', postSiteEvent)
router.post('/leads', postLeadCapture)
router.post('/assistant', postAssistantMessage)
router.post('/checkout/stripe', postStripeCheckout)
router.post('/checkout/paypal', postPayPalCheckout)
router.get('/checkout/stripe/success', getStripeCheckoutSuccess)
router.get('/checkout/paypal/capture', getPayPalCheckoutSuccess)

export default router
