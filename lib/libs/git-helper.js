"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GitHelper = /** @class */ (function () {
    function GitHelper() {
    }
    GitHelper.getGitParameters = function (stdout) {
        var _a, _b;
        var name = (_a = stdout.match(/user.name=(.*)/)) === null || _a === void 0 ? void 0 : _a[1];
        var email = (_b = stdout.match(/user.email=(.*)/)) === null || _b === void 0 ? void 0 : _b[1];
        return name && email ? { name: name, email: email } : null;
    };
    return GitHelper;
}());
exports.default = GitHelper;
