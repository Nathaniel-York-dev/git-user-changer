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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var commander = __importStar(require("commander"));
var child_process_1 = require("child_process");
var chalk_1 = __importDefault(require("chalk"));
var git_helper_1 = __importDefault(require("./git-helper"));
var Program = /** @class */ (function () {
    function Program(prisma) {
        this.cli = new commander.Command();
        this.prisma = prisma;
    }
    Program.getInstance = function (prisma) {
        if (!Program._instance) {
            Program._instance = new Program(prisma);
        }
        return Program._instance;
    };
    Program.prototype.run = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.cli.version('0.0.1')
                    .description('Git User Manager: This program will try to manage multiple git accounts on your terminal. Once the program is installed it will not send any request to any site so your information will be saved on your computer.');
                this.registerSync();
                this.registerNewUser();
                this.registerListUsers();
                this.registerDeleteUser();
                this.registerUse();
                return [2 /*return*/, this.cli];
            });
        });
    };
    Program.prototype.registerSync = function () {
        var _this = this;
        this.cli.command('sync')
            .description('Sync your current account')
            .action(function () {
            console.log(chalk_1.default.blue.bold('Syncing your current account'));
            (0, child_process_1.exec)('git config --list', function (error, stdout, stderr) {
                if (error) {
                    console.log("error: ".concat(error.message));
                    return;
                }
                if (stderr) {
                    console.log("stderr: ".concat(stderr));
                    return;
                }
                var gitUser = git_helper_1.default.getGitParameters(stdout);
                gitUser
                    ? _this.createGitUser(gitUser.name, gitUser.email)
                    : console.log(chalk_1.default.redBright.bold('No git user found'));
            });
        });
    };
    Program.prototype.registerNewUser = function () {
        var _this = this;
        this.cli.command('new-user')
            .description('Configure a new user')
            .alias('nu')
            .arguments('<username> <email>')
            .action(function (name, email) {
            console.log(chalk_1.default.blue.bold("Creating a new user: ".concat(name, " with email: ").concat(email)));
            _this.createGitUser(name, email);
        });
    };
    Program.prototype.registerListUsers = function () {
        var _this = this;
        this.cli.command('list-users')
            .description('List all registered users')
            .alias('lu')
            .option('-c, --complete').action(function (options) {
            console.log(chalk_1.default.blue.bold('Listing all users'));
            _this.prisma.user.findMany().then(function (users) {
                users.forEach(function (user) {
                    options.complete
                        ? console.log(chalk_1.default.yellow("Name: ".concat(user.name, " Email: ").concat(user.email)))
                        : console.log(chalk_1.default.yellow(user.name));
                });
            }).catch(function () {
                console.log(chalk_1.default.red.bold('Error listing users'));
            });
        });
    };
    Program.prototype.registerDeleteUser = function () {
        var _this = this;
        this.cli.command('delete-user')
            .description('delete configuration of a user')
            .alias('du')
            .arguments('<name>')
            .action(function (name) {
            console.log(chalk_1.default.blue.bold("Deleting user: ".concat(name)));
            _this.deleteGitUser(name);
        });
    };
    Program.prototype.registerUse = function () {
        var _this = this;
        this.cli.command('use')
            .description('Use a user')
            .alias('u')
            .arguments('<name>')
            .action(function (name) {
            console.log(chalk_1.default.blue.bold("Using user: ".concat(name)));
            _this.useGitUser(name);
        });
    };
    Program.prototype.createGitUser = function (name, email) {
        this.prisma.user.create({ data: { name: name, email: email } }).then(function (user) {
            console.log(chalk_1.default.green.bold("Created user with name: ".concat(user.name)));
        }).catch(function (err) {
            err.code === 'P2002'
                ? console.log(chalk_1.default.red.bold('User already exists: ' + name))
                : console.log(chalk_1.default.red.bold('Error creating user'));
        });
    };
    Program.prototype.deleteGitUser = function (name) {
        this.prisma.user.delete({ where: { name: name } }).then(function (user) {
            console.log(chalk_1.default.green.bold("Deleted user with name: ".concat(user.name)));
        }).catch(function (err) {
            err.code === 'P2025'
                ? console.log(chalk_1.default.red.bold('User does not exist: ' + name))
                : console.log(chalk_1.default.red.bold('Error deleting user'));
        });
    };
    Program.prototype.useGitUser = function (name) {
        this.prisma.user.findUnique({ where: { name: name } }).then(function (user) {
            if (user) {
                (0, child_process_1.exec)("git config --global user.name ".concat(user.name), function (error, stdout, stderr) {
                    if (error) {
                        console.log("error: ".concat(error.message));
                        return;
                    }
                    if (stderr) {
                        console.log("stderr: ".concat(stderr));
                        return;
                    }
                    console.log(chalk_1.default.green.bold("Using user with name: ".concat(user.name)));
                    (0, child_process_1.exec)("git config --global user.email ".concat(user.email), function (error, stdout, stderr) {
                        if (error) {
                            console.log("error: ".concat(error.message));
                            return;
                        }
                        if (stderr) {
                            console.log("stderr: ".concat(stderr));
                            return;
                        }
                        console.log(chalk_1.default.green.bold("Using user with email: ".concat(user.email)));
                    });
                });
            }
            else {
                console.log(chalk_1.default.red.bold('User does not exist: ' + name));
            }
        }).catch(function (err) {
            err.code === 'P2025'
                ? console.log(chalk_1.default.red.bold('User does not exist: ' + name))
                : console.log(chalk_1.default.red.bold('Error using user'));
        });
    };
    return Program;
}());
exports.default = Program;
