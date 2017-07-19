'use strict'

const unirest = require('unirest');

module.exports = ({ bot, env, pluginConfig }) => {
    let knownMemes = [];
    let mainPattern = false;
    let mainTriggerPattern = false;

    const load = () => {
        knownMemes = require('./memes.json').memes.filter(x => typeof x.trigger !== 'undefined');

        let pieces = knownMemes.map(x => x.trigger);

        mainTriggerPattern = new RegExp('^(' + pieces.join('|') + ')(.*)$', 'i');
        mainPattern = new RegExp('^(' + pieces.join('|') + ') (.+)\\|(.+)$', 'i');
    };
    load();

    bot.on('message', (user, userID, channelID, message, event) => {
        if (bot.id !== userID && pluginConfig.imgflip.username && pluginConfig.imgflip.password) {
            const mainTriggerPatternMatch = message.match(mainTriggerPattern);
            const mainPatternMatch = message.match(mainPattern);

            if (mainTriggerPatternMatch) {
                if (mainPatternMatch) {
                    let memeId = false;
                    let top = mainPatternMatch[2];
                    let bottom = mainPatternMatch[3];

                    for (let k in knownMemes) {
                        if (knownMemes[k].trigger === mainPatternMatch[1]) {
                            memeId = knownMemes[k].id;
                            break;
                        }
                    }

                    if (memeId) {
                        unirest
                            .post('https://api.imgflip.com/caption_image')
                            .send({
                                template_id: memeId,
                                text0: top,
                                text1: bottom,
                                username: pluginConfig.imgflip.username,
                                password: pluginConfig.imgflip.password
                            })
                            .end((response) => {
                                if (response.body.success) {
                                    bot.sendMessage({
                                        to: channelID,
                                        message: response.body.data.url
                                    });
                                    console.log(`Sending a meme for '${mainPatternMatch[1]}' with top text '${top}' and bottom text '${bottom}'`);
                                } else {
                                    bot.sendMessage({
                                        to: channelID,
                                        message: '`Nope, it doesn\'t work.`\n```\n' + JSON.stringify(response.body) + '\n```'
                                    });
                                }
                            });
                    }
                } else {
                    bot.sendMessage({
                        to: channelID,
                        message: 'Use it as `' + mainTriggerPatternMatch[1] + ' <top-text>|<bottom-text>`'
                    });
                }
            }
        }
        if (bot.id !== userID && message.match(/^!memes/)) {
            // https://api.imgflip.com/get_memes
            const triggers = knownMemes.sort((a, b) => a.trigger > b.trigger);
            let message = '```\nKnwon triggers for memes:\n'
            for (let k in triggers) {
                message += '\t- ' + triggers[k].trigger + ': ' + triggers[k].name + '\n';
            }

            message += '\nUsage:\n'
            message += '\t<trigger> <top-text>|<bottom-text>\n'
            message += '\nPowered by \'https://imgflip.com\'\n'
            message += '\n```'

            bot.sendMessage({
                to: userID,
                message: message
            });
        }
    });
}