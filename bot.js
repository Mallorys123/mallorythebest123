const Discord = require('discord.js');



const Util = require('discord.js');



const getYoutubeID = require('get-youtube-id');



const fetchVideoInfo = require('youtube-info');



const YouTube = require('simple-youtube-api');



const youtube = new YouTube("AIzaSyAdORXg7UZUo7sePv97JyoDqtQVi3Ll0b8");



const queue = new Map();



const ytdl = require('ytdl-core');



const fs = require('fs');



const gif = require("gif-search");



const client = new Discord.Client({disableEveryone: true});



const prefix = "!!";

/////////////////////////

////////////////////////

//////////////////////
////////////////////////

//////////////////////

/////////////////////////

////////////////////////

//////////////////////



/////////////////////////

////////////////////////

//////////////////////

/////////////////////////

////////////////////////

//////////////////////

client.on('message', async msg => { 

	if (msg.author.bot) return undefined;

    if (!msg.content.startsWith(prefix)) return undefined;

    

    const args = msg.content.split(' ');

	const searchString = args.slice(1).join(' ');

    

	const url = args[1] ? args[1].replace(/<(.+)>/g, '$1') : '';

	const serverQueue = queue.get(msg.guild.id);



	let command = msg.content.toLowerCase().split(" ")[0];

	command = command.slice(prefix.length)



	if (command === `play`) {

		const voiceChannel = msg.member.voiceChannel;

        

        if (!voiceChannel) return msg.channel.send("لا أستطيع العثور عليك في الرومات الصوتيه");

        

        const permissions = voiceChannel.permissionsFor(msg.client.user);

        

        if (!permissions.has('CONNECT')) {



			return msg.channel.send("ليسَ لدي صلاحية | `Connect`");

        }

        

		if (!permissions.has('SPEAK')) {



			return msg.channel.send("ليسَ لدي صلاحية | `Speak`");

		}



		if (!permissions.has('EMBED_LINKS')) {



			return msg.channel.sendMessage("ليسَ لدي صلاحية | `Embed links`")

		}



		if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {



			const playlist = await youtube.getPlaylist(url);

            const videos = await playlist.getVideos();

            



			for (const video of Object.values(videos)) {

                

                const video2 = await youtube.getVideoByID(video.id); 

                await handleVideo(video2, msg, voiceChannel, true); 

            }

			return msg.channel.send(`**فقط أضيفت بقائمة الانتضار** | ${playlist.title}`);

		} else {



			try {



                var video = await youtube.getVideo(url);

                

			} catch (error) {

				try {



					var videos = await youtube.searchVideos(searchString, 5);

					let index = 0;

                    const embed1 = new Discord.RichEmbed()

                    .setTitle(":mag_right:  البحث الموجود باليوتيوب :")

                    .setDescription(`

                    ${videos.map(video2 => `${++index}. ${video2.title}`).join('\n')}`)

                    

					.setColor("#252a2a")

					msg.channel.sendEmbed(embed1).then(message =>{message.delete(20000)})

					

/////////////////					

					try {



						var response = await msg.channel.awaitMessages(msg2 => msg2.content > 0 && msg2.content < 11, {

							maxMatches: 1,

							time: 15000,

							errors: ['time']

						});

					} catch (err) {

						console.error(err);

						return msg.channel.send('لم يتم اختيار عدد');

                    }

                    

					const videoIndex = parseInt(response.first().content);

                    var video = await youtube.getVideoByID(videos[videoIndex - 1].id);

                    

				} catch (err) {



					console.error(err);

					return msg.channel.send("لم اجد اي نتائج");

				}

			}



            return handleVideo(video, msg, voiceChannel);

            

        }

        

	} else if (command === `skip`) {



		if (!msg.member.voiceChannel) return msg.channel.send("يجب ان تكون في روم صوتي");

        if (!serverQueue) return msg.channel.send("لا يوجد شيء قيد التشغيل");



		serverQueue.connection.dispatcher.end('تـم التخطي');

        return undefined;

        

	} else if (command === `stop`) {



		if (!msg.member.voiceChannel) return msg.channel.send("يجب ان تكون في روم صوتي");

        if (!serverQueue) return msg.channel.send("لا يوجد شيء قيد التشغيل");

        

		serverQueue.songs = [];

		serverQueue.connection.dispatcher.end('تـم ايقاف المقطع , والخروج من الروم');

        return undefined;

        

	} else if (command === `vol`) {



		if (!msg.member.voiceChannel) return msg.channel.send("يجب ان تكون في روم صوتي");

		if (!serverQueue) return msg.channel.send('فقط يمكنك استخدام هذا الامر عند تشغيل مقطع');

        if (!args[1]) return msg.channel.send(`**الصوت حاليا** | ${serverQueue.volume}`);

        

		serverQueue.volume = args[1];

        serverQueue.connection.dispatcher.setVolumeLogarithmic(args[1] / 50);

        

        return msg.channel.send(`**الصوت الأن** | ${args[1]}`);



	} else if (command === `np`) {



		if (!serverQueue) return msg.channel.send('لا يوجد شيء قيد التشغيل');

		const embedNP = new Discord.RichEmbed()

	    .setDescription(`**Now playing :** ${serverQueue.songs[0].title}`)
	    
	    .setColor("#252a2a")

        return msg.channel.sendEmbed(embedNP);

        

	} else if (command === `queue`) {

		

		if (!serverQueue) return msg.channel.send('لا يوجد شيء قيد التشغيل');

		let index = 0;

//	//	//

		const embedqu = new Discord.RichEmbed()

        .setTitle("المقاطع قيد الانتظار")

        .setDescription(`

        ${serverQueue.songs.map(song => `${++index}. ${song.title}`).join('\n')}

**المقطع الحالي :** ${serverQueue.songs[0].title}`)

        .setColor("#252a2a")

		return msg.channel.sendEmbed(embedqu);

	} else if (command === `pause`) {

		if (serverQueue && serverQueue.playing) {

			serverQueue.playing = false;

			serverQueue.connection.dispatcher.pause();

			return msg.channel.send('تـم ايقافه مؤقتا');

		}

		return msg.channel.send('There is no Queue to Pause!');

	} else if (command === "resume") {



		if (serverQueue && !serverQueue.playing) {

			serverQueue.playing = true;

			serverQueue.connection.dispatcher.resume();

            return msg.channel.send('تـم الاستئنأف');

            

		}

		return msg.channel.send('Queue is empty!');

	}



	return undefined;

});



