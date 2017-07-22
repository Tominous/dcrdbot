'use strict'

module.exports = ({ bot, env, pluginConfig, tools }) => {
    const io = env.getSocket();
    const chalk = tools.chalk;
    const path = tools.path;
    const validate = tools.jsonschema.validate;

    const messageSchema = require(path.join(__dirname, '/specs/message.schema.json'));

    io.sockets.on('connection', function (socket) {
        console.log(chalk.blue(`+ [mod.announcements] Socket connection opened.`));

        socket.on('disconnect', function (data) {
            console.log(chalk.blue(`+ [mod.announcements] Socket connection closed.`));
        });

        socket.on('mod.announcements.announce', function (data) {
            let error = false;
            let delayedResponse = false;
            let response = {
                server: false,
                announcedChannels: []
            };

            const sendResponse = () => {
                io.sockets.emit('mod.announcements.response', {
                    status: !error,
                    error,
                    response
                });
            }
            const announceOn = (channelID) => {
                bot.simulateTyping(channelID, () => {
                    bot.sendMessage({
                        to: channelID,
                        message: data.message
                    });
                });
            }

            try {
                data = typeof data === 'string' ? JSON.parse(data) : data;
            } catch (e) {
                error = 'Unable to decode message';
            }

            if (!error && tools.mongoose) {
                const check = validate(data, messageSchema);

                if (check.errors.length > 0) {
                    error = check.errors[0].stack;
                }

                if (!error) {
                    for (let k in bot.servers) {
                        if (bot.servers[k].id === data.server || bot.servers[k].name === data.server) {
                            response.server = {
                                id: bot.servers[k].id,
                                name: bot.servers[k].name,
                                channels: []
                            };

                            for (let ck in bot.servers[k].channels) {
                                response.server.channels.push(bot.servers[k].channels[ck].id);
                            }
                        }
                    }

                    if (!response.server) {
                        error = `Server '${data.server}' not found`;
                    }
                }

                if (!error) {
                    delayedResponse = true;

                    let collection;
                    try {
                        collection = tools.mongoose.model('mod_announcements_channels');
                    } catch (e) {
                        collection = tools.mongoose.model('mod_announcements_channels', new tools.mongoose.Schema({}));
                    }

                    collection.find({
                        id: {
                            "$in": response.server.channels
                        }
                    }).exec((err, channels) => {
                        if (!err) {
                            for (let ck in channels) {
                                const channel = channels[ck].toJSON();
                                response.announcedChannels.push({
                                    id: channel.id,
                                    name: channel.name
                                });
                                announceOn(channel.id);
                            }
                            sendResponse();
                        }
                    });
                }
            } else if (!error) {
                error = 'No db active';
            }

            if (!delayedResponse) {
                sendResponse();
            }
        });

        io.sockets.emit('mod.announcements.connected', {
            status: true,
        })
    });
};