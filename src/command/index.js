import axios from 'axios';
import ora from 'ora';

import { basicTable } from '../utils/table';
import { red, bold, neonGreen } from '../utils/chalk';

const alignCenter = columns =>
    columns.map(content => ({ content, hAlign: 'left', vAlign: 'center' }));

const gr = (query, option) => {
    const grTable = basicTable();

    grTable.push(
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
    const spinner = ora(bold('Loading GitHub Rank')).start();
    setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = bold('网速有点慢, 不要着急哦 ^_^ !');
    }, 3000);

    axios.get('https://api.github.com/search/users', {
        params: {
            q: query,
            per_page: option.num
        }
    }).then(async(rsp) => {

        let index = 1;
        for (var value of rsp.data.items) {
            let info = await axios.get(value.url);

            grTable.push(
                alignCenter([
                    index,
                    info.data.login,
                    info.data.name,
                    info.data.location,
                    info.data.blog,
                    info.data.public_repos,
                    info.data.followers,
                    info.data.created_at,
                ])
            );
            index++;
        }
    }).then(() => {
        spinner.stop();
        console.log(grTable.toString());
    }).catch(error => {
        spinner.text = bold(red('加载失败!'));
        setTimeout(() => {
            spinner.stop();
        }, 1000);
    });
};

export default gr;