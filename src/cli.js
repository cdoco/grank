import program from 'commander';
import isAsyncSupported from 'is-async-supported';
import didYouMean from 'didyoumean';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';

import gr from './command';
import { error, bold, red } from './utils/chalk';

import pkg from '../package.json';

if (!isAsyncSupported()) {
    require('async-to-gen/register');
}

(async() => {
    await updateNotifier({
        pkg,
    }).notify({ defer: false });
})();

program.version(pkg.version);

program
    .command('user <query>')
    .alias('u')
    .option('-s, --sort <sort>', "排序依据, 值可为 followers, repositories, or joined。默认为 best match")
    .option('-o, --order <order>', "排序顺序, desc 或 asc。默认为 desc。")
    .option('-n, --num <n>', "查询的数量, 默认为 30。")
    .option('-p, --page <n>', "查询的页数, 默认为 1。")
    .on('--help', () => {
        console.log('');
    })
    .action((query, option) => {
        gr(query, option);
    });

program.on('--help', () => {
            console.log('');
            console.log('');
            console.log(`  Welcome to ${chalk`{bold.hex('#0069b9') Github Rank}`} ${red('Cli')} !`);
});

program.option('-v --version', pkg.version);

program.command('*').action(command => {
    error(`Unknown command: ${bold(command)}`);
    const commandNames = program.commands
        .map(c => c._name)
        .filter(name => name !== '*');

    const closeMatch = didYouMean(command, commandNames);
    if (closeMatch) {
        error(`Did you mean ${bold(closeMatch)} ?`);
    }
    process.exit(1);
});

if (process.argv.length === 2) program.help();

program.parse(process.argv);