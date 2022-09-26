"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var chalk_1 = __importDefault(require("chalk"));
var clear_1 = __importDefault(require("clear"));
var figlet_1 = __importDefault(require("figlet"));
// import path from 'path'
var commander = __importStar(require("commander"));
(0, clear_1.default)();
console.log(chalk_1.default.red(figlet_1.default.textSync('Git User Manager', { horizontalLayout: 'full' })));
var program = new commander.Command();
program.version('0.0.1')
    .description('Git User Manager: This program will try to manage multiple git accounts on your terminal. Once the program is installed it will not send any request to any site so your information will be saved on your computer.');
program.help();
program.command('new-user', 'Configure a new user')
    .alias('nu')
    .arguments('<username> <email>')
    .action(function (name, email) {
    console.log("Creating new user ".concat(name, " with email ").concat(email));
});
program.parse(process.argv);
