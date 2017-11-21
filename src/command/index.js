import axios from 'axios';
import ora from 'ora';
import pMap from 'p-map';

import { basicTable } from '../utils/table';
import { red, bold, neonGreen } from '../utils/chalk';

const alignCenter = columns =>
    columns.map(content => ({ content, hAlign: 'left', vAlign: 'center' }));

const grank = async(query, option) => {
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

    const rsp = await axios.get('https://api.github.com/search/users', {
        params: {
            q: query,
            per_page: option.num,
            page: option.page,
            sort: option.sort,
            order: option.order
        }
    });

    await pMap(
        rsp.data.items,
        async(item, index) => {
            const info = await axios.get(item.url);
            const {
                login,
                name,
                location,
                blog,
                public_repos,
                followers,
                created_at
            } = info.data;

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