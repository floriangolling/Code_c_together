import express, {Response, Request} from 'express'
import path from 'path'
import Config from './config';
import bodyParser from 'body-parser'
import socket from 'socket.io';
let text = `#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>

int main()
{
    for (int i = 0; i < 10; i++) {
        printf("lol\\n");
    }
}`

let input = ""
let inputRadio = false
let app = express();
let connections = [] as any;
let output = ""

const server = app.listen(8080, function() {
	console.log('server is running on port 8080')
})

const io = socket(server);

io.on('connection', async function (socket:any) {
	console.log('connected');
	await connections.push(socket);
	await io.sockets.emit('USERS', connections.length);

	await socket.on('SEND_MESSAGE', async function(data: any) {
		text = data.message
		await socket.broadcast.emit('MESSAGE', data);
	})
	await socket.on('SEND_OUTPUT', async function(data: any) {
		output = data.output
		await socket.broadcast.emit('OUTPUT', data);
	})
	await socket.on('SEND_INPUTRADIO', async function(data: any) {
		inputRadio = data.inputRadio
		await socket.broadcast.emit('INPUTRADIO', data);
	})
	await socket.on('SEND_INPUT', async function(data: any) {
		input = data.input
		await socket.broadcast.emit('INPUT', data);
	})
	await socket.on('disconnect', async () =>  {
		console.log('disconnected');
		connections.pop();
		console.log(connections.length);
		await io.sockets.emit('USERS', connections.length);
	})
})

app.use(bodyParser());

var compiler = require('compilex');
var option = {stats : true};
compiler.init(option);


app.get('/' , function (req: Request , res: Response ) {
    res.sendFile(path.join(__dirname, '..', 'distVue', 'index.html'))
});

app.get('/coding', function (req: Request, res: Response) {
	res.send({text: text, input: input, inputRadio: inputRadio, output: output});
})

app.post('/' , function (req: Request , res: Response ) {
    let lang = "C";
	let code = req.body.code;
	let input = req.body.input;
    let inputRadio = req.body.inputRadio;
    if((lang === "C") || (lang === "C++"))
    {
        if(inputRadio === true)
        {
            var envData = { OS : "linux" , cmd : "gcc"};
        	compiler.compileCPPWithInput(envData , code ,input , function (data: any) {
        		if(data.error)
        		{
        			res.send(data.error);
        		}
        		else
        		{
        			res.send(data.output);
        		}
        	});
	   }
	   else
	   {
           var envData = { OS : "linux" , cmd : "gcc"};
        	compiler.compileCPP(envData , code , function (data: any) {
        	if(data.error)
        	{
        		res.send(data.error);
        	}
        	else
        	{
        		res.send(data.output);
        	}
            });
	   }
    }
});

app.get('/fullStat' , function(req: Request , res: Response ){
    compiler.fullStat(function(data: any){
        res.send(data);
    });
});

app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.static(path.join(__dirname, '..', 'distVue')));