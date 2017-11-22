import axios from 'axios';
import ora from 'ora';
import pMap from 'p-map';

import { basicTable } from '../utils/table';
import { error, red, bold, neonGreen } from '../utils/chalk';

const alignCenter = columns =>
    columns.map(content => ({ content, hAlign: 'left', vAlign: 'center' }));

const catchError = (err, apiName) => {
    error(err);
    console.log('');
    error(`Oops, ${apiName} goes wrong.`);
    error(
        'Please run grank again.\nIf it still does not work, feel free to open an issue on https://github.com/cdoco/grank/issues'
    );
    process.exit(1);
};

const grank = async(query, option) => {
    let userInfos;
    //设定默认值
    query = query || 'location:china';
    option.num = option.num || 10;
    const grankTable = basicTable();

    grankTable.push(
        [{
            colSpan: 8,
            content: bold("Github Rank"),
            hAlign: 'center',
            vAlign: 'center',
        }], [{
            colSpan: 8,
            content: bold("made by cdoco"),
            hAlign: 'right',
            vAlign: 'center',
        }],
        alignCenter([
            bold(neonGreen("rank")),
            bold(neonGreen("username")),
            bold(neonGreen("name")),
            bold(neonGreen("location")),
            bold(neonGreen("blog")),
            bold(neonGreen("repos")),
            bold(neonGreen("followers")),
            bold(neonGreen("created")),
        ])
    );

    //loading style
    const spinner = ora('Loading GitHub Rank').start();

    try {
        const rsp = await axios.get('https://api.github.com/search/users?q=' + query, {
            params: {
                per_page: option.num,
                page: option.page,
                sort: option.sort,
                order: option.order
            }
        });
        userInfos = rsp.data;
    } catch (error) {
        spinner.stop();
        catchError(error, 'Grank.Users');
    }

    await pMap(
        userInfos.items,
        async(item, index) => {
            let detail;

            try {
                const rsp = await axios.get(item.url);
                detail = rsp.data;
            } catch (error) {
                spinner.stop();
                catchError(error, 'Grank.UsersDetail');
            }

            const {
                login,
                name,
                location,
                blog,
                public_repos,
                followers,
                created_at
            } = detail;

            grankTable.push(
                alignCenter([
                    ++index,
                    login,
                    name,
                    location,
                    blog,
                    public_repos,
                    followers,
                    created_at,
                ])
            );
        }, { concurrency: 1 }
    );

    spinner.stop();

    console.log(grankTable.toString());
};

export default grank;