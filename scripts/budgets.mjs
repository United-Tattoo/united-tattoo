#!/usr/bin/env node
import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'

const BUILD_STATIC_DIR = path.resolve('.vercel/output/static')

async function readPackageBudgets() {
  try {
    const pkgRaw = await fs.readFile('package.json', 'utf8')
    const pkg = JSON.parse(pkgRaw)
    return pkg.budgets || {}
  } catch (e) {
    return {}
  }
}

function getThreshold(name, fallback, pkgBudgets) {
  const envVal = process.env[name]
  if (envVal && !Number.isNaN(Number(envVal))) return Number(envVal)
  if (pkgBudgets && pkgBudgets[name] && !Number.isNaN(Number(pkgBudgets[name]))) {
    return Number(pkgBudgets[name])
  }
  return fallback
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  const files = []
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...await walk(fullPath))
    } else if (entry.isFile()) {
      const stat = await fs.stat(fullPath)
      files.push({ file: fullPath, size: stat.size })
    }
  }
  return files
}

function formatBytes(bytes) {
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let i = 0
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024
    i++
  }
  return `${size.toFixed(2)} ${units[i]}`
}

async function main() {
  const pkgBudgets = await readPackageBudgets()
  const TOTAL_STATIC_MAX_BYTES = getThreshold('TOTAL_STATIC_MAX_BYTES', 3_000_000, pkgBudgets)
  const MAX_ASSET_BYTES = getThreshold('MAX_ASSET_BYTES', 1_500_000, pkgBudgets)

  try {
    await fs.access(BUILD_STATIC_DIR)
  } catch {
    console.error(`Build output not found at ${BUILD_STATIC_DIR}. Run the build first.`)
    process.exit(2)
  }

  const files = await walk(BUILD_STATIC_DIR)
  files.sort((a, b) => b.size - a.size)
  const total = files.reduce((acc, f) => acc + f.size, 0)
  const largest = files[0] || { file: 'N/A', size: 0 }

  const lines = []
  lines.push('Static Budgets Report')
  lines.push(`Directory: ${BUILD_STATIC_DIR}`)
  lines.push(`Total size: ${total} bytes (${formatBytes(total)})`)
  lines.push(`Largest asset: ${largest.file} -> ${largest.size} bytes (${formatBytes(largest.size)})`)
  lines.push('')
  lines.push('Top 20 largest assets:')
  for (const f of files.slice(0, 20)) {
    lines.push(`${f.size.toString().padStart(10)}  ${formatBytes(f.size).padStart(10)}  ${path.relative(process.cwd(), f.file)}`)
  }

  const reportPath = path.resolve('.vercel/output/static-budgets-report.txt')
  await fs.writeFile(reportPath, lines.join('\n'))
  console.log(`Budgets report written to ${reportPath}`)

  let ok = true
  if (total > TOTAL_STATIC_MAX_BYTES) {
    console.error(`Total static size ${total} exceeds limit ${TOTAL_STATIC_MAX_BYTES}`)
    ok = false
  }
  if (largest.size > MAX_ASSET_BYTES) {
    console.error(`Largest asset ${largest.file} is ${largest.size} bytes exceeding limit ${MAX_ASSET_BYTES}`)
    ok = false
  }

  if (!ok) {
    console.error('Budget checks failed. See report for details.')
    process.exit(1)
  } else {
    console.log('Budget checks passed.')
  }
}

main().catch((err) => {
  console.error('Error computing budgets:', err)
  process.exit(1)
})

