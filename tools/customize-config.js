'use strict'

const chalk = require('chalk');
const fs = require('fs');
const fse = require('fs-extra');
const path = require('path');

const params = process.argv.splice(2);

try {
    //
    // Checking parameters.
    if (params.length <= 0) {
        throw `You need to provide an existing mod name.`;
    }
    //
    // Catching params from CMD
    const modName = params[0];
    const envName = typeof params[1] !== 'undefined' ? params[1] : false;
    //
    // Basic paths.
    const rootDir = path.join(__dirname, '..');
    const confDir = path.join(rootDir, 'configs');
    const modsDir = path.join(rootDir, 'mods');
    //
    // Current operation paths.
    const envSuffix = envName ? `.${envName}` : '';
    const customConfig = path.join(confDir, `${modName}${envSuffix}.json`);
    const modDir = path.join(modsDir, modName);
    const modManifest = path.join(modDir, `manifest.json`);
    //
    // Loading manifest.
    let manifest = {};
    if (fs.existsSync(modManifest)) {
        manifest = require(modManifest);
    } else {
        throw `No manifest found for mod '${modName}'`;
    }
    //
    // Does this mod use config files?
    if (!manifest.config) {
        throw `Mod '${modName}' doesn't require a configuration file.`;
    }
    //
    // Does this mod's config files exists?
    const configPath = path.join(modDir, manifest.config);
    if (!fs.existsSync(configPath)) {
        throw `Mod '${modName}' config file '${manifest.config}' does not exist.`;
    }
    //
    // Is it already customized?
    if (fs.existsSync(customConfig)) {
        const envMsg = envName ? ` for the environment '${envName}'` : '';
        throw `Mod '${modName}' is already customized${envMsg}.`;
    }
    //
    // Customizing...
    const envMsg = envName ? ` for the environment '${chalk.cyan(envName)}'` : '';
    console.log(`Customizing mod '${chalk.cyan(manifest.name)}' (${chalk.cyan(modName)})${envMsg}...`);
    try {
        fse.copySync(configPath, customConfig);
        console.log(chalk.green(`Customized`));
    } catch (e) {
        throw `Unable to create customization\n${e}`;
    }
} catch (e) {
    console.error(chalk.red(e));
}