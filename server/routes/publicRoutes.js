import { Router } from 'express'
import {
  getOllamaProxyStatus,
  getTelegramBridgeStatus,
  getPublicSiteSnapshot,
  postPayPalCapture,
  postPayPalCheckout,
  postLeadCapture,
  postPublicAssistant,
  postStripeCheckout,
  postStripeCheckoutVerify,
  proxyOllamaRequest,
  postSiteEvent,
  postTelegramWebhook,
} from '../controllers/publicController.js'

const router = Router()

router.get('/site', getPublicSiteSnapshot)
router.post('/events', postSiteEvent)
router.post('/leads', postLeadCapture)
router.post('/commerce/checkout/stripe', postStripeCheckout)
router.post('/commerce/checkout/stripe/verify', postStripeCheckoutVerify)
router.post('/commerce/checkout/paypal', postPayPalCheckout)
router.post('/commerce/checkout/paypal/capture', postPayPalCapture)
router.post('/assistant', postPublicAssistant)
router.get('/ollama/status', getOllamaProxyStatus)
router.post('/ollama', proxyOllamaRequest)
router.post('/ollama/generate', proxyOllamaRequest)
router.post('/ollama/api/generate', proxyOllamaRequest)
router.post('/ollama/chat', proxyOllamaRequest)
router.post('/ollama/api/chat', proxyOllamaRequest)
router.get('/ollama/tags', proxyOllamaRequest)
router.get('/ollama/api/tags', proxyOllamaRequest)
router.get('/telegram/status', getTelegramBridgeStatus)
router.post('/telegram/webhook', postTelegramWebhook)

export default router
