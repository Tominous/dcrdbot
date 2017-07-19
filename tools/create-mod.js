'use strict'

const prompt = require('prompt-sync')({
    autocomplete: false,
    sigint: true
});
const fs = require('fs');
const path = require('path');

class Manager {
    constructor() {
        this.rootDir = path.join(__dirname, '../');
        this.modsDir = path.join(this.rootDir, 'mods');
        this.knownMods = fs.readdirSync(this.modsDir);
        this.data = {};
    }
    createConfig() {
        if (this.data.config) {
            console.log(`\tCreating config file '${this.data.config}'...`);
            let content = {
                someparam: "some value"
            };

            fs.writeFileSync(path.join(this.modsDir, this.data.basicName, this.data.config), JSON.stringify(content, null, 2));
        }
    }
    createDirectory() {
        console.log(`\tCreating directory '${this.data.basicName}'...`);
        fs.mkdirSync(path.join(this.modsDir, this.data.basicName));
    }
    createMain() {
        console.log(`\tCreating main script '${this.data.main}'...`);
        let content = '';

        content += "'use strict'\n\n";
        content += "module.exports = ({ bot, env, pluginConfig }) => {\n";
        content += "    //bot.on('message', function (user, userID, channelID, message, event) {\n";
        content += "    //    if (bot.id !== userID) {\n";
        content += "    //        bot.sendMessage({\n";
        content += "    //            to: channelID,\n";
        content += "    //            message: 'Some message'\n";
        content += "    //        });\n";
        content += "    //    }\n";
        content += "    //});\n";
        content += "};\n";

        fs.writeFileSync(path.join(this.modsDir, this.data.basicName, this.data.main), content);
    }
    createManifest() {
        console.log(`\tCreating manifest...`);
        let manifest = {
            name: this.data.realName,
            version: this.data.version,
            brief: this.data.brief,
            main: this.data.main,
            config: this.data.config,
            configSchema: this.data.configSchema,
            triggers: [],
            dependencies: []
        };

        fs.writeFileSync(path.join(this.modsDir, this.data.basicName, 'manifest.json'), JSON.stringify(manifest, null, 2));
    }
    createSchema() {
        if (this.data.configSchema) {
            console.log(`\tCreating config schema '${this.data.configSchema}'...`);
            let content = {
                type: 'object',
                properties: {
                    someparam: {
                        type: 'string',
                        optional: true
                    }
                }
            };

            fs.writeFileSync(path.join(this.modsDir, this.data.basicName, this.data.configSchema), JSON.stringify(content, null, 2));
        }
    }
    getBasicName() {
        this.data.basicName = false;

        while (!this.data.basicName) {
            this.data.basicName = prompt('Mod basic name?: ');

            if (this.knownMods.indexOf(this.data.basicName) >= 0) {
                console.error(`\tMod '${this.data.basicName}' already exists. Try again.`);
                this.data.basicName = false;
            }
        }

        return this.data.basicName;
    }
    getValue({ message, value = false, pattern = false }) {
        let out = false;

        while (out === false) {
            out = prompt(message + (value ? ` (${value})` : '') + ': ') + "";

            if (!out) {
                out = value;
            }
            if (!out) {
                out = '';
            }

            if (pattern !== false && typeof out === 'string') {
                if (!out.match(pattern)) {
                    console.error(`\tGiven value is not allowed, try again.`);
                    out = false;
                }
            } else if (!out) {
                console.error(`\tWrong value, try again.`);
                out = false
            }
        }

        return out;
    }

    run() {
        this.getBasicName();

        this.data.realName = this.getValue({ message: 'Real name?', value: this.data.basicName });
        this.data.version = this.getValue({ message: 'Version?', value: '0.0.1' });
        this.data.brief = this.getValue({ message: 'Brief description?' });
        this.data.description = this.getValue({ message: 'Full description?', pattern: /^.*$/ });
        this.data.main = this.getValue({ message: 'Main file?', value: 'index.js', pattern: /^([a-zA-Z0-9\._-]+)\.js$/ });
        this.data.config = this.getValue({ message: 'Configuration file?', value: 'config.json', pattern: /^(|([a-zA-Z0-9\._-]+)\.json)$/ });
        if (this.data.config) {
            this.data.configSchema = this.getValue({ message: 'Configuration file?', value: 'config.schema.json', pattern: /^(|([a-zA-Z0-9\._-]+)\.json)$/ });
        }

        console.log(`\nGenerating:`);
        this.createDirectory();
        this.createMain();
        this.createConfig();
        this.createSchema();
        this.createManifest();
    }
}

const manager = new Manager();
manager.run();
