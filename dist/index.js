"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const body_parser_1 = tslib_1.__importDefault(require("body-parser"));
const socket_io_1 = tslib_1.__importDefault(require("socket.io"));
let text = `#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

int main()
{
    for (int i = 0; i < 10; i++) {
        printf("lol\\n");
    }
}`;
let input = "";
let inputRadio = false;
let app = express_1.default();
let connections = [];
let output = "";
const server = app.listen(process.env.PORT, function () {
    console.log('server is running on port 8080');
});
const io = socket_io_1.default(server);
io.on('connection', function (socket) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        console.log('connected');
        yield connections.push(socket);
        yield io.sockets.emit('USERS', connections.length);
        yield socket.on('SEND_MESSAGE', function (data) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                text = data.message;
                yield socket.broadcast.emit('MESSAGE', data);
            });
        });
        yield socket.on('SEND_OUTPUT', function (data) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                output = data.output;
                yield socket.broadcast.emit('OUTPUT', data);
            });
        });
        yield socket.on('SEND_INPUTRADIO', function (data) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                inputRadio = data.inputRadio;
                yield socket.broadcast.emit('INPUTRADIO', data);
            });
        });
        yield socket.on('SEND_INPUT', function (data) {
            return tslib_1.__awaiter(this, void 0, void 0, function* () {
                input = data.input;
                yield socket.broadcast.emit('INPUT', data);
            });
        });
        yield socket.on('disconnect', () => tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('disconnected');
            connections.pop();
            console.log(connections.length);
            yield io.sockets.emit('USERS', connections.length);
        }));
    });
});
app.use(body_parser_1.default());
var compiler = require('compilex');
var option = { stats: true };
compiler.init(option);
app.get('/', function (req, res) {
    res.sendFile(path_1.default.join(__dirname, '..', 'distVue', 'index.html'));
});
app.get('/coding', function (req, res) {
    res.send({ text: text, input: input, inputRadio: inputRadio, output: output });
});
app.post('/', function (req, res) {
    let lang = "C";
    let code = req.body.code;
    let input = req.body.input;
    let inputRadio = req.body.inputRadio;
    if ((lang === "C") || (lang === "C++")) {
        if (inputRadio === true) {
            var envData = { OS: "linux", cmd: "gcc" };
            compiler.compileCPPWithInput(envData, code, input, function (data) {
                if (data.error) {
                    res.send(data.error);
                }
                else {
                    res.send(data.output);
                }
            });
        }
        else {
            var envData = { OS: "linux", cmd: "gcc" };
            compiler.compileCPP(envData, code, function (data) {
                if (data.error) {
                    res.send(data.error);
                }
                else {
                    res.send(data.output);
                }
            });
        }
    }
});
app.get('/fullStat', function (req, res) {
    compiler.fullStat(function (data) {
        res.send(data);
    });
});
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'distVue')));
//# sourceMappingURL=index.js.map