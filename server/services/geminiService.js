import { GoogleGenerativeAI } from '@google/generative-ai'
import { runBrowserPlan } from './browserAutomationService.js'

function isConfiguredValue(value) {
  const normalized = String(value ?? '').trim()
  return (
    normalized.length > 0 &&
    !normalized.startsWith('your-') &&
    !normalized.startsWith('replace-with-')
  )
}

function getGeminiApiKey() {
  return String(process.env.GEMINI_API_KEY ?? '').trim()
}

function getDefaultModel() {
  return String(process.env.GEMINI_MODEL ?? '').trim() || 'gemini-1.5-flash'
}

export async function generateGeminiText({
  prompt,
  model = undefined,
  systemInstruction = undefined,
} = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('A prompt is required.')
  }

  const apiKey = getGeminiApiKey()
  if (!isConfiguredValue(apiKey)) {
    throw new Error('GEMINI_API_KEY is not configured on this server.')
  }

  const resolvedModel =
    typeof model === 'string' && model.trim() ? model.trim() : getDefaultModel()

  const client = new GoogleGenerativeAI(apiKey)
  const generativeModel = client.getGenerativeModel(
    systemInstruction &&
      typeof systemInstruction === 'string' &&
      systemInstruction.trim()
      ? { model: resolvedModel, systemInstruction: systemInstruction.trim() }
      : { model: resolvedModel }
  )

  const result = await generativeModel.generateContent(prompt.trim())
  const response = await result.response
  const text = response.text()

  return {
    ok: true,
    model: resolvedModel,
    text: String(text ?? '').trim(),
  }
}

export async function streamGeminiText(
  { prompt, model = undefined, systemInstruction = undefined } = {},
  onChunk
) {
  if (typeof onChunk !== 'function') {
    throw new Error('A stream callback is required.')
  }

  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('A prompt is required.')
  }

  const apiKey = getGeminiApiKey()
  if (!isConfiguredValue(apiKey)) {
    throw new Error('GEMINI_API_KEY is not configured on this server.')
  }

  const resolvedModel =
    typeof model === 'string' && model.trim() ? model.trim() : getDefaultModel()

  const client = new GoogleGenerativeAI(apiKey)
  const generativeModel = client.getGenerativeModel(
    systemInstruction &&
      typeof systemInstruction === 'string' &&
      systemInstruction.trim()
      ? { model: resolvedModel, systemInstruction: systemInstruction.trim() }
      : { model: resolvedModel }
  )

  const stream = await generativeModel.generateContentStream(prompt.trim())
  for await (const chunk of stream.stream) {
    onChunk(String(chunk.text() ?? ''))
  }

  return {
    ok: true,
    model: resolvedModel,
  }
}

function parseJsonPayload(rawText) {
  if (typeof rawText !== 'string') {
    return null
  }

  const trimmed = rawText.trim()
  const candidates = [trimmed]
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i)
  if (fencedMatch?.[1]) {
    candidates.push(fencedMatch[1].trim())
  }

  const start = trimmed.indexOf('{')
  const end = trimmed.lastIndexOf('}')
  if (start !== -1 && end > start) {
    candidates.push(trimmed.slice(start, end + 1))
  }

  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate)
    } catch {
      continue
    }
  }

  return null
}

export async function runGeminiBrowserControl({
  prompt,
  url = '',
  model = undefined,
} = {}) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    throw new Error('A browser prompt is required.')
  }

  const plannerPrompt = `You are a browser control planner. Return JSON only.
Shape:
{
  "actions": [
    { "type": "goto", "url": "https://example.com" },
    { "type": "click", "selector": "button" },
    { "type": "type", "selector": "input", "value": "text" },
    { "type": "press", "selector": "body", "key": "Enter" },
    { "type": "wait", "timeoutMs": 1000 },
    { "type": "extract_text", "selector": "body" },
    { "type": "screenshot" }
  ],
  "outputPath": "C:/GPT/workspace/browser.png"
}

Rules:
- Use only the listed actions.
- Prefer the smallest workable plan.
- If the task is ambiguous, use goto and extract_text.
- Never request shell access or system control.

Current URL: ${String(url ?? '').trim() || 'none'}
User request: ${prompt.trim()}`

  const plan = await generateGeminiText({ prompt: plannerPrompt, model })
  const parsed = parseJsonPayload(plan.text)

  if (!parsed || !Array.isArray(parsed.actions)) {
    throw new Error('Gemini returned an invalid browser plan.')
  }

  const execution = await runBrowserPlan({
    url,
    actions: parsed.actions,
    outputPath:
      typeof parsed.outputPath === 'string' && parsed.outputPath.trim()
        ? parsed.outputPath.trim()
        : undefined,
  })

  return {
    ok: true,
    model: plan.model,
    plan: parsed,
    execution,
  }
}
