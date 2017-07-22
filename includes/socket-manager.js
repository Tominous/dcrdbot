'use strict'

let socket = false;

const chalk = require('chalk');

module.exports = ({ env }) => {
    //
    // Checking if there's a socket configuration and it's active.
    if (env.socket && env.socket.active) {
        //
        // Creating associated server and socket.
        const server = require('http').createServer();
        socket = require('socket.io')(server, {
            origins: env.socket.origins ? env.socket.origins : '*:*'
        });
        //
        // Starting socket.
        server.listen(env.socket.port);

        socket.sockets.on('connection', function (socket) {
            console.log(chalk.blue(`+ Socket connection opened.`));

            socket.on('disconnect', function (data) {
                console.log(chalk.blue(`+ Socket connection closed.`));
            });
        });

    }

    env.getSocket = function () {
        return socket;
    };
};
