import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
// import path from 'path'
import * as commander from 'commander'
import { PrismaClient } from '@prisma/client'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { exec } from 'child_process'

const prisma = new PrismaClient()

function getGitParameters (stdOut: string) {
  const emailRex = /(?<=email=).*/g
  const nameRex = /(?<=name=).*/g
  try {
    const email = stdOut.match(emailRex)?.[0]
    const name = stdOut.match(nameRex)?.[0]
    return email && name ? { email, name } : undefined
  } catch (e) {
    return undefined
  }
}

function createGitUser (name: string, email: string) {
  prisma.user.create({ data: { name, email } }).then((user) => {
    console.log(`Created user with name: ${user.name}`)
  }).catch((err: PrismaClientKnownRequestError) => {
    err.code === 'P2002'
      ? console.log(chalk.red.bold('User already exists: ' + name))
      : console.log(chalk.red.bold('Error creating user'))
  })
}

async function main () {
  clear()

  const program = new commander.Command()

  program.version('0.0.1')
    .description('Git User Manager: This program will try to manage multiple git accounts on your terminal. Once the program is installed it will not send any request to any site so your information will be saved on your computer.')

  program.command('sync')
    .description('Sync your current account')
    .action(() => {
      console.log('Syncing...')
      exec('git config --list', (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`)
          return
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`)
          return
        }
        const gitUser = getGitParameters(stdout)
        gitUser
          ? createGitUser(gitUser.name, gitUser.email)
          : console.log(chalk.redBright.bold('No git user found'))
      })
    })

  program.command('new-user')
    .description('Configure a new user')
    .alias('nu')
    .arguments('<username> <email>')
    .action((name, email) => {
      console.log(chalk.blue.bold(`Creating a new user: ${name} with email: ${email}`))
      createGitUser(name, email)
    })

  program.command('list-users')
    .description('List all registered users')
    .alias('lu')
    .option('-c, --complete').action((options) => {
      console.log(chalk.blue.bold('Listing all users'))
      prisma.user.findMany().then((users) => {
        users.forEach((user) => {
          options.complete
            ? console.log(chalk.yellow(`Name: ${user.name} Email: ${user.email}`))
            : console.log(chalk.yellow(user.name))
        })
      }).catch(() => {
        console.log(chalk.red.bold('Error listing users'))
      })
    })

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

main().catch((error) => {
  console.error(error)
  process.exit(1)
  throw error
}).finally(() => {
  console.log('Closing prisma connection')
  prisma.$disconnect()
})
