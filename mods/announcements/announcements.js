'use strict'

module.exports = ({ bot, env, pluginConfig, tools }) => {
    if (env.getSocket()) {
        const includeParmas = { bot, env, pluginConfig, tools };

        require('./includes/client')(includeParmas);

        require('./includes/socket')(includeParmas);

        require('./includes/bot-register')(includeParmas);
        require('./includes/bot-unregister')(includeParmas);
    }
};
