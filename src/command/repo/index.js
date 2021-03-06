import ora from 'ora';
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

const repo = async(query = 'language:node', { num = 10, page, sort = 'stars', order } = {}) => {
    let repoInfos;
    const repoTable = basicTable();

    //title
    cfonts('Grank Repo');

    repoTable.push(
        alignCenter([
            bold(neonGreen("rank")),
            bold(neonGreen("name")),
            bold(neonGreen("language")),
            bold(neonGreen("stars")),
            bold(neonGreen("address")),
            bold(neonGreen("created")),
        ])
    );

    //loading style
    const spinner = ora('Loading GitHub Rank For Repositorie').start();

    try {
        const rsp = await github.get('/search/repositories?q=' + query, {
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
        catchError(error, 'Repositories');
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
                language,
                stargazers_count,
                html_url,
                format(created_at, 'YYYY/MM/DD'),
            ])
        );
    });

    spinner.stop();

    console.log(repoTable.toString());
};

export default repo;