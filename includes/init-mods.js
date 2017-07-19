'use strict'

const path = require('path');

module.exports = ({ bot, env, manifest }) => {
    const modsPath = path.join(__dirname, 'mods');
    let indeed = [];

    console.log(`Loading plugins:`);
    for (let k in manifest.mods) {
        if (env.ignores.mods.indexOf(k) < 0) {
            let mod = manifest.mods[k];
            console.log(`  - '${mod.name}'...`);
            require(path.join(__dirname, '..', 'mods', k, mod.main))({
                bot,
                env,
                pluginConfig: mod.config
            });
        }
    }
}