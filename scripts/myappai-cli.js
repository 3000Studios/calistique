#!/usr/bin/env node
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { bootstrapContent } from '../server/services/contentService.js'
import { repoRoot } from '../server/services/platformPaths.js'
import { executeRepositoryCommand } from '../api/command.js'
import {
  getPagesProjectName,
  getProductionBranch,
  loadEnvironment,
} from './lib/loadEnvironment.js'

loadEnvironment()

const PROJECT_NAME = getPagesProjectName()
const PRODUCTION_BRANCH = getProductionBranch()

function resolveExecutable(command) {
  if (process.platform !== 'win32') {
    return command
  }

  if (command === 'npm') {
    return 'npm.cmd'
  }

  if (command === 'npx') {
    return 'npx.cmd'
  }

  return command
}

function quoteWindowsArgument(value) {
  const stringValue = String(value ?? '')

  if (!stringValue) {
    return '""'
  }

  if (!/[\s"]/u.test(stringValue)) {
    return stringValue
  }

  return `"${stringValue.replace(/"/g, '\\"')}"`
}

function run(
  command,
  args,
  { allowFailure = false, env = undefined, unsetEnv = [] } = {}
) {
  const executable = resolveExecutable(command)
  const spawnConfig =
    process.platform === 'win32'
      ? {
          file: 'cmd.exe',
          args: [
            '/d',
            '/s',
            '/c',
            [executable, ...args.map(quoteWindowsArgument)].join(' '),
          ],
        }
      : {
          file: executable,
          args,
        }

  return new Promise((resolve, reject) => {
    const childEnv = env ? { ...process.env, ...env } : { ...process.env }

    for (const key of unsetEnv) {
      delete childEnv[key]
    }

    const child = spawn(spawnConfig.file, spawnConfig.args, {
      cwd: process.cwd(),
      env: childEnv,
      stdio: 'inherit',
      shell: false,
      windowsHide: true,
    })

    child.on('error', reject)
    child.on('close', (code) => {
      if (code === 0 || allowFailure) {
        resolve(code ?? 0)
        return
      }

      reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`))
    })
  })
}

function getCloudflareWriteEnv() {
  const writeToken =
    getFirstSecretValue(['CLOUDFLARE_PAGES_DEPLOY_TOKEN']) || ''

  if (!writeToken) {
    return {
      env: undefined,
      unsetEnv: [
        'CLOUDFLARE_API_TOKEN',
        'CLOUDFLARE_API_TOKEN_ALT',
        'CF_API_TOKEN',
        'CF_API_TOKEN2',
        'CLOUDFLARE_MASTER_TOKEN',
        'CLOUDFLARE_MASTERR_TOKEN',
      ],
    }
  }

  return {
    env: {
      CLOUDFLARE_API_TOKEN: writeToken,
    },
    unsetEnv: [],
  }
}

function getPrimarySecretFiles() {
  return [
    path.join(repoRoot, '.secrets', 'myappai.local.env'),
    path.join(repoRoot, '.secrets', 'shared.local.env'),
  ]
}

function readRawSecretValue(name) {
  for (const filePath of getPrimarySecretFiles()) {
    if (!fs.existsSync(filePath)) {
      continue
    }

    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/u)

    for (const line of lines) {
      if (!line || line.trim().startsWith('#')) {
        continue
      }

      const [rawKey, ...rest] = line.split('=')
      if (rawKey?.trim() !== name) {
        continue
      }

      const value = rest.join('=').trim()
      if (value) {
        return value
      }
    }
  }

  return ''
}

function getFirstSecretValue(names) {
  for (const name of names) {
    const rawFileValue = readRawSecretValue(name)
    if (rawFileValue) {
      return rawFileValue
    }

    const envValue = process.env[name]?.trim()
    if (envValue) {
      return envValue
    }
  }

  return ''
}

async function runNpmScript(scriptName) {
  await run('npm', ['run', scriptName])
}

function printHelp() {
  console.log(`MyAppAI operator CLI

Usage:
  node scripts/myappai-cli.js <command> [args]

Commands:
  doctor                Validate env, verify platform, show git and Cloudflare status
  build                 Generate SEO assets and build dist/
  deploy                Run validation, test, build, then deploy to Cloudflare Pages
  pages:deploy          Deploy the current dist/ directory to Cloudflare Pages
  pages:list            List Pages projects visible to Wrangler
  pages:create          Create the configured Pages project if it does not exist
  pages:secrets [file]  Bulk upload a local .dev.vars-style file to Pages secrets
  whoami                Show the authenticated Cloudflare identity
  command <payload>     Run JSON, @payload-file.json, or a natural-language prompt

Environment defaults:
  CLOUDFLARE_PAGES_PROJECT_NAME=${PROJECT_NAME}
  CLOUDFLARE_PAGES_BRANCH=${PRODUCTION_BRANCH}
`)
}

async function doctor() {
  console.log(
    `Using Pages project "${PROJECT_NAME}" on branch "${PRODUCTION_BRANCH}".`
  )
  await runNpmScript('validate:env')
  await runNpmScript('verify-platform')
  await run('git', ['status', '--short', '--branch'], { allowFailure: true })
  await run('npx', ['wrangler', 'whoami'], { allowFailure: true })
  await run('npx', ['wrangler', 'pages', 'project', 'list'], {
    allowFailure: true,
  })
}

async function build() {
  await runNpmScript('build')
}

async function pagesDeploy() {
  const cloudflareWriteEnv = getCloudflareWriteEnv()

  await run(
    'npx',
    [
      'wrangler',
      'pages',
      'deploy',
      'dist',
      '--project-name',
      PROJECT_NAME,
      '--commit-dirty=true',
    ],
    {
      env: cloudflareWriteEnv.env,
      unsetEnv: cloudflareWriteEnv.unsetEnv,
    }
  )
}

async function deploy() {
  await runNpmScript('validate:env')
  await runNpmScript('lint')
  await runNpmScript('typecheck')
  await runNpmScript('test')
  await runNpmScript('build')
  await pagesDeploy()
}

async function pagesCreate() {
  const cloudflareWriteEnv = getCloudflareWriteEnv()

  await run(
    'npx',
    [
      'wrangler',
      'pages',
      'project',
      'create',
      PROJECT_NAME,
      '--production-branch',
      PRODUCTION_BRANCH,
    ],
    {
      env: cloudflareWriteEnv.env,
      unsetEnv: cloudflareWriteEnv.unsetEnv,
    }
  )
}

async function pagesSecrets(file = '.dev.vars') {
  const cloudflareWriteEnv = getCloudflareWriteEnv()

  await run(
    'npx',
    [
      'wrangler',
      'pages',
      'secret',
      'bulk',
      file,
      '--project-name',
      PROJECT_NAME,
    ],
    {
      env: cloudflareWriteEnv.env,
      unsetEnv: cloudflareWriteEnv.unsetEnv,
    }
  )
}

function parseJsonPayload(raw) {
  const variants = [raw, raw.replace(/\\"/g, '"')]

  for (const candidate of variants) {
    try {
      return JSON.parse(candidate)
    } catch {
      continue
    }
  }

  return null
}

function parseCommandInput(args) {
  const raw = args.join(' ').trim()

  if (!raw) {
    return {
      action: 'homepage_update',
      page: 'homepage',
      field: 'subheadline',
      value: 'MyAppAI operator platform',
      autoDeploy: false,
    }
  }

  if (raw.startsWith('@')) {
    const filePath = raw.slice(1).trim()
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const payload = parseJsonPayload(fileContents)

    if (payload) {
      return payload
    }
  }

  const payload = parseJsonPayload(raw)

  if (payload) {
    return payload
  }

  return {
    command: raw,
  }
}

async function runOperatorCommand(args) {
  await bootstrapContent()
  const payload = parseCommandInput(args)
  const result = await executeRepositoryCommand(payload)
  console.log(JSON.stringify(result, null, 2))
}

const [subcommand = 'help', ...rest] = process.argv.slice(2)

try {
  switch (subcommand) {
    case 'doctor':
      await doctor()
      break
    case 'build':
      await build()
      break
    case 'deploy':
      await deploy()
      break
    case 'pages:deploy':
      await pagesDeploy()
      break
    case 'pages:list':
      await run('npx', ['wrangler', 'pages', 'project', 'list'])
      break
    case 'pages:create':
      await pagesCreate()
      break
    case 'pages:secrets':
      await pagesSecrets(rest[0] || '.dev.vars')
      break
    case 'whoami':
      await run('npx', ['wrangler', 'whoami'])
      break
    case 'command':
      await runOperatorCommand(rest)
      break
    case 'help':
    default:
      printHelp()
      break
  }
} catch (error) {
  console.error(error.message)
  process.exitCode = 1
}
