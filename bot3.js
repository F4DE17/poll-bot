const { Client, RichEmbed } = require('discord.js');
const bot = new Client();
const PREFIX = 'p!';
const polls_role = '691632341705293844';
const general = '678262972854042630';
const delete_channel = '678268908851036173';
const Sequelize = require("sequelize");
const { Op, UniqueConstraintError } = require("sequelize")


bot.on('ready', () =>{
    ServerPoll.sync()
    console.log('Poll bot is up and running!');
    bot.user.setActivity("p!help", {
    })
});
const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	logging: false,
	// SQLite only
	storage: 'database.sqlite',
});

const ServerPoll = sequelize.define("serverpoll", {
    guild_id: {
        type: Sequelize.STRING,
        unique: true,
    },
    who_ping: {
        type: Sequelize.STRING,
        unique: true,
    },
    where_ping: {
        type: Sequelize.STRING,
        unique: true,
    },
    poll_channel: {
        type: Sequelize.STRING,
        unique: true
    }
})

async function ping(message, args, chas) {
    if(!message.guild) return;
    if(message.guild.id == 733765399543414844) {
        if(message.channel.id != 734250972213280819) return;
        const channelPing = message.guild.channels.cache.find(ch => ch.id == 734250972213280819)
        channelPing.send(`${message.guild.roles.cache.find(r => r.id == 747521847255629935)}`)
        .then(message => {
            message.delete();
        })
    }
    if(message.guild.id == 678262972854042624) {
        if(message.channel.name != "『📊』polls") return;
        const channelPing = message.guild.channels.cache.find(ch => ch.name === "『🏆』general")
        if(!channelPing) return message.author.send("Can't find the general channel, no ping.")
        channelPing.send(`${message.guild.roles.cache.find(r => r.name === "[ - Poll Notifications - ]")} There is a new poll in the ${message.guild.channels.cache.find(ch => ch.id === 746882470200344646)} channel!\nPlease vote!`)
    }

}
bot.on("message", message =>{
    if(message.author.bot) return;
    if(!message.content.startsWith(PREFIX)) return;
    let args = message.content.substring(PREFIX.length).split(" ");
    let chas = message.content.substring(PREFIX.length).split("");

    if(message.content == 'p!help') {
        const { bot, MessageEmbed } = require('discord.js');
        const help_embed = new MessageEmbed()
        .setTitle("Poll Help")
        .setDescription("The defalt poll command is `p!poll <then your poll here>`")
        .addField("Poll Formats", "`pollembed` `poll1-10` `pollcostom` `pollnone`")
        .addField("Other Commands", "`wyr (would you rather)`")
        .setColor("ebd234")
        .setFooter("Hope this helped, if you have any more questions, ask F4DE.")
        message.channel.send(help_embed);
    }
    if(message.content == 'p!sample embed') {
        const { bot, MessageEmbed } = require('discord.js');
        const sample_embed = new MessageEmbed()
        .setTitle("A sample embed!")
        .setDescription("The poll would go here!")
        .setFooter(`Author of poll: ${message.member.nickname}`)
        .setColor("ebd234");
        message.channel.send(sample_embed);
    }
    switch(args[0]){
        case 'message':
            let msgArgsMessage = args.slice(2).join(" ");
            const channelSend = message.mentions.channels.first();
            if(!msgArgsMessage || !channelSend) return message.reply("Oops, I could not execute this commad because you did not tell me a channel to send your message in, or you had no message to send.")
            channelSend.send(msgArgsMessage)
        break;
        case 'wyr':
            let firstSecondSplit = message.content.substring(6).split(" | ")
            if(!firstSecondSplit) return message.reply("You need to split the would you rather into two sentances split by a `|`")
            message.delete();
            message.channel.send(`1️⃣ - ${firstSecondSplit[0]}\n2️⃣ - ${firstSecondSplit[1]}`).then(message => {
                message.react("1️⃣")
                message.react("2️⃣")
            })
        break;
        case 'react':
            if(!args[1]) return message.reply("That is not a valid emoji!")
            
            message.react(args[1])
        break;
        case 'recommend':
            const pollRecommendation = args.slice(1).join(" ");
            const generalChannel = message.guild.channels.cache.find(ch => ch.name === 'general🏆')
            generalChannel.send("Possible poll: ```" + pollRecommendation + "```\n `Poll Author: " + message.author.tag + "`").then(messageReaction => {
                messageReaction.react("👍");
                messageReaction.react("👎");
            })
        break;
        case 'poll':
            if(!args[1]) {
                message.channel.send(`You need to poll about someting ${message.author.username}, for example: p!poll Why is ${message.author.username} so stupid?`);
                break;
            }
            let msgArgs = args.slice(1).join(" ");
            message.channel.send(msgArgs).then(messageReaction => {
                message.delete()
                messageReaction.react("👍");
                messageReaction.react("👎");
            });
            ping(message, args, chas);
        break;
        case 'pollevil':
            if(!args[1]) {
                message.channel.send(`You need to poll about someting ${message.author.username}, for example: p!poll Why is ${message.author.username} so stupid?`);
                break;
            }
            let msgArgsEvil = args.slice(1).join(" ");
            message.channel.send("What would you like your poll to change to in 1 hour?")
            message.channel.awaitMessages(m => m.author.id === message.author.id, 
                {max: 1, time: 10000}).then(collected => {
                    const change_poll = collected.first()
            })
            message.channel.send(msgArgsEvil).then(messageReaction => {
                message.delete()
                messageReaction.react("👍");
                messageReaction.react("👎");
                messageReaction.react("🏆").then(message =>{
                    setTimeout(function(){
                        message.edit(change_poll)
                    }, (5000))
                })
            });
        break;
        case 'pollnone':
            if(!args[1]) {
                message.channel.send(`You need to poll about someting ${message.author.username}, for example: p!poll Why is ${message.author.username} so stupid?`);
                break;
            }
            let msgArgsNone = args.slice(1).join(" ");
            message.channel.send(msgArgsNone).then(messageReaction => {
                message.delete()
                messageReaction.react("✅")
            });
            const emojiPoll2 = '!'
            ping(message, args, chas)
        break;
        case 'pollembed':
            const { bot, MessageEmbed } = require('discord.js');
            if(message.channel.name === 'polls📊') {
                message.delete();
                message.author.send("Please try another channel to do this in!")
            }else{
                message.channel.send(`You have chosen to set up a poll in ${message.guild.name}, what would you like to be the title of the poll to be? You have one minute to decide.`)
                message.channel.awaitMessages(m => m.author.id === message.author.id, 
                {max: 1, time: 60000}).then(collected => {
                    let poll_title = collected.first();
                    message.channel.send("What would you like your poll to be? You have 2 minutes.")
    
                    message.channel.awaitMessages(m => m.author.id === message.author.id, 
                        {max: 1, time: 120000}).then(collected => {
                            let poll = collected.first();
                            message.channel.send("Complete! Thanks for making a poll!")
                            const pollembed_embed = new MessageEmbed()
                            .setTitle(poll_title)
                            .setDescription(poll)
                            .setFooter(`Author: ${message.author.username}`)
                            .setColor("ebd234")
                            .setTimestamp();
                            let poll_channel = message.guild.channels.cache.find(ch => ch.name === 'polls📊')
                            poll_channel.send(pollembed_embed).then(messageReaction => {
                                messageReaction.react("👍");
                                messageReaction.react("👎");
                            });
                            ping(message, args, chas)
                    })
                })
            }
        break;
        case 'poll1-10':
            if(!args[1]) {
                message.channel.send(`You need to poll about someting ${message.author.username}, for example: p!poll Why is ${message.author.username} so stupid?`);
                break;
            }
            let msgArgs110 = args.slice(1).join(" ");
            message.channel.send(msgArgs110).then(messageReaction => {
                message.delete()
                messageReaction.react("1️⃣")
                messageReaction.react("2️⃣")
                messageReaction.react("3️⃣")
                messageReaction.react("4️⃣")
                messageReaction.react("5️⃣")
                messageReaction.react("6️⃣")
                messageReaction.react("7️⃣")
                messageReaction.react("8️⃣")
                messageReaction.react("9️⃣")
                messageReaction.react("🔟");
            });
            ping(message, args, chas)
        break;
        case 'pollcostom':
            if(!args[1]||!args[2]) {
                message.delete()
                message.author.send("Hey! Make a real poll. For this type of poll: `pollcostom` you need two emojis for the first two arguments!")
            }
            try{
                const pollCostomContent = args.slice(1).join(" ")
                message.reply("What would you like your two emojis to be?")
                message.channel.awaitMessages(m => m.author.id === message.author.id, 
                    {max: 1, time: 120000}).then(collected => {
                        const reaction1 = args[0];
                        const reaction2 = args[1];
                        message.channel.send(pollCostomContent).then(messageReaction =>{
                            message.delete()
                            messageReaction.react(reaction1);
                            messageReaction.react(reaction2);
                        })
                })
            }catch(error){
                console.log(error)
            }
        break;
    }

});
bot.on("message", async message => {
    if(message.author.bot) return;
    if(!message.content.startsWith(PREFIX)) return;
    let args = message.content.substring(PREFIX.length).split(" ");
    let chas = message.content.substring(PREFIX.length).split("");

    switch(args[0]) {
        case 'all':
            message.channel.send(bot.guilds.map(s => `**${s.name}**`).join("\n"))
        break;
    }
})

bot.login(process.env.TOKEN);
