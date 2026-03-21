import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { repoRoot } from './platformPaths.js'

const execFileAsync = promisify(execFile)
const DEFAULT_BASE_BRANCH = process.env.GH_BASE_BRANCH?.trim() || 'main'

function normalizePathSpec(targetPath) {
  return String(targetPath ?? '').replaceAll('\\', '/').trim()
}

function buildStatusArgs(paths = []) {
  const normalizedPaths = paths.map(normalizePathSpec).filter(Boolean)
  return normalizedPaths.length ? ['status', '--short', '--', ...normalizedPaths] : ['status', '--short']
}

async function runGit(args, { allowFailure = false } = {}) {
  try {
    return await execFileAsync('git', args, {
      cwd: repoRoot,
      windowsHide: true
    })
  } catch (error) {
    if (allowFailure) {
      return {
        stdout: error.stdout ?? '',
        stderr: error.stderr ?? error.message,
        failed: true
      }
    }

    throw error
  }
}

export async function getGitStatus() {
  const { stdout } = await runGit(['status', '--short'])
  return stdout.trim()
}

export async function getCurrentBranch() {
  const { stdout } = await runGit(['branch', '--show-current'])
  return stdout.trim() || DEFAULT_BASE_BRANCH
}

export async function getRecentCommits(limit = 5) {
  const { stdout } = await runGit([
    'log',
    `--max-count=${limit}`,
    '--pretty=format:%H|%h|%an|%ad|%s',
    '--date=iso'
  ])

  if (!stdout.trim()) {
    return []
  }

  return stdout
    .trim()
    .split('\n')
    .map((line) => {
      const [sha, shortSha, author, committedAt, subject] = line.split('|')
      return { sha, shortSha, author, committedAt, subject }
    })
}

export async function commitAndPush(commitMessage, paths = []) {
  const normalizedPaths = [...new Set(paths.map(normalizePathSpec).filter(Boolean))]
  const { stdout: statusOutput } = await runGit(buildStatusArgs(normalizedPaths))
  const status = statusOutput.trim()
  const branch = DEFAULT_BASE_BRANCH || (await getCurrentBranch())

  if (!status) {
    return {
      status: 'skipped',
      message: 'No workspace changes to deploy.',
      branch
    }
  }

  if (normalizedPaths.length) {
    await runGit(['add', '--', ...normalizedPaths])
  } else {
    await runGit(['add', '.'])
  }

  const commitArgs = normalizedPaths.length
    ? ['commit', '--only', '-m', commitMessage, '--', ...normalizedPaths]
    : ['commit', '-m', commitMessage]
  const commitResult = await runGit(commitArgs, { allowFailure: true })
  const pushResult = await runGit(['push', 'origin', `HEAD:${branch}`], { allowFailure: true })

  return {
    status: pushResult.failed ? 'push_failed' : 'pushed',
    branch,
    commitOutput: commitResult.stdout || commitResult.stderr,
    pushOutput: pushResult.stdout || pushResult.stderr,
    pushFailed: Boolean(pushResult.failed)
  }
}
