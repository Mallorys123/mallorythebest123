const Discord = require('discord.js');
const client = new Discord.Client();
 const prefix = "$";
client.on('ready', () => {
client.user.setStatus('dnd');
console.log('I am ready!');
});

client.login(process.env.BOT_TOKEN);  //لا تغير هنااااااااااااااااا
//Test

let stylie;
client.on("ready", async  => {
  let guild = client.guilds.get("462085665371324427"); 
  let users = guild.members.map(member => member.user.id);
  let i;
  stylie=0;
for (i=0 ; i < users.length ; i++) {
 let   check = guild.members.get(users[i]);
if(!check.voiceChannelID){
        continue;
}else{
  stylie++;
}
}
guild.channels.find('id', '473687368722022400').setName("Stylie Online › "+stylie+" ");
  client.setInterval(() =>{
    let d = Date.now()
  }, 5000);
});
client.on('voiceStateUpdate', (oldMember, newMember) => {
    let guild = client.guilds.get("462085665371324427");
let newUserChannel = newMember.voiceChannel
let oldUserChannel = oldMember.voiceChannel
 if(oldUserChannel === undefined && newUserChannel !== undefined) {
   stylie++;
guild.channels.find('id', '473687368722022400').setName("Stylie Online › "+stylie+" ");
} else if(newUserChannel === undefined){
  stylie--;
guild.channels.find('id', '473687368722022400').setName("Stylie Online › "+stylie+" ");
}
});
client.on('message', stylies => {
  
  if(stylies.content === "$voice") {
      stylies.channel.send("Stylie Online › "+stylie+" ");
}
});

  client.on('message',async message => {
    if(message.content.startsWith(prefix + "restart")) {
        if(message.author.id !== "380307890235506698") return message.reply('You need permission');
        message.channel.send('Restarting .').then(msg => {
            setTimeout(() => {
               msg.edit('Restarting ..');
            },1000);
            setTimeout(() => {
               msg.edit('Restarting ...');
            },2000);
        });
        console.log(`${message.author.tag} [ ${message.author.id} ] has restarted the bot.`);
        console.log(`Restarting..`);
        setTimeout(() => {
            client.destroy();
        },3000);
    }
});

client.on('message', message => {
  var prefix = "$"
  if (message.author.id === client.user.id) return;
  if (message.guild) {
 let embed = new Discord.RichEmbed()
  let args = message.content.split(' ').slice(1).join(' ');
if(message.content.split(' ')[0] == prefix + 'bc') {
if(message.author.id !== '380307890235506698') return;
      message.guild.members.forEach(m => {
   m.send(args.replace(/\[user]/g,m));
       if(message.attachments.first()){
m.sendFile(message.attachments.first().url);
       }
   });
message.delete();    
  }
  } else {
      return;
  }
});

client.on('message', function(message) {
	const myID = "380307890235506698";
    let args = message.content.split(" ").slice(1).join(" ");
    if(message.content.startsWith(prefix + "name")) {
		        if(message.author.id !== myID) return;
            if(!args) return message.reply('آكتب آسم آلبوت الي تبيه');
        client.user.setUsername(args);
        message.channel.send(':white_check_mark: Done!').then(msg => {
           msg.delete(5000);
          message.delete(5000);
        });
    } else if(message.content.startsWith(prefix + "stream")) {
		        if(message.author.id !== myID) return;
            if(!args) return message.reply('اكتب الحالة اللي تريدها.');
        client.user.setGame(args , 'https://twitch.tv/6xlez1');
        message.channel.send(':white_check_mark: Done!').then(msg => {
           msg.delete(5000);
          message.delete(5000);
        });
    } else if(message.content.startsWith(prefix + "avatar")) {
				        if(message.author.id !== myID) return;
        client.user.setAvatar(args);
        message.channel.send(':white_check_mark: Done!').then(msg => {
                if(!args) return message.reply('رآبط الصورة لآزم مرفوع على موقع الدسكورد');
           msg.delete(5000);
          message.delete(5000);
        });
    }
});

