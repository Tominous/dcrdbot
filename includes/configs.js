'use strict'

let env = {};
let manifest = {};

const fs = require('fs');
const path = require('path');
const validate = require('jsonschema').validate;

class ConfigsManager {
    constructor() {
        this.envSuffix = process.env.ENV ? '.' + process.env.ENV : '';
        this.rootDir = path.join(__dirname, '..');

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

    valiateKnownSchema(content, schemaName) {
        let error = `Unknown schema '${schemaName}'`;

        if (this.schemas[schemaName]) {
            error = this.valiateSchema(content, this.schemas[schemaName]);
        }

        return error;
    }
    valiateSchema(content, schema) {
        let error = false;

        const check = validate(content, schema);
        if (check.errors.length > 0) {
            error = check.errors[0].stack;
        }

        return error;
    }

    buildManifest() {
        const modsDir = path.join(this.rootDir, 'mods');

        const dirNames = fs.readdirSync(modsDir);

        let mods = {};
        let error = false;
        for (let k in dirNames) {
            const name = dirNames[k];
            const manifestPath = path.join(modsDir, name, 'manifest.json');
            if (fs.existsSync(manifestPath)) {
                const manifest = require(manifestPath);

                error = this.valiateKnownSchema(manifest, 'manifest');
                if (error) {
                    console.error(`Mod '${name}' manifest file has the wrong structure.\nError: ${error}`);
                    break;
                }

                mods[name] = {};
                mods[name].name = manifest.name;
                mods[name].brief = manifest.brief;
                mods[name].description = manifest.description ? manifest.description : manifest.brief;
                mods[name].main = manifest.main;
                mods[name].version = manifest.version;
                mods[name].triggers = manifest.triggers ? manifest.triggers : false;

                mods[name].config = {};
                mods[name].configSchema = manifest.configSchema ? manifest.configSchema : false;
                if (manifest.config) {
                    const customConfPath = path.join(__dirname, '..', 'configs', `${name}.json`);
                    const customEnvConfPath = path.join(__dirname, '..', 'configs', `${name}${this.envSuffix}.json`);
                    const defaultConfPath = manifest.config ? path.join(modsDir, name, manifest.config) : false;

                    let finalConfPath = false;
                    if (fs.existsSync(customEnvConfPath)) {
                        finalConfPath = customEnvConfPath;
                    } else if (fs.existsSync(customConfPath)) {
                        finalConfPath = customConfPath;
                    } else if (fs.existsSync(defaultConfPath)) {
                        finalConfPath = defaultConfPath;
                    }

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

        if (!error) {
            manifest = {
                mods: mods
            };
        }
    };
    loadEnvironment() {
        const customConf = path.join(this.rootDir, 'configs', `environment${this.envSuffix}.json`);
        if (fs.existsSync(customConf)) {
            console.log(`Loading configuration from 'environment${this.envSuffix}.json'...`);
            env = require(customConf);

            const error = this.valiateKnownSchema(env, 'environment');
            if (error) {
                console.error(`Environment configuration file 'environment${this.envSuffix}.json' has the wrong structure.\nError: ${error}`);
                env = {};
            }
        }
    };
}

//
//
const manager = new ConfigsManager();
manager.loadEnvironment();
manager.buildManifest();

//
//
module.exports = { env, manifest };
