'use strict'

module.exports = ({ bot, env, pluginConfig, tools }) => {
    if (pluginConfig.client.active) {
        const path = tools.path;
        const express = tools.express;
        const app = express();

        app.set('view engine', 'ejs');
        app.set('views', path.join(__dirname, '../pages'));

        app.use(express.static(path.join(__dirname, '../assets')));
        app.use(express.static(path.join(__dirname, '../../../node_modules/socket.io-client/dist')));

        app.get('/', function (req, res) {
            res.render('index', {
                server: {
                    port: 4040
                },
                servers: bot.servers
            });
        });

        app.listen(pluginConfig.client.port);
    }
};