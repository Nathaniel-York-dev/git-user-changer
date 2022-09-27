export default class GitHelper {
    static getGitParameters(stdout: string): {
        name: string;
        email: string;
    } | null;
}
