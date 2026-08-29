import { spawn } from 'node:child_process'
import { fileURLToPath } from 'node:url'

const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'

const applications = [
  {
    name: 'backend',
    directory: fileURLToPath(new URL('../server', import.meta.url)),
  },
  {
    name: 'frontend',
    directory: fileURLToPath(new URL('../frontend', import.meta.url)),
  },
]

const processes = applications.map(({ name, directory }) => {
  const child = spawn(npmCommand, ['run', 'dev'], {
    cwd: directory,
    stdio: 'inherit',
  })

  child.on('error', (error) => {
    console.error(`Не удалось запустить ${name}:`, error.message)
  })

  return child
})

let shuttingDown = false
let finalExitCode = 0

function allProcessesStopped() {
  return processes.every(
    (child) => child.exitCode !== null || child.signalCode !== null,
  )
}

function stopAll(signal = 'SIGTERM', exitCode = 0) {
  if (shuttingDown) return

  shuttingDown = true
  finalExitCode = exitCode

  for (const child of processes) {
    if (child.exitCode === null && child.signalCode === null) {
      child.kill(signal)
    }
  }
}

for (const [index, child] of processes.entries()) {
  child.on('exit', (code, signal) => {
    if (!shuttingDown) {
      const application = applications[index]
      const reason = signal ? `сигнал ${signal}` : `код ${code ?? 1}`

      console.error(`${application.name} остановлен: ${reason}`)
      stopAll('SIGTERM', code ?? 1)
    }

    if (allProcessesStopped()) {
      process.exit(finalExitCode)
    }
  })
}

process.on('SIGINT', () => stopAll('SIGINT'))
process.on('SIGTERM', () => stopAll('SIGTERM'))
