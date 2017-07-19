/**
 * @file includes/config.js
 * @author Alejandro Dario Simi
 *
 * This initializer holds the logic to load all configuration files available for
 * the current environment.
 */
'use strict'
//
// Objects to later export.
let env = {};
let manifest = {};
//
// Loading dependencies.
const fs = require('fs');
const path = require('path');
const validate = require('jsonschema').validate;
//
// Class to manage and organize all configurations loading.
class ConfigsManager {
    constructor() {
        //
        // Checking custom or default environment.
        this.envSuffix = process.env.ENV ? '.' + process.env.ENV : '';
        //
        // Basic values.
        this.rootDir = path.join(__dirname, '..');
        //
        // Loading knwon json schemas.
        this.schemas = {};
        const files = fs.readdirSync(path.join(__dirname, 'specs'));
        const filePattern = /(.+)\.schema\.json$/;
        for (let k in files) {
            const mat = files[k].match(filePattern);
            if (mat) {
                this.schemas[mat[1]] = require(path.join(__dirname, 'specs', files[k]));
            }
        }
    }
    /**
     * @todo doc
     *
     * @param {*} content @todo doc
     * @param {*} schemaName @todo doc
     * @return {*} @todo doc
     */
    valiateKnownSchema(content, schemaName) {
        let error = `Unknown schema '${schemaName}'`;

        if (this.schemas[schemaName]) {
            error = this.valiateSchema(content, this.schemas[schemaName]);
        }

        return error;
    }/**
     * @todo doc
     *
     * @param {*} content @todo doc
     * @param {*} schema @todo doc
     * @return {*} @todo doc
     */
    valiateSchema(content, schema) {
        let error = false;

        const check = validate(content, schema);
        if (check.errors.length > 0) {
            error = check.errors[0].stack;
        }

        return error;
    }
    /**
     * @todo doc
     *
     * @return {*} @todo doc
     */
    buildManifest() {
        //
        // Guessing mods directory.
        const modsDir = path.join(this.rootDir, 'mods');
        //
        // Reading possible mods.
        const dirNames = fs.readdirSync(modsDir);
        //
        // Checking each possible mod.
        let mods = {};
        let error = false;
        for (let k in dirNames) {
            const name = dirNames[k];
            //
            // Ignoring mods.
            if (env.ignores.mods.indexOf(name) >= 0) {
                continue;
            }
            //
            // Guessing manifest file path.
            const manifestPath = path.join(modsDir, name, 'manifest.json');
            //
            // If it has no manifest it's ignored.
            if (fs.existsSync(manifestPath)) {
                const manifest = require(manifestPath);
                //
                // Validating manifest structure.
                error = this.valiateKnownSchema(manifest, 'manifest');
                if (error) {
                    console.error(`Mod '${name}' manifest file has the wrong structure.\nError: ${error}`);
                    break;
                }
                //
                // Loading and autocompleting fields.
                mods[name] = {};
                mods[name].name = manifest.name;
                mods[name].brief = manifest.brief;
                mods[name].description = manifest.description ? manifest.description : manifest.brief;
                mods[name].main = manifest.main;
                mods[name].version = manifest.version;
                mods[name].triggers = manifest.triggers ? manifest.triggers : false;
                //
                // Configuration and configuration validators.
                mods[name].config = {};
                mods[name].configSchema = manifest.configSchema ? manifest.configSchema : false;
                if (manifest.config) {
                    //
                    // Possibe locations where the right configuration could be.
                    const customConfPath = path.join(__dirname, '..', 'configs', `${name}.json`);
                    const customEnvConfPath = path.join(__dirname, '..', 'configs', `${name}${this.envSuffix}.json`);
                    const defaultConfPath = manifest.config ? path.join(modsDir, name, manifest.config) : false;
                    //
                    // Guessing the right path.
                    //  - custom config + environment suffix
                    //  - custom config
                    //  - default config
                    let finalConfPath = false;
                    if (fs.existsSync(customEnvConfPath)) {
                        finalConfPath = customEnvConfPath;
                    } else if (fs.existsSync(customConfPath)) {
                        finalConfPath = customConfPath;
                    } else if (fs.existsSync(defaultConfPath)) {
                        finalConfPath = defaultConfPath;
                    }
                    //
                    // Loading and validating this mod's configuration.
                    mods[name].config = require(finalConfPath);
                    if (mods[name].configSchema) {
                        error = this.valiateSchema(mods[name].config, require(path.join(modsDir, name, mods[name].configSchema)));
                        if (error) {
                            console.error(`Your configuration for mode '${mods[name].name}' at '${finalConfPath}' has the wrong structure.\nError: ${error}`);
                            break;
                        }
                    }
                }

            }
        }
        //
        // If no error was found the manifest object can be build without
        // problems.
        if (!error) {
            manifest = {
                mods: mods
            };
        }
    };
    /**
     * @todo doc
     */
    loadEnvironment() {
        //
        // Guessing configuration file path.
        const customConf = path.join(this.rootDir, 'configs', `environment${this.envSuffix}.json`);
        //
        // Checking existence.
        if (fs.existsSync(customConf)) {
            //
            // Loading configuration for the current environment.
            console.log(`Loading configuration from 'environment${this.envSuffix}.json'...`);
            env = require(customConf);
            //
            // Validation its format.
            const error = this.valiateKnownSchema(env, 'environment');
            if (error) {
                console.error(`Environment configuration file 'environment${this.envSuffix}.json' has the wrong structure.\nError: ${error}`);
                env = {};
            }
        }
    };
    /**
     * Main method.
     */
    run() {
        this.loadEnvironment();
        this.buildManifest();
    }
}
//
// Running all.
const manager = new ConfigsManager();
manager.run();
//
// Exporting loaded configurations.
module.exports = { env, manifest };
