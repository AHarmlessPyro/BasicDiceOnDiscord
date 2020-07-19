require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);

function buildNumericalList({ dice_count, dice_size, add_sub = '+', increment_count = 0, dice_to_keep = 'a', dice_number_to_keep = undefined }) {
    let currentList = [];
    let sum = undefined;
    let sortedList = [];
    let total = {
        List: [],
        sum: 0
    }
    for (let i = 0; i < dice_count; i++) {
        let currentNum = parseInt(Math.random() * dice_size + 1);
        currentList.push(currentNum);
        // sum += currentNum;
    }

    switch (dice_to_keep) {
        case 'a':
            sum = currentList.reduce((current) => {
                total.List = [...total.List, current];
                total.sum += current;
            });
            break;
        case 'h':
            if (dice_number_to_keep === undefined || dice_number_to_keep > currentList.length) {
                dice_number_to_keep = currentList.length
            }

            sortedList = currentList.sort((a, b) => {
                return -a + b;
            })

            sum = sortedList.forEach((currentValue, currentIndex) => {
                if (currentIndex < dice_number_to_keep) {
                    total.List = [...total.List, `${currentValue}`];
                    total.sum += currentValue;
                } else {
                    total.List = [...total.List, `~~${currentValue}~~`];
                }
            })
            break;
        case 'l':
            if (dice_number_to_keep === undefined || dice_number_to_keep > currentList.length) {
                dice_number_to_keep = currentList.length
            }

            sortedList = currentList.sort((a, b) => {
                return a - b;
            })

            sum = sortedList.forEach((currentValue, currentIndex) => {
                if (currentIndex < dice_number_to_keep) {
                    total.List = [...total.List, `${currentValue}`];
                    total.sum += currentValue;
                } else {
                    total.List = [...total.List, `~~${currentValue}~~`];
                }
            })
            break;
        default:
            break;
    }
    let addition_value = (add_sub === '+' ? increment_count : -increment_count);

    total.sum += addition_value;
    return ([total.sum, total.List, `d${dice_size}`]);
}

client.on('message', msg => {
    if (/^!roll .*/.test(msg.content)) {
        const reg = /(?:(?<dice_count>\d+)[dD](?<dice_size>\d+)(?:[kK](?:(?<keep_H_or_L>[hlHL])(?<dice_to_keep>\d+)))?)+(?: *(?<add_sub>[\+-](?! ?\w+[dD]\w)) *(?<constant>\d*(?!d)))?\s*(?:#(?<comment>.+))?/gm;
        let match, results = [];
        let sum = 0;
        let stringFin = '';
        let err_flag = false;
        let lastComment = ""
        let stringToParse = msg.content;//.replace(" ", "");

        do {
            match = reg.exec(stringToParse);
            //console.log(match);
            if (match) {
                let value = [];

                results.push(match);

                if (match.groups.keep_H_or_L === undefined) {
                    match.groups.keep_H_or_L = 'a';
                    match.groups.dice_to_keep = undefined
                } else {
                    match.groups.dice_to_keep = parseInt(match.groups.dice_to_keep);
                }

                if (match.groups.add_sub) {
                    value = buildNumericalList(
                        {
                            "dice_count": parseInt(match.groups.dice_count),
                            "dice_size": parseInt(match.groups.dice_size),
                            "add_sub": match.groups.add_sub,
                            "increment_count": parseInt(match.groups.constant),
                            "dice_to_keep": match.groups.keep_H_or_L,
                            "dice_number_to_keep": match.groups.dice_to_keep
                        });
                } else {
                    value = buildNumericalList({
                        dice_count: parseInt(match.groups.dice_count),
                        dice_size: parseInt(match.groups.dice_size),
                        dice_to_keep: dice_to_keep = match.groups.keep_H_or_L,
                        dice_number_to_keep: match.groups.dice_to_keep
                    });
                }

                if (match.groups.comment) {
                    lastComment = match.groups.comment;
                }

                for (let i = 0; i < value[1].length; i++) {
                    if (value[1].length !== i + 1) {
                        stringFin += `${value[1][i]},`;
                    } else {
                        stringFin += `${value[1][i]} (${value[2]})\n`;
                    }
                }

                sum += value[0];

            } else {
                // msg.reply('Formatting error. Use format of !roll nDm + o');
                // err_flag = true;
                // break;
            }
        } while (match)
        if (!err_flag) {
            if (lastComment) {
                msg.reply(`Rolling for ${lastComment} : ${sum} \n Original Roll(s) : ${stringFin} `);
            }
            else {
                msg.reply(`${sum} : \n Original Roll(s) : ${stringFin} `);
            }
        }
    }
});