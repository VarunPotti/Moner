const Discord = require("discord.js");


const { memeAsync } = require('memejs');
const AntiSpam = require('discord-anti-spam');
const antiSpam = new AntiSpam({
	warnThreshold: 3, // Amount of messages sent in a row that will cause a warning.
	kickThreshold: 6, // Amount of messages sent in a row that will cause a kick.
	banThreshold: 3, // Amount of messages sent in a row that will cause a ban.
	muteThreshold: 3, // Amount of messages sent in a row that will cause a mute.
	maxInterval: 5000, // Amount of time (in milliseconds) in which messages are considered spam.
    warnMessage: "@{user_tag} please stop spamming you will be kicked and banned out if you spam 3 more times",
    kickMessage: '**{user_tag}** has been kicked for spamming.', // Message that will be sent in chat upon kicking a user.
	banMessage: '**{user_tag}** has been banned for spamming.', // Message that will be sent in chat upon banning a user.
	muteMessage: '**{user_tag}** has been muted for spamming.', // Message that will be sent in chat upon muting a user.
    maxDuplicatesWarning: 7, // Amount of same messages sent that will be considered as duplicates that will cause a warning.
    maxDuplicatesBan: 15, // Amount of same messages sent that will be considered as duplicates that will cause a ban.
    deleteMessagesAfterBanForPastDays: 1, // Amount of days in which old messages will be deleted. (1-7)
    exemptPermissions: ["ADMINISTRATOR"], // Bypass users with at least one of these permissions
    ignoreBots: true, // Ignore bot messages.
    verbose: false, // Extended Logs from module.
    ignoredUsers: [], // Array of string user IDs that are ignored.
    ignoredRoles: ['Bots'], // Array of string role IDs or role name that are ignored.
    ignoredGuilds: [], // Array of string Guild IDs that are ignored.
    ignoredChannels: [] // Array of string channels IDs that are ignored.
  });
  


const bot = new Discord.Client();
const MongoClient = require('mongodb').MongoClient;
const random_puppy = require('random-puppy')
const uri = "mongodb+srv://<username>:<password>@moner.tamcc.mongodb.net/moner?retryWrites=true&w=majority";
// const fetchUser = async id => console.log(bot.users.cache.get(id));

MongoClient.connect(uri, {
    useUnifiedTopology: true,
}, function (err, client) {
    if (err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n', err);
    }
    const collection = client.db("moner").collection("moneyInfo");
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let datebefore = date_ob.getDate()

    let date = date_ob.getDate() + 1;

    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    let year = date_ob.getFullYear();

    let hours = date_ob.getHours();

    let minutes = date_ob.getMinutes();

    let seconds = date_ob.getSeconds();

    bot.on("message", function (message) {
        antiSpam.message(message)
        if (message.content === "!daily") {
            var conn = collection.findOne({ "User": message.author.username }).then((val) => {

                if (val === null) {
                    collection.insertMany([{ "User": message.author.username, "coins": 100, "nextdate": year+month + date + hours + minutes + seconds, "today": year + month + datebefore + hours  + minutes + seconds }]);
                    message.channel.send("```You now have 100 more coins in your wallet```");
                    return;
                } else {
                    console.log("helo")
                    

                    collection.findOne({ "User": message.author.username }).then((val) => {
                        // year+ month + datebefore  + hours + minutes  + seconds
                        if (val["nextdate"] <= year+ month + datebefore  + hours + minutes  + seconds) {
                            collection.findOneAndUpdate({ "User": message.author.username }, { $inc: { coins: 100 }, $set: { nextdate: year +   month  + date  + hours   + minutes  + seconds }, $set: { today: year  + month + datebefore + hours + minutes + seconds } }).then((val) => {
                                message.channel.send("```You now have 100 more coins in your wallet```");
                            })
                        } else {
                            message.channel.send("```Come back tomorrow for more coins```")
                        }
                    });
                }
                return;
            });
            return;
        }

        if (message.content === "!wallet") {
            var conn = collection.findOne({ "User": message.author.username }).then((val) => {

                if (val === null) {
                    message.channel.send("```You don't have any account for running the command !wallet```")
                    return;
                } else {
                    message.channel.send("```" + message.author.username + " has " + val['coins'] + " coins in wallet" + "```")
                    return;
                }
                return;
            });

        }
        if (message.content === "!meme"){
            message.channel.send("Searching A meme")
            memechanels = ['ProgrammerHumor', 'memes']
            random = memechanels[Math.floor(Math.random() * memechanels.length)]
            memeAsync(random) // Use memeAsync('subredditname') to filter subreddits
            .then(data => {
            message.channel.send("From Subreddit " + random);
            message.channel.send(data.title)
        message.channel.send(data.url);
        })
            .catch(e => {
            console.log(e);
            })

            
        }
        function splitStr(str) {

            var string = str.split(" ");

            return string

        }
        var split = splitStr(message.content.toString());
        id = split[1]


        if (split[0] === '!wallet') {
            if (split[1] != null) {
                if (split[1].startsWith("<@")) {
                    var conn = collection.findOne({ "User": message.mentions.users.first().username }).then((val) => {

                        if (val === null) {
                            message.channel.send("```" + message.mentions.users.first().username + " Has No Profile```")
                            return;
                        } else {
                            message.channel.send("```" + message.mentions.users.first().username + " has " + val['coins'] + " coins in wallet" + "```")
                            return;
                        }
                        return;
                    });


                }
            }
        }
        if (split[0] === "!steal") {
            if (split[1] != null) {
                if (split[2] != null) {
                    if (split[2].startsWith("<@")) {
                        var conn = collection.findOne({ "User": message.mentions.users.first().username }).then((val) => {
                            var rand = Math.floor(Math.random() * Math.floor(100));

                            if (val === null) {
                                message.channel.send("```" + message.mentions.users.first().username + " Has No Profile```")
                                return;
                            } else {
                                console.log(rand);
                                // message.channel.send("```" + message.mentions.users.first().username + " has " + val['coins'] + " coins in wallet" + "```")
                                if (rand <= 45) {
                                    var max = collection.findOne({"User":message.mentions.users.first().username}).then((val) => {
                                        if (split[1] <= val["coins"]){
                                            message.channel.send("```Will be stealing " + split[1] + " from " + message.mentions.users.first().username + "```")
                                            collection.findOneAndUpdate({ "_id": val['_id'] }, { $inc: { coins: split[1] * -1 } }).then((val) => {
                                            })
                                            collection.findOneAndUpdate({ "User": message.author.username }, { $inc: { coins: split[1] * 1 } }).then((val) => {
                                            })   
                                            return;     
                                        }
                                        else{
                                            message.channel.send("```Cannot Let your opponent go bankrupt```")
                                            return;     

                                        }
                                    })
                                }
                                else {
                                    message.channel.send("```Steal Failure taking " + split[1] / 2 + " from " + message.author.username + " and giving " + message.mentions.users.first().username + " " + split[1] / 4 + "```")
                                    collection.findOneAndUpdate({ "_id": val['_id'] }, { $inc: { coins: split[1] / 4 } }).then((val) => {
                                    })
                                    collection.findOneAndUpdate({ "User": message.author.username }, { $inc: { coins: split[1] / 2 * -1 } }).then((val) => {
                                    })
                                }
                                return;
                            }
                            return;
                        });

                    }
                }
            }
        }
        return;

    });
    bot.login("<Your BOT ID>");

    console.log('Connected...');

    client.close();
});
