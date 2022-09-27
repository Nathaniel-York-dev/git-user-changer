export default class GitHelper {
  public static getGitParameters (stdout: string): { name: string, email: string } | null {
    const name = stdout.match(/user.name=(.*)/)?.[1]
    const email = stdout.match(/user.email=(.*)/)?.[1]
    return name && email ? { name, email } : null
  }
}
