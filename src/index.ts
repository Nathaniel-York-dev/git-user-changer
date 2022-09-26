import chalk from 'chalk'
import clear from 'clear'
import figlet from 'figlet'
// import path from 'path'
import * as commander from 'commander'

clear()
console.log(
  chalk.red(
    figlet.textSync('Git User Manager', { horizontalLayout: 'full' })
  )
)
const program = new commander.Command()

program.version('0.0.1')
  .description('Git User Manager: This program will try to manage multiple git accounts on your terminal. Once the program is installed it will not send any request to any site so your information will be saved on your computer.')

program.command('new-user', 'Configure a new user')
  .alias('nu')
  .arguments('<username> <email>')
  .action((name, email) => {
    console.log(`Creating new user ${name} with email ${email}`)
  })

program.parse(process.argv)