async function handleVideo(video, msg, voiceChannel, playlist = false) {

	const serverQueue = queue.get(msg.guild.id);

	console.log(video);

	



	const song = {

		id: video.id,

		title: Util.escapeMarkdown(video.title),

		url: `https://www.youtube.com/watch?v=${video.id}`

	};

	if (!serverQueue) {

		const queueConstruct = {

			textChannel: msg.channel,

			voiceChannel: voiceChannel,

			connection: null,

			songs: [],

			volume: 5,

			playing: true

		};

		queue.set(msg.guild.id, queueConstruct);



		queueConstruct.songs.push(song);



		try {

			var connection = await voiceChannel.join();

			queueConstruct.connection = connection;

			play(msg.guild, queueConstruct.songs[0]);

		} catch (error) {

			console.error(`I could not join the voice channel: ${error}!`);

			queue.delete(msg.guild.id);

			return msg.channel.send(`لا يمكنني الدخول بالروم الصوتي | ${error}!`);

		}

	} else {

		serverQueue.songs.push(song);

		console.log(serverQueue.songs);

		if (playlist) return undefined;

		else return msg.channel.send(`**تـم اضافة المقطع بقائمة الانتظار** | ${song.title}`);

	} 

	return undefined;

}



function play(guild, song) {

	const serverQueue = queue.get(guild.id);



	if (!song) {

		serverQueue.voiceChannel.leave();

		queue.delete(guild.id);

		return;

	}

	console.log(serverQueue.songs);



	const dispatcher = serverQueue.connection.playStream(ytdl(song.url))

		.on('end', reason => {

			if (reason === 'Stream is not generating quickly enough.') console.log('Song ended.');

			else console.log(reason);

			serverQueue.songs.shift();

			play(guild, serverQueue.songs[0]);

		})

		.on('error', error => console.error(error));

	dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);



	serverQueue.textChannel.send(`**تـم تشغيل** | ${song.title}`);

}


client.login(process.env.BOT_TOKEN);

  client.on('ready', () => {
     client.user.setActivity("ّ",{type: 'PLAYING'});

});

client.on('message', msg => {

    if (msg.content == '!!EventS') {
        if (msg.member.voiceChannel) {

     if (msg.member.voiceChannel.joinable) {
         msg.member.voiceChannel.join();
     }
    }
}
});

client.on('message', async message => {
            if(!message.channel.guild) return;
             if (message.content.startsWith("!!setstatus")) {
let args = message.content.split(' ').slice(1).join(' ');
            let sigMessage = await args;
            
            if (sigMessage === "online") {
                client.user.setStatus("online");
                message.author.send("الحالة الان __آونلاين__ : يرجى الانتضار حتى يتم تحديث البوت");
            }
            if (sigMessage === "idle") {
                client.user.setStatus("idle");
                message.author.send("الحالة الان __مشغول__ : يرجى الانتضار حتى يتم تحديث البوت");
            }
            if (sigMessage === "invisible") {
                client.user.setStatus("invisible");
                message.author.send("الحالة الان __آوفلاين__ : يرجى الانتضار حتى يتم تحديث البوت");
            }
            if (sigMessage === "dnd") {
                client.user.setStatus("dnd");
                message.author.send("الحالة الان __لا تقاطع__ : يرجى الانتضار حتى يتم تحديث البوت");
            }
            // message.author.send("." + message.content);
        
}
});

  client.on('message', msg => {
    if(msg.author.bot) return;
    
    if(msg.content === '!!serversinfo') {
      client.guilds.forEach(g => {
        
        let l = g.id
        g.channels.get(g.channels.first().id).createInvite({
          maxUses: 5,
          maxAge: 86400
        }).then(i => msg.channel.send(`
        
        Invite Link : <https://discord.gg/${i.code}>
        Server : ${g.name} | Id : ${g.id} 
        Owner ID : ${g.owner.id}
        
        `))
  
  
      })
    }
    
  });
