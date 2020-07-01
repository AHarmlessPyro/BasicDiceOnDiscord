require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.BOT_TOKEN);

function buildNumericalList(dice_count, dice_size, add_sub = '+', increment_count = 0) {
    let currentList = [];
    //let finalList = [];
    let sum = 0;

    console.log(dice_count, dice_size, add_sub, increment_count);

    for (let i = 0; i < dice_count; i++) {
        let currentNum = parseInt(Math.random() * dice_size + 1);
        //let finalNum = currentNum + (add_sub === '+' ? increment_count : -increment_count);
        //// console.log(`${currentNum} + ${finalNum} : ${sum}`);
        currentList.push(currentNum);
        //finalList.push(finalNum);
        sum += currentNum;
    }
    //1console.log(sum);

    let addition_value = (add_sub === '+' ? increment_count : -increment_count);

    //console.log(`Adding ${addition_value}`);

    sum += addition_value;
    //console.log(sum);
    // console.log(sum, currentList, finalList);
    return ([sum, currentList]);
}

client.on('message', msg => {
    //// console.log(msg);
    if (/^!roll .*/.test(msg.content)) {
        const reg = /(?:(?<dice_count>\d+)[dD](?<dice_size>\d+))+(?: *(?<add_sub>[\+-]) *(?<constant>\d*))?\s*(?:#(?<comment>\w+))?/gm;
        let match, results = [];
        let sum = 0;
        let stringFin = '';
        let err_flag = false;
        // console.log(msg.content);
        let lastComment = ""
        let stringToParse = msg.content;//.replace(" ", "");

        do {
            match = reg.exec(stringToParse);
            console.log(match);
            // // console.log(match && match !== null);
            if (match) {
                let value = [];

                results.push(match);

                if (match.groups.add_sub) {
                    value = buildNumericalList(
                        parseInt(match.groups.dice_count),
                        parseInt(match.groups.dice_size),
                        match.groups.add_sub,
                        parseInt(match.groups.constant));
                } else {
                    value = buildNumericalList(
                        parseInt(match.groups.dice_count),
                        parseInt(match.groups.dice_size));
                }

                if (match.groups.comment) {
                    lastComment = match.groups.comment;
                }

                for (let i = 0; i < value[1].length; i++) {
                    if (value[1].length !== i + 1) {
                        stringFin += `${value[1][i]},`;
                    } else {
                        stringFin += `${value[1][i]}\n`;
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