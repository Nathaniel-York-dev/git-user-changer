import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
import Program from './libs/program'
// import path from 'path'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main () {
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

main().catch((error) => {
  console.error(error)
  process.exit(1)
  throw error
}).finally(() => {
  prisma.$disconnect()
})
