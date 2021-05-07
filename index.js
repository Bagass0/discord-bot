const Discord = require("discord.js");
const { getInfo } = require("ytdl-core");
const ytdl = require("ytdl-core");

const Client = new Discord.Client;
const prefix = "*";
var list = [];


Client.on("ready", () => {
        console.log("Le Bot est ON !");
});


Client.on("message", async message => {
    if(message.content === prefix + "list"){
        let msg = "**FILE D'ATTENTE !**\n";
        for(var i=0; i<list.length; i++){
            let name;
           let getinfo = await ytdl.getBasicInfo(list[i]);
            name = getinfo.videoDetails.title;
            msg += "> " + (i+1) + " - " + name + "\n";
        }
        message.channel.send(msg);
    }

    if(message.content.startsWith(prefix + "play") || message.content.startsWith(prefix + "p")){
        if(message.member.voice.channel){
            let args = message.content.split(/ +/);
                if(args[1] == undefined || !args[1].startsWith("https://www.youtube.com/watch?v=")){
                    message.reply("Lien de la musique non ou mal mentionné !");    
                }
                else{
                    if(list.length > 0) {
                        list.push(args[1]);
                        let msg = "**FILE D'ATTENTE !**\n";
                        for(var i=0; i<list.length; i++){
                            let name;
                           let getinfo = await ytdl.getBasicInfo(list[i]);
                            name = getinfo.videoDetails.title;
                            msg += "> " + (i+1) + " - " + name + "\n";
                        }
                        message.channel.send(msg);
                    } 
                    else{
                        list.push(args[1]);
                        let msg = "**FILE D'ATTENTE !**\n";
                        for(var i=0; i<list.length; i++){
                            let name;
                           let getinfo = await ytdl.getBasicInfo(list[i]);
                            name = getinfo.videoDetails.title;
                            msg += "> " + (i+1) + " - " + name + "\n";
                        }
                        message.channel.send(msg);

                        message.member.voice.channel.join().then(connection => {
                            playMusic(connection);

                            connection.on("disconnect", () => {
                                list = [];        
                            });

                        }).catch(err => {
                            message.reply("Erreur" + err);
                        });
                    } 
                }
        } 
    }    
});

function playMusic(connection){
    let dispatcher = connection.play(ytdl(list[0], { quality: "highestaudio" }));
    dispatcher.on("finish", () => {
        list.shift();
        dispatcher.destroy();

        if(list.length > 0){
            playMusic(connection);
        }
        else{
            connection.disconnect();
        }  
    });
    dispatcher.on("error", err =>{
        console.log("erreur de dispatcher: " + err);
        dispatcher.destroy();
        connection.disconnect();
    });
}

Client.login(process.env.TOKEN);