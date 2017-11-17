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

    //auth 
    let instance = axios.create({
        baseURL: 'https://api.github.com',
        auth: {
            username: 'cdoco',
            password: '3bff8d2dee642a86b9d3a7a6406b21ffd39661cb'
        }
    });

    //loading style
    const spinner = ora(bold('Loading GitHub Rank')).start();
    setTimeout(() => {
        spinner.color = 'yellow';
        spinner.text = bold('网速有点慢, 不要着急哦 ^_^ !');
    }, 2000);

    instance.get('/search/users', {
        params: {
            q: query,
            per_page: option.num
        }
    }).then(async(rsp) => {

        let index = 1;
        for (var value of rsp.data.items) {
            let info = await instance.get(value.url);

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
        console.log(error);
    });

};

export default gr;