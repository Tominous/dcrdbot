'use strict'

const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const params = process.argv.splice(2);

const envName = params.length > 0 ? params[0] : undefined;
const { env, manifest, tools, configInfo } = require('../includes/configs')({ forcedEnv: envName, basicMode: true });


if (envName) {
    console.log(`Installing dependencies for environment '${chalk.green(envName)}'...`);
} else {
    console.log(`Installing dependencies for the default environment...`);
}

if (manifest.dependencies && manifest.dependencies.length) {
    const cmd = `npm install ${manifest.dependencies.join(' ')}`;

    console.log(`\tCommand '${chalk.cyan(cmd)}'`);

    exec(cmd, (err, stdout, stderr) => {
        if (err) {
            console.log(chalk.red(`Installation command can't be run. ${err}`));
        } else {
            console.log(stdout);
            console.log(chalk.red(stderr));
        }
        process.exit();
    });
} else {
    console.log(chalk.yellow(`The specified environment seems to have no dependencies.`));
    process.exit();
}