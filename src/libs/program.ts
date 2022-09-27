import { PrismaClient } from '@prisma/client'
import * as commander from 'commander'
import { exec, execSync } from 'child_process'
import chalk from 'chalk'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import GitHelper from './git-helper'

export default class Program {
  // eslint-disable-next-line no-use-before-define
  public static _instance: Program
  private prisma!: PrismaClient
  private cli: commander.Command = new commander.Command()

  private constructor (prisma: PrismaClient) {
    this.prisma = prisma
  }

  public static getInstance (prisma: PrismaClient): Program {
    if (!Program._instance) {
      Program._instance = new Program(prisma)
    }
    return Program._instance
  }

  public async run (): Promise<commander.Command> {
    this.cli.version('0.0.1')
      .description('Git User Manager: This program will try to manage multiple git accounts on your terminal. Once the program is installed it will not send any request to any site so your information will be saved on your computer.')
    this.registerSync()
    this.registerNewUser()
    this.registerListUsers()
    this.registerDeleteUser()
    this.registerUse()
    return this.cli
  }

  private registerSync (): void {
    this.cli.command('sync')
      .description('Sync your current account')
      .action(() => {
        console.log(chalk.blue.bold('Syncing your current account'))
        exec('git config --list', (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`)
            return
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
          }
          const gitUser = GitHelper.getGitParameters(stdout)
          gitUser
            ? this.createGitUser(gitUser.name, gitUser.email)
            : console.log(chalk.redBright.bold('No git user found'))
        })
      })
  }

  private registerNewUser (): void {
    this.cli.command('new-user')
      .description('Configure a new user')
      .alias('nu')
      .arguments('<username> <email>')
      .action((name, email) => {
        console.log(chalk.blue.bold(`Creating a new user: ${name} with email: ${email}`))
        this.createGitUser(name, email)
      })
  }

  private registerListUsers (): void {
    this.cli.command('list-users')
      .description('List all registered users')
      .alias('lu')
      .option('-c, --complete').action((options) => {
        console.log(chalk.blue.bold('Listing all users'))
        this.prisma.user.findMany().then((users) => {
          users.forEach((user) => {
            options.complete
              ? console.log(chalk.yellow(`Name: ${user.name} Email: ${user.email}`))
              : console.log(chalk.yellow(user.name))
          })
        }).catch(() => {
          console.log(chalk.red.bold('Error listing users'))
        })
      })
  }

  private registerDeleteUser (): void {
    this.cli.command('delete-user')
      .description('delete configuration of a user')
      .alias('du')
      .arguments('<name>')
      .action((name) => {
        console.log(chalk.blue.bold(`Deleting user: ${name}`))
        this.deleteGitUser(name)
      })
  }

  private registerUse (): void {
    this.cli.command('use')
      .description('Use a user')
      .alias('u')
      .arguments('<name>')
      .action((name) => {
        console.log(chalk.blue.bold(`Using user: ${name}`))
        this.useGitUser(name)
      })
  }

  private createGitUser (name: string, email: string) {
    this.prisma.user.create({ data: { name, email } }).then((user) => {
      console.log(chalk.green.bold(`Created user with name: ${user.name}`))
    }).catch((err: PrismaClientKnownRequestError) => {
      err.code === 'P2002'
        ? console.log(chalk.red.bold('User already exists: ' + name))
        : console.log(chalk.red.bold('Error creating user'))
    })
  }

  private deleteGitUser (name: string) {
    this.prisma.user.delete({ where: { name } }).then((user) => {
      console.log(chalk.green.bold(`Deleted user with name: ${user.name}`))
    }).catch((err: PrismaClientKnownRequestError) => {
      err.code === 'P2025'
        ? console.log(chalk.red.bold('User does not exist: ' + name))
        : console.log(chalk.red.bold('Error deleting user'))
    })
  }

  private useGitUser (name: string) {
    this.prisma.user.findUnique({ where: { name } }).then((user) => {
      if (user) {
        exec(`git config --global user.name ${user.name}`, (error, stdout, stderr) => {
          if (error) {
            console.log(`error: ${error.message}`)
            return
          }
          if (stderr) {
            console.log(`stderr: ${stderr}`)
            return
          }
          console.log(chalk.green.bold(`Using user with name: ${user.name}`))
          exec(`git config --global user.email ${user.email}`, (error, stdout, stderr) => {
            if (error) {
              console.log(`error: ${error.message}`)
              return
            }
            if (stderr) {
              console.log(`stderr: ${stderr}`)
              return
            }
            console.log(chalk.green.bold(`Using user with email: ${user.email}`))
          })
        })
      } else {
        console.log(chalk.red.bold('User does not exist: ' + name))
      }
    }).catch((err: PrismaClientKnownRequestError) => {
      err.code === 'P2025'
        ? console.log(chalk.red.bold('User does not exist: ' + name))
        : console.log(chalk.red.bold('Error using user'))
    })
  }
}