client.on('message', msg => {
  if (msg.author.bot) return;
  if (!msg.content.startsWith(prefix)) return;
  let command = msg.content.split(" ")[0];
  command = command.slice(prefix.length);
  let args = msg.content.split(" ").slice(1);

    if(command === "clear") {
        const emoji = client.emojis.find("name", "wastebasket")
    let textxt = args.slice(0).join("");
    if(msg.member.hasPermission("MANAGE_MESSAGES")) {
    if (textxt == "") {
        msg.delete().then
    msg.channel.send("**``ضع عدد الرسائل التي تريد مسحها``**").then(m => m.delete(3000));
} else {
    msg.delete().then
    msg.delete().then
    msg.channel.bulkDelete(textxt);
        msg.channel.send("**```\nعدد الرسائل التي تم مسحها: " + textxt + "\n```**").then(m => m.delete(3000));
        }    
    }
}
});

client.on('message', msg => {
  if(msg.content.startsWith('$bo7')) {
    if(!msg.channel.guild) return msg.reply('** هاذا الامر فقط للسيرفرات**');
    if(!msg.guild.channels.find('name', 'bo7')) return msg.reply('**الرجاء إضافة روم بإسم (bo7)**');
    let args = msg.content.split(" ").slice(1);
    if(!args[1]) return msg.reply('**$bo7 `آلي بخاطرك`**')
    if(msg.guild.channels.find('name', 'bo7')) {
      msg.guild.channels.find('name', 'bo7').send(`
:heavy_minus_sign: :heavy_minus_sign: :heavy_minus_sign: 

** ${args.join(" ").split(msg.mentions.members.first()).slice(' ')} **

:heavy_minus_sign: :heavy_minus_sign: :heavy_minus_sign: 

' Emotion **:** ${msg.member} :hibiscus:
-
@here
`)
      .then(function (message) {
        message.react('')
        message.react('')
      })
      }
    }

});

client.on('message' , message => {
    var prefix = "$";
    var args = message.content.split(' ').slice(1).join(' ');
    if(message.content.startsWith(prefix +'chat...')) {
        const planet = message.guild.channels.get('470249380256153601');
        if(!planet) return;
        if(planet) {
            planet.send(args);
        }
    }
});

client.on("guildMemberAdd", function(member) {
    const wc = member.guild.channels.find("name", "welcome")
        const embed = new Discord.RichEmbed()
        .setColor('SILVER')
        .setAuthor(member.user.tag, member.user.avatarURL)
        .setFooter("شرفتنا بحظورك ياغالي")
        .setTimestamp()
        return wc.sendEmbed(embed);
});

 client.on('message', message => {
    if (message.content.startsWith("رابط")) {
        message.channel.createInvite({
        thing: true,
        maxUses: 3,
        maxAge: 3600,
    }).then(invite =>
      message.author.sendMessage(invite.url)
    )
    const embed = new Discord.RichEmbed()
        .setColor("SILVER")
          .setDescription("تم آرسال الرابط بالخاص")
           .setAuthor(client.user.username, client.user.avatarURL)
                 .setAuthor(client.user.username, client.user.avatarURL)

      message.channel.sendEmbed(embed).then(message => {message.delete(10000)})
              const Embed11 = new Discord.RichEmbed()
        .setColor("SILVER")
        
    .setDescription("مدة الرآبط : سآعة \n عدد آستخدامات الرابط : 3")
      message.author.sendEmbed(Embed11)
    }
});

