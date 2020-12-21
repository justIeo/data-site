const roblox = require('noblox.js')
const fs = require('fs')
const discord = require('discord.js')
const { pid } = require('process')
const simpleGit = require('simple-git')();
const shellJs = require('shelljs');
const simpleGitPromise = require('simple-git/promise')();
require('dotenv').config()
const client = new discord.Client()
const prefix = '>'
const dev = '294291918022508547'
const owner = '664194188488867851'
client.login(process.env.DISCORD)
const pointjson = JSON.parse(fs.readFileSync('./data/points.json', 'utf-8'))
let binds = JSON.parse(fs.readFileSync('./data/binds.json', 'utf-8'))
let commandlist = JSON.parse(fs.readFileSync('./data/commands.json', 'utf-8'))

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}.`)
    client.user.setActivity('over the Grand Clone Army | >help', { type: 'WATCHING'})
    roblox.setCookie(process.env.ROBLOX)
})

client.on('message', async message => {
    if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    
    if (command === 'give') {
        if (!message.member.roles.cache.some(r => ['All Access'].includes(r.name)) || !message.member.roles.cache.some(r => ['Point Permissions'].includes(r.name))) return message.reply(new discord.MessageEmbed().setColor('#00ff00').setDescription('You cannot use this command. You need `All Access` or `Point Permissions` role to run this.'))
        let user = args[0]
        if (user.startsWith('<@!') == true) {
            user = message.mentions.members.first().nickname
        }
        if (!user) return message.channel.send(new discord.MessageEmbed().setDescription(`Couldn't find that user. Please make sure they/their nickname exists on ROBLOX.`).setColor('#ff0000'))
        let uID = await roblox.getIdFromUsername(user).catch(err => {
            console.log(err)
            return message.channel.send(new discord.MessageEmbed().setDescription(`This user does not exist on ROBLOX.`).setColor('#ff0000'))
        })
        let amount = args[1]
        if (!pointjson[uID]) {
            pointjson[uID] = {
                points: 0
            }
            fs.writeFileSync('./data/points.json', JSON.stringify(pointjson, null, 4), function (err) {
                console.log(err)
                message.channel.send(new discord.MessageEmbed().setDescription(`An error occured. Have <@${dev}> check the console.`).setColor('#ff0000'))
            })
        }
        pointjson[uID].points += Number(amount)
        fs.writeFileSync('./data/points.json', JSON.stringify(pointjson, null, 4), function (err) {
            console.log(err)
            message.channel.send(new discord.MessageEmbed().setDescription(`An error occured. Have <@${dev}> check the console.`).setColor('#ff0000'))
        })
        let power = pointjson[uID].points
        let rankid = await roblox.getRankInGroup(6757239, uID)
        let needed
        let json
        for (i = 0; i < binds.length; i++) {
            if (rankid == binds[i].rank) {
                needed = binds[i].needed
                if (needed == "∞") needed = Infinity
                newrank = binds[i].rank
            }
        }
        if (power >= needed) {
            if (rankid <= 9) {
                await roblox.setRank(6757239, uID, newrank + 1)
            }
        }
        let pEmbed = new discord.MessageEmbed()
                .setTitle("Power")
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ format: "png", dynamic: true })
                )
                .addFields(
                    { value: '-----------------------------', name: `**${user} / Power**` },
                    { name: `Player`, value: `${user} (${uID})`, inline: true },
                    { name: `Power`, value: `${power}`, inline: true },
                    { name: 'Group Rank', value: `${await roblox.getRole(6757239, rankid).get('name')} (${await roblox.getRole(6757239, rankid).get('rank')})`, inline: true },
                    { name: 'Next Rank', value: `${await roblox.getRole(6757239, rankid+1).get('name')} (${await roblox.getRole(6757239, rankid+1).get('rank')})`, inline: true },
                    { name: 'Progress', value: `**${power}/${needed} (${needed - power} to go)**`},
                )
                .setTimestamp()
                .setColor('#00ff00')
                .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
        message.channel.send(pEmbed)
    }
    if (command === 'remove') {
        if (!message.member.roles.cache.some(r => ['All Access'].includes(r.name)) || !message.member.roles.cache.some(r => ['Point Permissions'].includes(r.name))) return message.reply(new discord.MessageEmbed().setColor('#00ff00').setDescription('You cannot use this command. You need `All Access` or `Point Permissions` role to run this.'))
        let user = args[0]
        if (user.startsWith('<@!') == true) {
            user = message.mentions.members.first().nickname
        }
        if (!user) return message.channel.send(new discord.MessageEmbed().setDescription(`Couldn't find that user. Please make sure they/their nickname exists on ROBLOX.`).setColor('#ff0000'))
        let uID = await roblox.getIdFromUsername(user).catch(err => {
            console.log(err)
            return message.channel.send(new discord.MessageEmbed().setDescription(`This user does not exist on ROBLOX.`).setColor('#ff0000'))
        })
        let amount = args[1]
        if (!pointjson[uID]) {
            pointjson[uID] = {
                points: 0
            }
            fs.writeFileSync('./data/points.json', JSON.stringify(pointjson, null, 4), function (err) {
                console.log(err)
                message.channel.send(new discord.MessageEmbed().setDescription(`An error occured. Have <@${dev}> check the console.`).setColor('#ff0000'))
            })
        }
        pointjson[uID].points -= Number(amount)
        fs.writeFileSync('./data/points.json', JSON.stringify(pointjson, null, 4), function (err) {
            console.log(err)
            message.channel.send(new discord.MessageEmbed().setDescription(`An error occured. Have <@${dev}> check the console.`).setColor('#ff0000'))
        })
        let power = pointjson[uID].points
        let rankid = await roblox.getRankInGroup(6757239, uID)
        let needed
        let json
        for (i = 0; i < binds.length; i++) {
            if (rankid == binds[i].rank) {
                needed = binds[i].needed
                if (needed == "∞") needed = Infinity
                newrank = binds[i].rank
            }
        }
        if (rankid <= 9) {
            await roblox.setRank(6757239, uID, newrank - 1)
        }
        let pEmbed = new discord.MessageEmbed()
                .setTitle("Power")
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ format: "png", dynamic: true })
                )
                .addFields(
                    { value: '-----------------------------', name: `**${user} / Power**` },
                    { name: `Player`, value: `${user} (${uID})`, inline: true },
                    { name: `Power`, value: `${power}`, inline: true },
                    { name: 'Group Rank', value: `${await roblox.getRole(6757239, rankid).get('name')} (${await roblox.getRole(6757239, rankid).get('rank')})`, inline: true },
                    { name: 'Next Rank', value: `${await roblox.getRole(6757239, rankid+1).get('name')} (${await roblox.getRole(6757239, rankid+1).get('rank')})`, inline: true },
                    { name: 'Progress', value: `**${power}/${needed} (${needed - power} to go)**`},
                )
                .setTimestamp()
                .setColor('#00ff00')
                .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
        message.channel.send(pEmbed)
    }
    if (command === 'power') {
        let user = args[0]
        if (user.startsWith('<@!') == true) {
            user = message.mentions.members.first().nickname
        }
        if (!user) return message.channel.send(new discord.MessageEmbed().setDescription(`Couldn't find that user. Please make sure they/their nickname exists on ROBLOX.`).setColor('#ff0000'))
        let uID = await roblox.getIdFromUsername(user).catch(err => {
            console.log(err)
            return message.channel.send(new discord.MessageEmbed().setDescription(`This user does not exist on ROBLOX.`).setColor('#ff0000'))
        })
        if (!pointjson[uID]) {
            pointjson[uID] = {
                points: 0
            }
            fs.writeFileSync('./data/points.json', JSON.stringify(pointjson, null, 4), function (err) {
                console.log(err)
                message.channel.send(new discord.MessageEmbed().setDescription(`An error occured. Have <@${dev}> check the console.`).setColor('#ff0000'))
            })
        }
        let power = pointjson[uID].points
        let rankid = await roblox.getRankInGroup(6757239, uID)
        let needed
        let json
        for (i = 0; i < binds.length; i++) {
            if (rankid == binds[i].rank) {
                needed = binds[i].needed
                if (needed == "∞") needed = Infinity
                json = binds[i]
            }
        }
        if (power <= needed) {
            if (!rankid > 9) {
                await roblox.setRank(6757239, uID, json.rank)
            }
        }
        let pEmbed = new discord.MessageEmbed()
                .setTitle("Power")
                .setAuthor(
                    message.author.tag,
                    message.author.displayAvatarURL({ format: "png", dynamic: true })
                )
                .addFields(
                    { value: '-----------------------------', name: `**${user} / Power**` },
                    { name: `Player`, value: `${user} (${uID})`, inline: true },
                    { name: `Power`, value: `${power}`, inline: true },
                    { name: 'Group Rank', value: `${await roblox.getRole(6757239, rankid).get('name')} (${await roblox.getRole(6757239, rankid).get('rank')})`, inline: true },
                    { name: 'Next Rank', value: `${await roblox.getRole(6757239, rankid+1).get('name')} (${await roblox.getRole(6757239, rankid+1).get('rank')})`, inline: true },
                    { name: 'Progress', value: `**${power}/${needed} (${needed - power} to go)**`},
                )
                .setTimestamp()
                .setColor('#00ff00')
                .setThumbnail(`https://www.roblox.com/bust-thumbnail/image?userId=${uID}&width=420&height=420&format=png`)
        message.channel.send(pEmbed)
    }
    if (command == 'help') {
        let hEmbed = new discord.MessageEmbed()
            .setTitle('Help')
        for (i = 0; i < commandlist.length; i++) {
            hEmbed.addFields({ name: `${prefix}${commandlist[i].name}`, value: `${commandlist[i].description}`})
        }
        message.channel.startTyping(1)
        setTimeout(() => {
            message.channel.send(hEmbed)
            message.channel.stopTyping(true)
        }, 500)  
    }
    if (command == 'botname') {
        if (!message.author.id == dev || !message.author.id == owner) return message.reply(new discord.MessageEmbed().setColor('#ff0000').setDescription('You cannot use this command.'))
        let newname = args.slice(0).join(' ')
        client.user.setUsername(newname)
        message.reply(new discord.MessageEmbed().setDescription(`Done! My new tag is \`${client.user.tag}\`.`))
    }
    if (command == 'botavatar') {
        if (!message.author.id == dev || !message.author.id == owner) return message.reply(new discord.MessageEmbed().setColor('#ff0000').setDescription('You cannot use this command.'))
        let newav = args[0]
        client.user.setAvatar(newav)
        message.reply(new discord.MessageEmbed().setDescription(`Done! My new image is:`).setThumbnail(newav))
    }
    if (command == 'inituser') {
        let uID = args[0]
        if (!pointjson[uID]) {
            pointjson[uID] = {
                points: 0
            }
            fs.writeFileSync('./data/points.json', JSON.stringify(pointjson, null, 4), function (err) {
                console.log(err)
                message.channel.send(new discord.MessageEmbed().setDescription(`An error occured. Have <@${dev}> check the console.`).setColor('#ff0000'))
            })
        }
        shellJs.cd('D:/gca-bot')
        await simpleGit.addConfig('user.email', 'leo@justleo.me')
        await simpleGit.addConfig('user.name', 'justIeo')
        await simpleGitPromise.add('.')
        await simpleGitPromise.commit('-m "Update points.json"')
        await simpleGitPromise.push('https://justIeo:00Fm4st3r2006!@github.com/justIeo/gca-bot-data','master')
        message.channel.send('Pushed.')
    }
})