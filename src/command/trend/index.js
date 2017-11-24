import ora from 'ora';
import pMap from 'p-map';
import format from 'date-fns/format';

import { codehub } from '../../utils/json';
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

const trend = async({ since = 'daily', language = 'all' } = {}) => {
    let trendInfos;
    const trendTable = basicTable();

    //title
    cfonts('Trending');

    trendTable.push(
        alignCenter([
            bold(neonGreen("rank")),
            bold(neonGreen("name")),
            bold(neonGreen("language")),
            bold(neonGreen("stars")),
            bold(neonGreen("forks")),
            bold(neonGreen("address")),
            bold(neonGreen("created")),
        ])
    );

    //loading style
    const spinner = ora('Loading GitHub Trending').start();

    try {
        const rsp = await codehub.get('/trending', {
            params: {
                since: since,
                language: language,
            }
        });
        trendInfos = rsp.data;
    } catch (error) {
        spinner.stop();
        catchError(error, 'Trending');
    }

    trendInfos.slice(0, 15).forEach((item, index) => {
        const {
            full_name,
            language,
            stargazers_count,
            forks,
            html_url,
            created_at
        } = item;

        trendTable.push(
            alignCenter([
                ++index,
                full_name,
                language,
                stargazers_count,
                forks,
                html_url,
                format(created_at, 'YYYY/MM/DD'),
            ])
        );
    });

    spinner.stop();

    console.log(trendTable.toString());

}

export default trend;