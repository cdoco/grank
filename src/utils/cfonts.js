import CFonts from 'cfonts';

const cfonts = fonts => {
    CFonts.say(fonts, {
        font: 'block',
        align: 'left',
        colors: ['blue', 'red'],
        background: 'black',
        letterSpacing: 1,
        lineHeight: 1,
        space: true,
        maxLength: '20',
    });
};

module.exports = {
    cfonts,
};