import ora from 'ora';
import pMap from 'p-map';
import format from 'date-fns/format';

import { json } from '../../utils/json';
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

const repo = async(query = 'language:node', { num = 10, page, sort = 'stars', order } = {}) => {
    let repoInfos;
    const repoTable = basicTable();

    //title
    cfonts('Github Rank');

    repoTable.push(
        alignCenter([
            bold(neonGreen("rank")),
            bold(neonGreen("name")),
            bold(neonGreen("address")),
            bold(neonGreen("language")),
            bold(neonGreen("stars")),
            bold(neonGreen("created")),
        ])
    );

    //loading style
    const spinner = ora('Loading GitHub Rank For Repositorie').start();

    try {
        const rsp = await json.get('/search/repositories?q=' + query, {
            params: {
                per_page: num,
                page: page,
                sort: sort,
                order: order
            }
        });
        repoInfos = rsp.data;
    } catch (error) {
        spinner.stop();
        catchError(error, 'Repo.All');
    }

    repoInfos.items.forEach((item, index) => {
        const {
            full_name,
            html_url,
            language,
            stargazers_count,
            created_at
        } = item;

        repoTable.push(
            alignCenter([
                ++index,
                full_name,
                html_url,
                language,
                stargazers_count,
                format(created_at, 'YYYY/MM/DD'),
            ])
        );
    });

    spinner.stop();

    console.log(repoTable.toString());
};

export default repo;