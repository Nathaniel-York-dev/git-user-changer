import { PrismaClient } from '@prisma/client';
import * as commander from 'commander';
export default class Program {
    static _instance: Program;
    private prisma;
    private cli;
    private constructor();
    static getInstance(prisma: PrismaClient): Program;
    run(): Promise<commander.Command>;
    private registerSync;
    private registerNewUser;
    private registerListUsers;
    private registerDeleteUser;
    private registerUse;
    private createGitUser;
    private deleteGitUser;
    private useGitUser;
}
