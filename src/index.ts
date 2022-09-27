import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import Program from './libs/program'
// import path from 'path'
import { PrismaClient } from '@prisma/client'
import { exec } from 'child_process'

function mainThread () {
  const prisma = new PrismaClient()
  main(prisma).catch((error) => {
    console.error(error)
    process.exit(1)
    throw error
  }).finally(() => {
    prisma.$disconnect()
  })
}

try {
  mainThread()
} catch (error) {
  exec('prisma generate', (error, stdout, stderr) => {
    if (error) {
      console.log(`error: ${error.message}`)
      return
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`)
      return
    }
    mainThread()
  })
  console.log(error)
  process.exit(1)
}

async function main (prisma: PrismaClient): Promise<void> {
  clear()

  const cli = Program.getInstance(prisma)
  cli.run().then(
    (program) => {
      if (!process.argv.slice(2).length) {
        console.log(
          chalk.red(
            `${figlet.textSync('GUM', { horizontalLayout: 'fitted', font: 'Small' })} v0.0.1`
          )
        )
        program.outputHelp()
        return Promise.resolve(1)
      }

      program.parse(process.argv)
    }
  )
}
