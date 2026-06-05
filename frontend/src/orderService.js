import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase.js'

export async function saveOrder({ sessionId, paymentStatus, amountTotal, currency, customerEmail }) {
  if (!sessionId) return null
  try {
    const ref = await addDoc(collection(db, 'orders'), {
      sessionId,
      paymentStatus,
      amountTotal,
      currency,
      customerEmail: customerEmail ?? null,
      source: 'calistique_storefront',
      createdAt: serverTimestamp(),
    })
    return ref.id
  } catch {
    return null
  }
}
