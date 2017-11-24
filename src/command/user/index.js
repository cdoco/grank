import ora from 'ora';
import pMap from 'p-map';
import format from 'date-fns/format';

import { github } from '../../utils/json';
import { cfonts } from '../../utils/cfonts';
import { basicTable } from '../../utils/table';
import { error, red, bold, neonGreen } from '../../utils/chalk';

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

const user = async(query = 'location:china', { num = 10, page, sort, order } = {}) => {
    let userInfos;
    const userTable = basicTable();

    //title
    cfonts('Grank User');

    userTable.push(
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
    const spinner = ora('Loading GitHub Rank For User').start();

    try {
        const rsp = await github.get('/search/users?q=' + query, {
            params: {
                per_page: num,
                page: page,
                sort: sort,
                order: order
            }
        });
        userInfos = rsp.data;
    } catch (error) {
        spinner.stop();
        catchError(error, 'Users.All');
    }

    await pMap(
        userInfos.items,
        async(item, index) => {
            let detail;

            try {
                const rsp = await github.get(item.url);
                detail = rsp.data;
            } catch (error) {
                spinner.stop();
                catchError(error, 'Users.UserDetail');
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

            userTable.push(
                alignCenter([
                    ++index,
                    login,
                    name,
                    location,
                    blog,
                    public_repos,
                    followers,
                    format(created_at, 'YYYY/MM/DD'),
                ])
            );
        }, { concurrency: 1 }
    );

    spinner.stop();

    console.log(userTable.toString());
};

export default user;