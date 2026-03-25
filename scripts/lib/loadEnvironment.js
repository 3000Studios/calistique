import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'
import { repoRoot } from '../../server/services/platformPaths.js'

const ENV_FILES = ['.env.local', '.env', '.dev.vars.local', '.dev.vars']

let loadedFiles = null

export function loadEnvironment() {
  if (loadedFiles) {
    return loadedFiles
  }

  const applied = []

  for (const relativePath of ENV_FILES) {
    const absolutePath = path.join(repoRoot, relativePath)

    if (!fs.existsSync(absolutePath)) {
      continue
    }

    const result = dotenv.config({
      path: absolutePath,
      override: false,
    })

    if (!result.error) {
      applied.push(relativePath)
    }
  }

  loadedFiles = applied
  return loadedFiles
}

export function getPagesProjectName() {
  return (
    process.env.CLOUDFLARE_PAGES_PROJECT_NAME?.trim() ||
    process.env.APP_NAME?.trim() ||
    'myappai'
  )
}

export function getProductionBranch() {
  return (
    process.env.CLOUDFLARE_PAGES_BRANCH?.trim() ||
    process.env.GH_BASE_BRANCH?.trim() ||
    'main'
  )
}

loadEnvironment()
