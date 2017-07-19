'use strict'

const unirest = require('unirest');

module.exports = ({ bot, env, pluginConfig }) => {
    if (pluginConfig.imgurClientId) {
        bot.on('message', function (user, userID, channelID, message, event) {
            if (bot.id !== userID && message.match(/^!imgur/)) {
                unirest
                    .get('https://api.imgur.com/3/gallery/hot/viral/0.json')
                    .headers({
                        'Authorization': 'Client-ID ' + pluginConfig.imgurClientId
                    })
                    .end((response) => {
                        if (typeof response.body.data !== 'undefined' && response.body.data.length > 0) {
                            const dataLenght = response.body.data.length;
                            let tries = 20;
                            let img = false;

                            const letsTry = () => {
                                const pos = Math.round(Math.random() * (dataLenght - 1));
                                img = response.body.data[pos];
                                if (img.animated || !img.type || !img.type.match(/image/) || img.is_album) {
                                    img = false;
                                    if (tries > 0) {
                                        tries--;
                                        letsTry();
                                    }
                                }
                            }
                            letsTry();

                            if (img) {
                                bot.sendMessage({
                                    to: channelID,
                                    message: img.link
                                });
                                console.log('Sending imgur link: ' + img.link, img);
                            } else {
                                bot.sendMessage({
                                    to: channelID,
                                    message: '`I give up!`'
                                });
                            }
                        } else {
                            bot.sendMessage({
                                to: channelID,
                                message: '`Nope, it doesn\'t work.`'
                            });
                        }
                    });
            }
        });
    } else {
        console.error('You need to configure a Imgur client id.');
    }
};
