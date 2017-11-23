import program from 'commander';
import isAsyncSupported from 'is-async-supported';
import didYouMean from 'didyoumean';
import chalk from 'chalk';
import updateNotifier from 'update-notifier';

import grank from './command';
import { error, bold, red, neonGreen } from './utils/chalk';

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
    .command('user [query]')
    .alias('u')
    .option('-s, --sort <sort>', "排序依据, 值可为 followers, repositories, or joined。默认为 best match")
    .option('-o, --order <order>', "排序顺序, desc 或 asc。默认为 desc")
    .option('-n, --num <n>', "查询的数量, 默认为 10")
    .option('-p, --page <n>', "查询的页数, 默认为 1")
    .on('--help', () => {
        console.log('');
        console.log('');
        console.log(`  query 扩展用法, 语法格式为 keywords+key:value+key2:value:`);
        console.log('');
        console.log(`    type: 搜索的用户类型，user或者org, eg: ${neonGreen('type:user')}`);
        console.log('');
        console.log(`    in: 在何字段中进行q的搜索。通常为user的response中的字段, eg: ${neonGreen('in:user')}`);
        console.log('');
        console.log(`    repos: 数量过滤字段。根据所拥有的repos数量进行过滤, eg: ${neonGreen('repos:10')}`);
        console.log('');
        console.log(`    location: 所在地过滤, eg: ${neonGreen('location:china')}`);
        console.log('');
        console.log(`    language: 所拥有的repos语言过滤, eg: ${neonGreen('language:node')}`);
        console.log('');
        console.log(`    followers: 关注数量过滤字段, eg: ${neonGreen('followers:100')}`);
        console.log('');
        console.log(`  示例:`);
        console.log('');
        console.log(`  ${neonGreen('grank user location:china+language:c -n 5 -s followers -o desc')}`);
        console.log('');
    })
    .action((query, option) => {
        grank.user(query, option);
    });

program
    .command('repo [query]')
    .alias('r')
    .option('-s, --sort <sort>', "排序依据，值可取 stars, forks, updated。默认为 best match")
    .option('-o, --order <order>', "排序顺序, desc 或 asc。默认为 desc")
    .option('-n, --num <n>', "查询的数量, 默认为 10")
    .option('-p, --page <n>', "查询的页数, 默认为 1")
    .on('--help', () => {
        console.log('');
        console.log('');
        console.log(`  query 扩展用法, 语法格式为 keywords+key:value+key2:value:`);
        console.log('');
        console.log(`    in: 在何字段中对q进行搜索。可用值为repository相关response中的字段, eg: ${neonGreen('in:c')}`);
        console.log('');
        console.log(`    forks: forks字段过滤, eg: ${neonGreen('forks:100')}`);
        console.log('');
        console.log(`    stars: 同forks，过滤使用, eg: ${neonGreen('stars:100')}`);
        console.log('');
        console.log(`    language: 搜索的语言类型，例 java,c,python 等, eg: ${neonGreen('language:node')}`);
        console.log('');
        console.log(`  示例:`);
        console.log('');
        console.log(`  ${neonGreen('grank repo language:c -n 5 -s stars -o desc')}`);
        console.log('');
    })
    .action((query, option) => {
        grank.repo(query, option);
    });

program.on('--help', () => {
            console.log('');
            console.log('');
            console.log(`  Welcome to ${chalk`{bold.hex('#0069b9') Github Rank}`} ${red('Cli')} !`);
            console.log('');
            console.log(`  查询用户排名: ${neonGreen('grank user [query]')}`);
            console.log('');
            console.log(`  查询仓库排名: ${neonGreen('grank repo [query]')}`);
            console.log('');
            console.log(`  想要获取更多的信息你可以查看帮助文档 ${neonGreen('grank user -h')} or ${neonGreen('grank repo -h')}`);
            console.log('');
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