client.on('message', message => {
          let args = message.content.split(' ').slice(1);
   if(message.content.split(' ')[0] == '$color'){
           const embedd = new Discord.RichEmbed()
     .setFooter('Requested by '+message.author.username, message.author.avatarURL)
   .setDescription(`لا يوجد لون بهذآ الرقم`)
   .setColor(`FFFFFF`)
 
    if(!isNaN(args) && args.length > 0)
   
 
if    (!(message.guild.roles.find("name",`${args}`))) return  message.channel.sendEmbed(embedd);
 
 
       var a = message.guild.roles.find("name",`${args}`)
                if(!a)return;
const embed = new Discord.RichEmbed()
                   
     .setFooter('Requested by '+message.author.username, message.author.avatarURL)
   .setDescription(`تم تغيير اللون بنجآح`)
 
   .setColor(`${a.hexColor}`)
  message.channel.sendEmbed(embed);
          if (!args)return;
setInterval(function(){})
                  let count = 0;
                  let ecount = 0;
        for(let x = 1; x < 201; x++){
           
            message.member.removeRole(message.guild.roles.find("name",`${x}`))
         
            }
                message.member.addRole(message.guild.roles.find("name",`${args}`));
       
           
    }
});

  client.on("guildBanAdd", (guild, member) => {
  client.setTimeout(() => {
    guild.fetchAuditLogs({
        limit: 1,
        type: 22
      })
      .then(audit => {
        let exec = audit.entries.map(a => a.executor.username);
        try {
          let log = guild.channels.find('name', 'log');
          if (!log) return;
          client.fetchUser(member.id).then(myUser => {
          let embed = new Discord.RichEmbed()
        .setAuthor(exec)
        .setThumbnail(myUser.avatarURL)
        .addField('- Banned User:',`${myUser.username}`,true)
        .addField('- Banned By:',`${exec}`,true)
        .setFooter(myUser.username,myUser.avatarURL)
            .setTimestamp();
          log.send(embed).catch(e => {
            console.log(e);
          });
          });
        } catch (e) {
          console.log(e);
        }
      });
  }, 1000);
});

  client.on('ready', () => {
     client.user.setActivity("Mallory The BEST!",{type: 'WATCHING'});

});

client.on('messageUpdate', (message, newMessage) => {
    if (message.content === newMessage.content) return;
    if (!message || !message.id || !message.content || !message.guild || message.author.bot) return;
    const channel = message.guild.channels.find('name', 'log');
    if (!channel) return;

    let embed = new Discord.RichEmbed()
       .setAuthor(`${message.author.tag}`, message.author.avatarURL)
       .setColor('SILVER')
       .setDescription(`✏ **تعديل رساله
ارسلها <@${message.author.id}>                                                                                                                         تم تعديلها في شات** <#${message.channel.id}>\n\nقبل التعديل:\n \`${message.cleanContent}\`\n\nبعد التعديل:\n \`${newMessage.cleanContent}\``)
       .setTimestamp();
     channel.send({embed:embed});


});

client.on('messageDelete', message => {
    if (!message || !message.id || !message.content || !message.guild || message.author.bot) return;
    const channel = message.guild.channels.find('name', 'log');
    if (!channel) return;
    
    let embed = new Discord.RichEmbed()
       .setAuthor(`${message.author.tag}`, message.author.avatarURL)
       .setColor('SILVER')
       .setDescription(`🗑️ **حذف رساله**
**ارسلها <@${message.author.id}>                                                                                                                        تم حذفها في شات** <#${message.channel.id}>\n\n \`${message.cleanContent}\``)
       .setTimestamp();
     channel.send({embed:embed});

});

client.on('message', msg => {

    if (msg.content == '$come.') {
        if (msg.member.voiceChannel) {

     if (msg.member.voiceChannel.joinable) {
         msg.member.voiceChannel.join();
     }
    }
}
});

client.on('guildMemberAdd', member => {
    const memberCount = [member.guild.memberCount]
    client.channels.get('477124283336884253').setName(`Mallory Users › ${memberCount}`);
});

client.on('guildMemberRemove', member => {
    const memberCount = [member.guild.memberCount]
    client.channels.get('477124283336884253').setName(`Mallory Users › ${memberCount}`);
});
