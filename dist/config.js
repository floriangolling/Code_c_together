"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dotenv_1 = tslib_1.__importDefault(require("dotenv"));
dotenv_1.default.config();
const Config = {
    //Server Config
    PORT: process.env.PORT ? parseInt(process.env.PORT) : 8080,
    URL: process.env.URL || 'http://localhost',
};
exports.default = Config;
//# sourceMappingURL=config.js.map