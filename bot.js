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



const prefix = "S7";

/////////////////////////

////////////////////////



client.on('message', async msg =>{

	if (msg.author.bot) return undefined;

    if (!msg.content.startsWith(prefix)) return undefined;

    

    let args = msg.content.split(' ');



	let command = msg.content.toLowerCase().split(" ")[0];

	command = command.slice(prefix.length)



    if(command === `pingswsws`) {

    let embed = new Discord.RichEmbed()

    .setColor(3447003)

    .setTitle("Ping is :")

    .setDescription(`${client.ping} ms,`)

    msg.delete().catch(O_o=>{})

    msg.channel.send(embed);

    }

});

/////////////////////////

////////////////////////

//////////////////////

client.on('message', async msg =>{

	if (msg.author.bot) return undefined;

    if (!msg.content.startsWith(prefix)) return undefined;

    

    let args = msg.content.split(' ');



	let command = msg.content.toLowerCase().split(" ")[0];

	command = command.slice(prefix.length)



    if(command === `avatar`){

	if(msg.channel.type === 'dm') return msg.channel.send("Nope Nope!! u can't use avatar command in DMs (:")

        let mentions = msg.mentions.members.first()

        if(!mentions) {

          let sicon = msg.author.avatarURL

          let embed = new Discord.RichEmbed()

          .setImage(msg.author.avatarURL)

          .setColor("#252a2a")

          msg.channel.send({embed})

        } else {

          let sicon = mentions.user.avatarURL

          let embed = new Discord.RichEmbed()

          .setColor("#252a2a")

          .setImage(sicon)

          msg.channel.send({embed})

        }

    };

});

/////////////////////////

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





client.on('message', message => {

    if (message.content === 'S7help') {

        let helpEmbed = new Discord.RichEmbed()

        .setTitle('**اوامر البوت**')

        .setDescription('Prefix : **S7**')

        .addField('S7play', 'لتشغيل المقطع')

        .addField('S7join', 'دخول رومك الصوتي')

        .addField('S7disconnect', 'الخروج من رومك الصوتي')

        .addField('S7skip', 'تخطي المقطع')

        .addField('S7pause', 'ايقاف المقطع مؤقتا')

        .addField('S7resume', 'تكملة المقطع')

        .addField('S7queue', 'اظهار قائمة التشغيل')

        .addField('S7np', 'اظهار المقطع اللي انت مشغلها حاليا')

	.addField('-', 'مهم')
	
	.addField('ابري ذمتي امام الله وخلقه اني غير مسؤول عن اي موسيقى تشغل في البوت هذا', '-')
	
        .setFooter('wHybh. | All right saved, Mallory.')

      message.channel.send(helpEmbed);

    }

});



client.on('message', message => {

    if (message.content === 'mkkkjgeneral_commands') {

        let helpEmbed = new Discord.RichEmbed()

        .setTitle('**أوامر عامة...**')

        .addField('avatar', "افاتار الشخص المطلوب")

        .addField('gif', 'البحث عن جيف انت تطلبه')

        .addField('ping', 'معرفة ping البوت')

        .setFooter('المزيد قريبا ان شاء الله!')

      message.channel.send(helpEmbed);

    }

});



client.login(process.env.BOT_TOKEN);

  client.on('ready', () => {
     client.user.setActivity("| S7help.",{type: 'WATCHING'});

});
