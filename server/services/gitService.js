import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { repoRoot } from './platformPaths.js'

const execFileAsync = promisify(execFile)

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
  return stdout.trim() || 'main'
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

export async function commitAndPush(commitMessage) {
  const status = await getGitStatus()

  if (!status) {
    return {
      status: 'skipped',
      message: 'No workspace changes to deploy.',
      branch: await getCurrentBranch()
    }
  }

  await runGit(['add', '.'])

  const commitResult = await runGit(['commit', '-m', commitMessage], { allowFailure: true })
  const branch = await getCurrentBranch()
  const pushResult = await runGit(['push', 'origin', branch], { allowFailure: true })

  return {
    status: pushResult.failed ? 'push_failed' : 'pushed',
    branch,
    commitOutput: commitResult.stdout || commitResult.stderr,
    pushOutput: pushResult.stdout || pushResult.stderr,
    pushFailed: Boolean(pushResult.failed)
  }
}
