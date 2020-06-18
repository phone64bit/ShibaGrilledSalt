const Discord = require('discord.js');
const { Client , MessageEmbed } = require('discord.js');
const client = new Client();
const prefix = 's!';
const db = require('quick.db')
const humanizeDuration = require("humanize-duration");
const usedCommandRecently = new Map();
const usedResetCooldown = new Map();
const antispamswitchcooldown = new Map();
const antispamuser = new Map();
const antiswearswitchcooldown = new Map();
const antiinviteswitchcooldown = new Map();
const typepracticeswitch = new Map();
const { badwords } = require('./swearword.json')
var dateFormat = require('dateformat');
var now = new Date();
var version = '1.2.1';


client.on('ready', () => {
  client.user.setActivity({name: "กำลังเริ่มต้นระบบ! กรุณารอสักครู่", type: "PLAYING"});
  
  function randomstatus() {
    let status = [`s!help | ${client.users.cache.size} Users!`, `s!help | ${client.guilds.cache.size} Servers!`]
    let rstatus = Math.floor(Math.random() * status.length);
    client.user.setActivity(status[rstatus], {type: "WATCHING"});
  }; setInterval(randomstatus, 15000)

  console.log(`เข้าสู่ระบบในของ ${client.user.tag}! เวอร์ชั่น ` + version + ` กำลังดู ${client.users.cache.size} คน อยู่ใน ${client.guilds.cache.size} เซิพ `);
});

client.on('guildCreate', guild => {

  console.log("[+] เข้าเซิพเวอร์ " + guild.name)

let defaultChannel = "";
guild.channels.cache.forEach((channel) => {
  if(channel.type == "text" && defaultChannel == "") {
    if(channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
      defaultChannel = channel;
    } else return;
  }
})

defaultChannel.send("✿ :service_dog: ขอบคุณนายท่านที่เพิ่มข้าน้อยเข้าเซิพเวอร์นะ โฮ่ง~~!!! :service_dog: ✿\n \n► :guide_dog: พิม s!help เพื่อดูคำสั่งทั้งหมดนะ โฮ่ง ~! 』\n► :dog2: ดิสคอร์ด พูด-คุย แจ้งปัญหาบอท https://discord.gg/yTkSsnR ")
})

client.on('guildDelete', guild => {
  console.log("[-] ออกเซิพเวอร์ " + guild.name)
})


client.on('guildMemberAdd', member => {

})

client.on('message', message => {

  if(message.author.bot) return;

  if (message.guild === null) return message.reply("พบข้อผิดพลาด (<DM/ GROUP DETECTED?u4lly33x report>)").then(console.log(message.author.id + " , " + message.author.username + "[-+-] DM DETECT REPORT [-+-]"))

  let serverPrivateChannel = db.get(`spc.${message.guild.id}`)

  if(!serverPrivateChannel) {
    db.set(`spc.${message.guild.id}`, "off")
  } 

  let antiswearswitch = db.get(`antiswear.${message.guild.id}`)
  if (!antiswearswitch) {
    db.set(`antiswear.${message.guild.id}`, "off")
  }

  let antispamswitch = db.get(`antispam.${message.guild.id}`)
  if (!antispamswitch) {
    db.set(`antispam.${message.guild.id}`, "off")
  }

  let antiinvitelinkswitch = db.get(`antiinvitelink.${message.guild.id}`)
  if (!antiinvitelinkswitch) db.set(`antiinvitelink.${message.guild.id}`, "off")

  let wwsetupswitch = db.get(`wwsetupswitch_${message.guild.id}`)

  let antispamtime = db.get(`antispamtime.${message.guild.id}`)

  if(!antispamtime) {
   antispamtime = 3600;
  }

  let serverPrivateCatetory = db.get(`spcate.${message.guild.id}`)


  let memberrequire = db.get(`memberrequired.${message.guild.id}`);
  let memberrequired;
  
        if(!memberrequire) memberrequire = Math.floor(message.guild.memberCount / 4)

  let timekick = db.get(`timekick.${message.guild.id}`);
  let timekicknormal;

       if(!timekick) {
          timekicknormal = 15;
       }

    if (message.mentions.users.first() === client.user) {
        message.reply("ว่าไง นายท่าน ถ้าหากอยากเรียนรู้เกี่ยวกับข้าน้อยให้พิม s!help เลยนะ โฮ่ง โฮ่ง~~!")
    }

    if(antiinvitelinkswitch === "on") {

      if(!message.member.hasPermission("ADMINISTRATOR")) {
      
      let inviteLink = ["discord.gg", "discord.com/invite", "discordapp.com/invite"];

      if(inviteLink.some(word => message.content.toLowerCase().includes(word))) {
       message.delete();
        const embed = new MessageEmbed()
        .setTitle("🐕 ข้าน้อยตรวจพบลิงก์เชิญ 🐕") 
        .setDescription(message.member.toString() + " 💥 นายท่านไม่สามารถแจกจ่ายลิงก์ดิสคอร์ดในเซิพเวอร์นี้ได้นะ โฮ่ง~~! 💥")
        .setColor(0xFF0000)
        message.channel.send(embed).then(m => m.delete({timeout: 10000}))
      }
    }
  }

    if(antiswearswitch === "on") {
      if(!message.member.hasPermission("ADMINISTRATOR")) {
        let confirm = false;
        var i;
        for(i = 0;i < badwords.length; i++) {
          if(message.content.toLowerCase().includes(badwords[i].toLowerCase()))
          confirm = true;
        }

        if(confirm) {
          message.delete()
          const embed = new MessageEmbed()
           .setTitle("🐕 ข้าน้อยตรวจพบคำไม่สุภาพ! 🐕")
           .setDescription(message.member.toString() + "💥 นายท่านต้องพิมให้สุภาพหน่อยนะ โฮ่ง~~!💥")
           .setThumbnail(message.member.user.avatarURL({dynamic: true , size : 512}))
          message.channel.send(embed).then(m => m.delete({timeout: 10000}))
        }
      }
    }

    if(message.content === "ชิบะ") return message.channel.send("มีอะไรหรอนายท่าน ?")

    if(antispamswitch === "on") { // ระบบกันฟลัด ////////////////////////////////////////////////////

    if(antispamuser.has(message.author.id)) {
      let ms2 = Math.floor(db.get(`antispamtime.${message.guild.id}`) * 1000);
      let msminute2 = Math.floor((ms2/1000/60) % 60)
      let mssecond2 = Math.floor((ms2/1000) % 60)
      let mshour2 = Math.floor((ms2/1000/60/60) % 24)
      let msday2 = Math.floor((ms2/1000/60/60/24))
      let msminutedis2 = Math.floor((ms2/1000/60) % 60)
      let msseconddis2 = Math.floor((ms2/1000) % 60)
      let mshourdis2 = Math.floor((ms2/1000/60/60 % 24))
      let msdaydis2 = Math.floor((ms2/1000/60/60/24))
      if (mshour2 === 0) mshour2 = 1;
      if (msminute2 === 0) msminute2 = 1;
      if (mssecond2 === 0) mssecond2 = 1;
      if (msday2 === 0) msday2 = 1;
      let alltime2 = Math.floor((ms2 * 1000))
      const userData = antispamuser.get(message.author.id);
      let msgCount = antispamuser.get(message.author.id).msgCount;
      ++msgCount;

      if(parseInt(msgCount) === 20) {
        message.member.kick("ระบบกันฟลัดชิบะทำงาน")
        const embed = new MessageEmbed()
         .setDescription("🤖 เตะ " + message.author.username + " ออกจากเซิพแล้ว!")
         .setColor("0xFF0000")
         .setTimestamp(now)
        message.channel.send(embed)
      }

      if(parseInt(msgCount) === 7) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⌛ นายท่านต้องรอ `5` วินาทีก่อนที่จะพิมอีกครั้งนะ โฮ่ง~~! `<เตือนครั้งที่ 1/3>`")
         .setColor(0x00FFFF)
         .setTimestamp(now)
        message.delete();
        message.channel.send(embed).then(m => m.delete({timeout: 10000}))
      }

      if(parseInt(msgCount) === 8) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⌛ นายท่านต้องรอ `5` วินาทีก่อนที่จะพิมอีกครั้งนะ โฮ่ง~~! `<เตือนครั้งที่ 2/3>`")
         .setColor(0x00FFFF)
         .setTimestamp(now)
        message.delete();
        message.channel.send(embed).then(m => m.delete({timeout: 10000}))
      }

      if(parseInt(msgCount) === 9) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⌛ นายท่านต้องรอ `5` วินาทีก่อนที่จะพิมอีกครั้งนะ โฮ่ง~~! `<เตือนครั้งที่ 3/3>`")
         .setColor(0x00FFFF)
         .setTimestamp(now)
        message.delete();
        message.channel.send(embed).then(m => m.delete({timeout: 10000}))
      }

      if(parseInt(msgCount) === 10) {
        let muterole = message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System")

        if (!muterole) {
          message.guild.roles.create({
            data: {
              name: "✿ Shiba ✿ Mute System",
              color: 0xF25E23,
              permissions: ["READ_MESSAGE_HISTORY", "CONNECT", "VIEW_CHANNEL"]
            }
            }).then(async newrole => {
              const promises = [];
              for(const channel of message.guild.channels.cache.values())
              promises.push(channel.updateOverwrite(newrole, {SEND_MESSAGES: false, SPEAK: false, ADD_REACTIONS: false}))
              Promise.all(promises);
            }).catch(err => {message.reply(`พบปัญหา ${err}!`), console.log("[!] PROMISE ERROR REPORT [!]")})
        }

        if (message.member.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System")) return;

        message.member.roles.add(message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System")).catch(err => {console.log("[!] ANTI SPAM ERROR REPORT [!]"), message.reply(`พบปัญหา ${err}! กรุณาแจ้งผู้พัฒนา`)})
        const embedmute2 = new MessageEmbed()
         .setTitle("👨‍⚖️ ทำการพิพากษา")
         .setDescription("✅ โรงพยาบาลศรีธัญญาได้ฉีดยาเพื่อทำการใบ้ " + message.member.toString() + " เรียบร้อยแล้ว")
         .addField("เป็นเวลา", `${msdaydis2} วัน ${mshourdis2} ชม. ${msminutedis2} นาที ${msseconddis2} วินาที`, false)
        .setFooter(now)
        message.channel.send(embedmute2)
        setTimeout(() => {
          message.member.roles.remove(message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System")).catch(err => console.log("[!] ANTI SPAM ERROR REPORT [!]"))
            const embedmutefinish = new MessageEmbed()
        .setTitle("🐕 การรักษาสำเร็จ! 🏥")
        .setDescription(message.member.toString() + " รักษาหายจากการใบ้แล้ว!")
        .setFooter(now)
           message.channel.send(embedmutefinish)
        }, ms2)

      } else {
        userData.msgCount = msgCount;
        antispamuser.set(message.author.id, userData);
      }
    } else {
      let functionmute = setTimeout(() => { 
        antispamuser.delete(message.author.id)
        console.log("[AS SYSTEM] ลบ " + message.author.username + " ออกจากระบบ")
      }, 10000);
      antispamuser.set(message.author.id, {
        msgCount: 1,
        lastMessage: message,
        timer: functionmute
      })
    }
  }

    let args = message.content.substring(prefix.length).split(" ");
    let command = args.shift().toLowerCase();
    
    switch(command) {

        case 'help': // การช่วยเหลือคำสั่ง ---------------------------

        if(args[0] === '3') {

          const embed = new MessageEmbed()
          .setTitle("หน้าต่างคำสั่ง `(3/3)`")
          .setColor(0x00FFFF)
          .setDescription("✿ คำสั่งของชิบะย่างเกลือหน้า `<3/3>` ✿")
          .addField("s!serverinfo", "`เกี่ยวกับเซิพเวอร์`", false)
          .addField("s!userinfo @คนที่ต้องการดู", "`ดูข้อมูลคนในเซิพเวอร์`", false)
          .addField("s!channelinfo", "`ดูรายละเอียดของช่อง`", false)
          .addField("s!about" , "`เกี่ยวกับบอท`", false)
          .addField("s!clearchat <จำนวน>", "`ล้างแชทตามจำนวน`", false)
          .addField("s!rn", "`ระบบสุ่มเลข <หวย>`", false)
          .addField("s!rm", "`ระบบสุ่มคนในเซิพเวอร์`", false)
          message.author.send(embed)
          const embedhelpsend = new MessageEmbed()
          .setDescription(" ✅ `ข้าน้อยส่งรายละเอียดไปให้ในแชทส่วนตัวแล้วนะ โฮ่ง~~!`")
          .setColor(0x00FFFF)
          .setTimestamp(now)
          .setThumbnail(message.guild.me.user.avatarURL({dynamic : true, size : 2048}))
         message.channel.send(embedhelpsend).catch(err => console.log("[!] HELP SEND ERROR [!]"))
    
          break;
        }

        if(args[0] === '2') {
          const embed = new MessageEmbed()
          .setTitle("หน้าต่างคำสั่ง `(2/3)`")
          .setColor(0x00FFFF)
          .setDescription("✿ คำสั่งของชิบะย่างเกลือหน้า `<2/3>` ✿")
          .addField("s!jail @คนที่ต้องการจำคุก <เวลา : วินาที>", "`จำคุกคนในเซิพเวอร์`", false)
          .addField("s!unjail @คนที่ต้องการประกันตัว", "`ประกันตัวคนออกจากคุก`", false)
          .addField("s!privateme", "`สร้างห้องส่วนตัว` <ระบบนี้เป็นระบบทดลอง อาจจะมีปัญหาบ้างนะ>", false)
          .addField("s!privateme <on/off/reset>", "`on เพื่อเปิด off เพื่อปิด reset เพื่อรีเซ็ตข้อมูลในระบบ`", false)
          .addField("s!antispam <on/off/settime>", "`on เพื่อเปิด off เพื่อปิด settime เพื่อตั้งเวลาที่จะใบ้เมื่อพิมเกินที่ระบบกำหนด`", false)
          .addField("s!antiswear <on/off>", "`on เพื่อเปิด off เพื่อปิดระบบกันคำหยาบ`")
          .addField("s!antiinvite <on/off>", "`on เพื่อเปิด off เพื่อปิดระบบกันลิงก์เชิญ`")

          message.author.send(embed)
          const embedhelpsend = new MessageEmbed()
          .setDescription(" ✅ `ข้าน้อยส่งรายละเอียดไปให้ในแชทส่วนตัวแล้วนะ โฮ่ง~~!`")
          .setColor(0x00FFFF)
          .setTimestamp(now)
          .setThumbnail(message.guild.me.user.avatarURL({dynamic : true, size : 2048}))
         message.channel.send(embedhelpsend).catch(err => console.log("[!] HELP SEND ERROR [!]"))
          break;
        }
        if(args[0] === '1' || !args[0]) {
    const embed = new MessageEmbed()
     .setTitle("หน้าต่างคำสั่ง `(1/3)`")
     .setColor(0x00FFFF)
     .setDescription("✿ คำสั่งของชิบะย่างเกลือหน้า `<1/3>` ✿")
     .addField("s!help <หน้า>", "`เปิดหน้าช่วยเหลือเกี่ยวกับคำสั่ง`", false)
     .addField("s!kick @คนที่ต้องการเตะ <เหตุผล>", "`เตะคนออกจากเซิพเวอร์!`",false )
     .addField("s!ban @คนที่ต้องการแบน <เหตุผล>", "`แบนคนออกจากเซิพเวอร์!`", false)
     .addField("s!mute @คนที่ต้องการใบ้ <เวลา>", "`ใบ้คนในเซิพเวอร์!`", false)
     .addField("s!unmute @คนที่ต้องการเลิกใบ้", "`เลิกใบ้คนที่ถูกใบ้อยู่แล้ว`", false)
     .addField("s!votekick @คนที่ต้องการโหวต", "`โหวตเพื่อเตะคนออกจากเซิพเวอร์`", false)
     .addField("s!votekick setMin <คน>","`ตั้งค่าจำนวนคนอย่างต่ำในการโหวต`", false)
     .addField("s!votekick settime <เวลา>","`ตั้งค่าเวลาในการโหวต`", false)

    message.author.send(embed)


    const embedhelpsend = new MessageEmbed()
     .setDescription(" ✅ `ข้าน้อยส่งรายละเอียดไปให้ในแชทส่วนตัวแล้วนะ โฮ่ง~~!`")
     .setColor(0x00FFFF)
     .setTimestamp(now)
     .setThumbnail(message.guild.me.user.avatarURL({dynamic : true, size : 2048}))
    message.channel.send(embedhelpsend).catch(err => console.log("[!] HELP SEND ERROR [!]"))
        break;
        }
        if(args[0] !== '1' || args[0] !== '2' || args[0] !== '3') {
          const embed = new MessageEmbed()
           .setDescription("❌หน้าช่วยเหลือคำสั่งมีทั้งหมด `3` หน้านะ โฮ่ง ~~!")
           .setColor(0xFF0000)
          message.channel.send(embed)
           break;
        } break;

        case 'about': // เกี่ยวกับบอท ---------------------------

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }
    const embed2 = new MessageEmbed()
     .setDescription("¯'°.★ เกี่ยวกับบอท ★.°'¯\n \n— สร้างเมื่อ `31/05/2020` —\n— ผู้พัฒนา `u4lly33x` —\n— รูปโดย `powerpream` —\n— เวอร์ชั่น " + version + "\n— ดิสคอร์ด https://discord.gg/yTkSsnR —")
     .setColor(0x00FFFF)
     .setFooter("ขอให้ใช้อย่างสนุกนะครับ :)")
     .setThumbnail(message.guild.me.user.avatarURL({dynamic : false, size: 512}))
    message.channel.send(embed2)
        break;

        case 'serverinfo': //เกี่ยวกับเซิพเวอร์ --------------------------------------------
        
        
        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
        }
          if(!message.member.hasPermission("ADMINISTRATOR")) {
            let created = dateFormat(message.guild.createdAt);
            const embed7 = new MessageEmbed()
            .setColor(0x00FFFF)
            .addField("ชื่อเซิพเวอร์ :", message.guild.name, false)
            .addField("สร้างเมื่อ :", `${created}`, false)
            .addField("เจ้าของเซิพเวอร์ :", message.guild.owner.user.username, false)
            .addField("จำนวนคนทั้งหมดในเซิพเวอร์ :", `${message.guild.members.cache.filter(member => !member.user.bot).size}`, false)
            .addField("จำนวนบอททั้งหมดในเซิพเวอร์ :", `${message.guild.members.cache.filter(member => member.user.bot).size}`, false)
            .setThumbnail(message.guild.iconURL({size : 2048}))
            .setTimestamp(now)
           message.channel.send(embed7)
           break;
      }
        if(message.member.hasPermission("ADMINISTRATOR")) {
          let created = dateFormat(message.guild.createdAt);
      const embed6 = new MessageEmbed()
       .setColor(0x00FFFF)
       .addField("ชื่อเซิพเวอร์ :", message.guild.name, false)
       .addField("ไอดีเซิพเวอร์ :", message.guild.id, false)
       .addField("สร้างเมื่อ :", `${created}`, false)
       .addField("เจ้าของเซิพเวอร์ :", message.guild.owner.user.username, false)
       .addField("จำนวนคนทั้งหมดในเซิพเวอร์ :", `${message.guild.members.cache.filter(member => !member.user.bot).size}`, false)
       .addField("จำนวนบอททั้งหมดในเซิพเวอร์ :", `${message.guild.members.cache.filter(member => member.user.bot).size}`, false)
       .addField("จำนวนช่องทั้งหมด :", message.guild.channels.cache.size, false)
       .addField("จำนวนยศทั้งหมด :", message.guild.roles.cache.size, false)
       .setThumbnail(message.guild.iconURL({size : 2048}))
       .setTimestamp(now)
      message.channel.send(embed6)
      break;
        } 

        case 'userinfo': // เกี่ยวกับคน -------------------------------xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

        let target4 = message.mentions.users.first() || message.author;

        function game() {
          let game;
          if(target4.presence.activities.length >= 1) game = `${target4.presence.activities[0].name}`
          else if(target4.presence.activities.length < 1) game = "ไม่ได้เล่นเกม";
          return game;
        }

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }
        if(target4.presence.status === "dnd") {    
        const embed = new MessageEmbed()
             .setTitle("เกี่ยวกับ " + `${target4.username}`)
             .setColor("0x00FFFF")
             .addField("ชื่อ :", `${target4.username}`, false)
             .addField("ไอดี :", target4.id, false)
             .addField("เข้าร่วมเซิพเวอร์เมื่อ :", dateFormat(target4.joinedAt), false)
             .addField("สร้างไอดีเมื่อ :", dateFormat(target4.createdAt), false)
             .addField("สถานะ :", "ห้ามรบกวน" , false)
             .addField("กำลังเล่นเกม :", game() || "ไม่ได้เล่นเกม" , false)
             .setFooter(now)
             .setThumbnail(target4.avatarURL({dynamic: true, size: 2048}))
            message.channel.send(embed)
            break;
        }
        if(target4.presence.status === "idle") {    
          const embed = new MessageEmbed()
               .setTitle("เกี่ยวกับ " + `${target4.username}`)
               .setColor("0x00FFFF")
               .addField("ชื่อ :", `${target4.username}`, false)
               .addField("ไอดี :", target4.id, false)
               .addField("เข้าร่วมเซิพเวอร์เมื่อ :", dateFormat(target4.joinedAt), false)
               .addField("สร้างไอดีเมื่อ :", dateFormat(target4.createdAt), false)
               .addField("สถานะ :", "ไม่อยู่" , false)
               .addField("กำลังเล่นเกม :", game() || "ไม่ได้เล่นเกม" , false)
               .setFooter(now)
               .setThumbnail(target4.avatarURL({dynamic: true, size: 2048}))
              message.channel.send(embed)
              break;
          }
          if(target4.presence.status === "online") {    
            const embed = new MessageEmbed()
                 .setTitle("เกี่ยวกับ " + `${target4.username}`)
                 .setColor("0x00FFFF")
                 .addField("ชื่อ :", `${target4.username}`, false)
                 .addField("ไอดี :", target4.id, false)
                 .addField("เข้าร่วมเซิพเวอร์เมื่อ :", dateFormat(target4.joinedAt), false)
                 .addField("สร้างไอดีเมื่อ :", dateFormat(target4.createdAt), false)
                 .addField("สถานะ :", "ออนไลน์" , false)
                 .addField("กำลังเล่นเกม :", game() || "ไม่ได้เล่นเกม" , false)
                 .setFooter(now)
                 .setThumbnail(target4.avatarURL({dynamic: true, size: 2048}))
                message.channel.send(embed)
                break;
            }
            if(target4.presence.status === "offline") {    
              const embed = new MessageEmbed()
                   .setTitle("เกี่ยวกับ " + `${target4.username}`)
                   .setColor("0x00FFFF")
                   .addField("ชื่อ :", `${target4.username}`, false)
                   .addField("ไอดี :", target4.id, false)
                   .addField("เข้าร่วมเซิพเวอร์เมื่อ :", dateFormat(target4.joinedAt), false)
                   .addField("สร้างไอดีเมื่อ :", dateFormat(target4.createdAt), false)
                   .addField("สถานะ :", "ออฟไลน์" , false)
                   .setFooter(now)
                   .setThumbnail(target4.avatarURL({dynamic: true, size: 2048}))
                  message.channel.send(embed)
                  break;
              }


        case 'kick': // เตะคน -----------------------------------------------------------------------------------------------------------------------------------------------

        let target = message.guild.member(message.mentions.members.first())

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
            message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
            break;
        }

        if(message.guild.members.cache.get(args[0])) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " ⛔ นายท่านไม่สามารถเตะคนที่ไม่อยู่ในเซิพเวอร์ได้นะ โฮ่ง~~")
           .setColor(0xFF0000)
          message.channel.send(embed)
          break;
        }

      if(!message.member.hasPermission("KICK_MEMBERS")) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " ⛔ นายท่านไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Kick Members>`")
           .setColor(0xFF0000)
        message.channel.send(embed)
        break;
          }
      if(!message.guild.me.hasPermission("KICK_MEMBERS")) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้ โฮ่ง ~~! `<Kick Members>`")
           .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(!target) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + "⛔ นายท่านจำเป็นต้อง `@คนที่จะเตะ` ด้วยนะ โฮ่ง ~~!")
           .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(target.user.id === message.author.id) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านไม่สามารถเตะตัวเองได้นะ โฮ่ง ~~!")
         .setColor(0xFF0000)
      message.channel.send(embed)
      break;
    }
      if(!target.kickable) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ ข้าน้อยไม่สามารถเตะได้ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
        }     
      if(!args[1]) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + "⛔ นายท่านจำเป็นต้องใส่เหตุผลในการเตะด้วย โฮ่ง ~~!")
           .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
        
        const embed3 = new MessageEmbed()
        .setTitle("👨‍⚖️ ทำการพิพากษา") 
        .setDescription(message.member.toString() + " ได้ทำการเตะ " + `${target}` + " ในข้อหา " + `${args[1]}`)
        .setColor(0x00FFFF)
        .setTimestamp()
        message.channel.send(embed3)
        
        target.kick(args[1]);

        break;

      case 'ban': // แบนคน ------------------------------------------------------------------------

      let target2 = message.mentions.members.first();

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
            message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
            break;
        }

        if(message.guild.members.cache.get(args[0])) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + "⛔ นายท่านไม่สามารถ`แบนคนที่ไม่อยู่ในเซิพเวอร์ได้`นะ โฮ่ง~~")
           .setColor(0xFF0000)
          message.channel.send(embed)
          break;
        }

      if(!message.member.hasPermission("BAN_MEMBERS")) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + "⛔ นายท่านไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Ban Members>`")
           .setColor(0xFF0000)
        message.channel.send(embed)
        break;
          }
      if(!message.guild.me.hasPermission("BAN_MEMBERS")) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + "⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้ โฮ่ง ~~! `<Ban Members>`")
           .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(!target2) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + "⛔ นายท่านจำเป็นต้อง `@คนที่จะแบน` ด้วยนะ โฮ่ง ~~!")
           .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(target2.user.id === message.author.id) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + "⛔ นายท่านไม่สามารถ`แบนตัวเอง`ได้นะ โฮ่ง ~~!")
           .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      
      if(!target2.bannable) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ ข้าน้อยไม่สามารถ`แบน`ได้ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(!args[1]) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านจำเป็นต้อง`ใส่เหตุผลในการแบน`ด้วย โฮ่ง ~~!")
         .setColor(0xFF0000)
      message.channel.send(embed)
      break;
    }
        
        const embed4 = new MessageEmbed()
        .setTitle("👨‍⚖️ ทำการพิพากษา") 
        .setDescription(message.member.toString() + " ได้ทำการแบน " + `${target}` + " ในข้อหา " + `${args[1]}`)
        .setColor(0x00FFFF)
        .setTimestamp()
        message.channel.send(embed4)

        target2.kick(args[1]);

        break; 

        case 'clearchat' : //ล้างข้อความ ====================================================================

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }

      if(!message.member.hasPermission("MANAGE_MESSAGES")) {
        const embed = new Discord.MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Manage Messages>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Manage Messages>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!args[0]) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่จำนวนข้อความที่จะลบด้วยนะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(isNaN(args[0])) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่จำนวนเป็น`จำนวนเต็ม`เท่านั้นนะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(args[0] < 2) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่จำนวนมากกว่า `2` นะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(args[0] > 100) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่จำนวนไม่เกิน `100` นะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(message.deletable) message.delete();

      let deleteAmount;
      if(parseInt(args[0]) > 100) {
        deleteAmount = 100;
      } else {
        deleteAmount = parseInt(args[0]);
      }

      message.channel.bulkDelete(deleteAmount, true)
      .catch(err => message.reply(`พบข้อผิดพลาด ${err}!`))

      const embed = new MessageEmbed()
       .setTitle("🧹 ระบบล้างแชท 🧹")
       .setDescription("ข้าน้อยลบข้อความทั้งหมด " + deleteAmount + " ข้อความเรียบร้อยแล้ว โฮ่ง~~!")
       .setColor(0x00FE00)
       .setTimestamp(now)
      message.channel.send(embed)

        break;

        case 'antiswear' : // ระบบกันคำหยาบ ------------------------------------------------

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }

      if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
        const embed = new MessageEmbed()
        .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Manage Messages>`")
        .setColor(0xFF0000)
      message.channel.send(embed)
      break;
      }

      if(!message.member.hasPermission("ADMINISTRATOR")) {
        const embed = new MessageEmbed()
        .setDescription(message.member.toString() + " ⛔ คำสั่งนี้ข้าน้อยอนุญาติแค่แอดมินนะ โฮ่ง~~!")
        .addField("สถานะ :", "ไม่สำเร็จ!", false)
        .setColor(0xFF0000)
      message.channel.send(embed)
      break;
      }

      if(antiswearswitchcooldown.has(message.author.id)) {
        const embed = new Discord.MessageEmbed()
        .setTitle("นายท่านใช้คำสั่งไปเมื่อเร็วๆนี้") 
        .setDescription(message.member.toString() + " ⛔ นายท่านได้ใช้คำสั่งนี้ไปเมื่อเร็วๆนี้ โปรดรอเวลาเพื่อใช้อีกรอบนะ โฮ่ง~~!")
         .addField("ติดคูลดาวน์", "1 ชั่วโมง", false)
         .setColor(0xFF0000)
         .setTimestamp(now)
         message.channel.send(embed)
         break;
      }

        if(args[0] === "on") {

            if(antiswearswitch === "on") {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: เปิดใช้งานระบบนี้อยู่แล้วนะ โฮ่ง~~!")
           .setColor(0x00FFFF)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }

        if(message.member.hasPermission("ADMINISTRATOR")) {
        db.set(`antiswear.${message.guild.id}`, "on")
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ✅ เปิดใช้งานระบบกันคำไม่สุภาพแล้ว โฮ่ง~~!")
         .setTitle("ระบบกันคำไม่สุภาพ")
         .addField("สถานะ :", "สำเร็จ!", false)
         .setColor(0x00FE00)
         .setTimestamp(now)
        message.channel.send(embed)
        antiswearswitchcooldown.set(message.author.id);
        setTimeout(() => {
          antiswearswitchcooldown.delete(message.author.id)
          console.log("[ANTISWEAR SWITCH COOLDOWN] เพิ่ม " + message.author.username)
        }, 36000000)
        break;
        }
        }

        if(args[0] === "off") {
        
        if(antiswearswitch === "off") {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: ปิดใช้งานระบบนี้อยู่แล้วนะ โฮ่ง~~!")
           .setColor(0x00FFFF)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }
        if(message.member.hasPermission("ADMINISTRATOR")) {
        db.set(`antiswear.${message.guild.id}`, "off")
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ❌ ปิดใช้งานระบบกันคำไม่สุภาพแล้ว โฮ่ง~~!")
         .setTitle("ระบบกันคำไม่สุภาพ")
         .addField("สถานะ :", "สำเร็จ!", false)
         .setColor(0xFF0000)
         .setTimestamp(now)
        message.channel.send(embed)
        antiswearswitchcooldown.set(message.author.id);
        setTimeout(() => {
          antiswearswitchcooldown.delete(message.author.id)
          console.log("[ANTISWEAR SWITCH COOLDOWN] เพิ่ม " + message.author.username)
        }, 36000000)
        break;
        }
      }

      if(args[0] !== "on" || args[0] !== "off") {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ❌ นายท่านต้องใส่ `on/off` เท่านั้นนะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      break;

      case 'antiinvite' : // ระบบกันคำหยาบ ------------------------------------------------

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }

      if(!message.guild.me.hasPermission("MANAGE_MESSAGES")) {
        const embed = new MessageEmbed()
        .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Manage Messages>`")
        .setColor(0xFF0000)
      message.channel.send(embed)
      break;
      }

      if(!message.member.hasPermission("ADMINISTRATOR")) {
        const embed = new MessageEmbed()
        .setDescription(message.member.toString() + " ⛔ คำสั่งนี้ข้าน้อยอนุญาติแค่แอดมินนะ โฮ่ง~~!")
        .addField("สถานะ :", "ไม่สำเร็จ!", false)
        .setColor(0xFF0000)
      message.channel.send(embed)
      break;
      }

      if(antiinviteswitchcooldown.has(message.author.id)) {
        const embed = new Discord.MessageEmbed()
        .setTitle("นายท่านใช้คำสั่งไปเมื่อเร็วๆนี้") 
        .setDescription(message.member.toString() + " ⛔ นายท่านได้ใช้คำสั่งนี้ไปเมื่อเร็วๆนี้ โปรดรอเวลาเพื่อใช้อีกรอบนะ โฮ่ง~~!")
         .addField("ติดคูลดาวน์", "1 ชั่วโมง", false)
         .setColor(0xFF0000)
         .setTimestamp(now)
         message.channel.send(embed)
         break;
      }

        if(args[0] === "on") {

            if(antiinvitelinkswitch === "on") {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: เปิดใช้งานระบบนี้อยู่แล้วนะ โฮ่ง~~!")
           .setColor(0x00FFFF)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }

        if(message.member.hasPermission("ADMINISTRATOR")) {
        db.set(`antiinvitelink.${message.guild.id}`, "on")
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ✅ เปิดใช้งานระบบกันลิงก์เชิญแล้ว โฮ่ง~~!")
         .setTitle("ระบบกันลิงก์เชิญ")
         .addField("สถานะ :", "สำเร็จ!", false)
         .setColor(0x00FE00)
         .setTimestamp(now)
        message.channel.send(embed)
        antiinviteswitchcooldown.set(message.author.id);
        setTimeout(() => {
          antiinviteswitchcooldown.delete(message.author.id)
          console.log("[ANTIINVITE SWITCH COOLDOWN] เพิ่ม " + message.author.username)
        }, 36000000)
        break;
        }
        }

        if(args[0] === "off") {
        
        if(antiswearswitch === "off") {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: ปิดใช้งานระบบนี้อยู่แล้วนะ โฮ่ง~~!")
           .setColor(0x00FFFF)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }
        if(message.member.hasPermission("ADMINISTRATOR")) {
        db.set(`antiinvitelink.${message.guild.id}`, "off")
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ❌ ปิดใช้งานระบบกันลิงก์เชิญแล้ว โฮ่ง~~!")
         .setTitle("ระบบกันลิงก์เชิญ")
         .addField("สถานะ :", "สำเร็จ!", false)
         .setColor(0xFF0000)
         .setTimestamp(now)
        message.channel.send(embed)
        antiinviteswitchcooldown.set(message.author.id);
        setTimeout(() => {
          antiinviteswitchcooldown.delete(message.author.id)
          console.log("[ANTIINVITE SWITCH COOLDOWN] เพิ่ม " + message.author.username)
        }, 36000000)
        break;
        }
      }

      if(args[0] !== "on" || args[0] !== "off") {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ❌ นายท่านต้องใส่ `on/off` เท่านั้นนะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      break;

        case 'antispam' : //ระบบกันฟลัด ========================================

          if(!message.guild.me.hasPermission("EMBED_LINKS")) {
            message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
            break;
        }

        if(!message.member.hasPermission("ADMINISTRATOR")) {
          const embed = new MessageEmbed()
          .setDescription(message.member.toString() + " ⛔ คำสั่งนี้ข้าน้อยอนุญาติแค่แอดมินนะ โฮ่ง~~!")
          .addField("สถานะ :", "ไม่สำเร็จ!", false)
          .setColor(0xFF0000)
        message.channel.send(embed)
        break;
        }

        if(antispamswitchcooldown.has(message.author.id)) {
          const embed = new Discord.MessageEmbed()
          .setTitle("นายท่านใช้คำสั่งไปเมื่อเร็วๆนี้") 
          .setDescription(message.member.toString() + " ⛔ นายท่านได้ใช้คำสั่งนี้ไปเมื่อเร็วๆนี้ โปรดรอเวลาเพื่อใช้อีกรอบนะ โฮ่ง~~!")
           .addField("ติดคูลดาวน์", "1 ชั่วโมง", false)
           .setColor(0xFF0000)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }

        if(args[0] === "on") {

          if(!db.get(`antispamtime.${message.guild.id}`)) {
            const embed = new MessageEmbed()
             .setDescription(message.member.toString() + " :information_source: นายท่านต้องทำการเซ็ตเวลาก่อนเปิดนะ โฮ่ง~~! `<s!antispam settime [เวลา]>`")
             .setColor(0x00FFFF)
            message.channel.send(embed)
            break;
          }
            if(antispamswitch === "on") {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: เปิดใช้งานระบบนี้อยู่แล้วนะ โฮ่ง~~!")
           .setColor(0x00FFFF)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }

        if(message.member.hasPermission("ADMINISTRATOR")) {
        db.set(`antispam.${message.guild.id}`, "on")
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ✅ เปิดใช้งานระบบกันฟลัดแล้ว โฮ่ง~~!")
         .setTitle("ระบบกันฟลัด")
         .addField("สถานะ :", "สำเร็จ!", false)
         .setColor(0x00FE00)
         .setTimestamp(now)
        message.channel.send(embed)
        antispamswitchcooldown.set(message.author.id);
        setTimeout(() => {
          antispamswitchcooldown.delete(message.author.id)
          console.log("[ANTISPAM SWITCH COOLDOWN] เพิ่ม " + message.author.username)
        }, 36000000)
        break;
        }
        }

        if(args[0] === "off") {
        
        if(antispamswitch === "off") {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: ปิดใช้งานระบบนี้อยู่แล้วนะ โฮ่ง~~!")
           .setColor(0x00FFFF)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }
        if(message.member.hasPermission("ADMINISTRATOR")) {
        db.set(`antispam.${message.guild.id}`, "off")
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ❌ ปิดใช้งานระบบกันฟลัดแล้ว โฮ่ง~~!")
         .setTitle("ระบบกันฟลัด")
         .addField("สถานะ :", "สำเร็จ!", false)
         .setColor(0xFF0000)
         .setTimestamp(now)
        message.channel.send(embed)
        antispamswitchcooldown.set(message.author.id);
        setTimeout(() => {
          antispamswitchcooldown.delete(message.author.id)
          console.log("[ANTISPAM SWITCH COOLDOWN] เพิ่ม " + message.author.username)
        }, 36000000)
        break;
        }
      }

      if(args[0] === "settime") {
        
        if(!args[1]) {
          const embed = new MessageEmbed()
          .setDescription(message.member.toString() + "⛔ นายท่านต้องใส่เวลาด้วยนะ โฮ่ง ~~! `<หน่วย : วินาที>`")
          .setColor(0xFF0000)
         message.channel.send(embed)
         break;
        }

        if(isNaN(args[1])) {
          const embed = new Discord.MessageEmbed()
          .setDescription(message.member.toString() + "⛔ นายท่านต้องใส่เวลาเป็น`ตัวเลข`เท่านั้นนะ โฮ่ง~~!")
          .setColor(0xFF0000)
         message.channel.send(embed)
         break;
        }

        if(args[1] > 9999) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + "⛔ นายท่านใส่เวลามากกว่า `9999` วินาทีนะ โฮ่ง~~! ")
           .setColor(0xFF0000)
          message.channel.send(embed)
          break;
        }
        if(args[1] < 30) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + "⛔ นายท่านใส่เวลาน้อยกว่า `30` วินาทีนะ โฮ่ง~~!")
           .setColor(0xFF0000)
          message.channel.send(embed)
          break;
        }

        db.set(`antispamtime.${message.guild.id}`, args[1])
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ✅ ตั้งค่าเวลาในการใบ้เป็นเวลา " + args[1] + " วินาที")
         .setColor(0x00FFFF)
         .setTimestamp(now)
         message.channel.send(embed)
         break;

      }

      if(args[0] !== "on" || args[0] !== "off" || args[0] !== "settime") {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ❌ นายท่านต้องใส่ `on/off/settime` เท่านั้นนะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

        break;

        case 'privateme' : //สร้างห้องส่วนตัว===========================================================

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }

      if(!message.guild.me.hasPermission("MANAGE_CHANNELS")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Manage Channels>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      
      if(args[0] === "reset") {

        if(!message.member.hasPermission("ADMINISTRATOR")) {
          const embed = new MessageEmbed()
          .setDescription(message.member.toString() + " ⛔ คำสั่งนี้ข้าน้อยอนุญาติแค่แอดมินนะ โฮ่ง~~!")
          .addField("สถานะ :", "ไม่สำเร็จ!", false)
          .setColor(0xFF0000)
        message.channel.send(embed)
        break;
        }


        if(usedResetCooldown.has(message.author.id)) {
          const embed = new Discord.MessageEmbed()
          .setTitle("นายท่านใช้คำสั่งไปเมื่อเร็วๆนี้") 
          .setDescription(message.member.toString() + " ⛔ นายท่านได้ใช้คำสั่งนี้ไปเมื่อเร็วๆนี้ โปรดรอเวลาเพื่อใช้อีกรอบนะ โฮ่ง~~!")
           .addField("ติดคูลดาวน์", "24 ชั่วโมง", false)
           .setColor(0xFF0000)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
           
        }

        if(serverPrivateChannel === "off") {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: ระบบนี้ถูกปิดใช้งาน นายท่านต้องพิม `s!privateme on` ก่อนใช้คำสั่งอีกรอบนะ โฮ่ง~~!")
           .setColor(0xFF0000)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }
          if (!db.get(`spcate.${message.guild.id}`)) {
            const embed = new MessageEmbed()
             .setTitle("ไม่พบไฟล์ในระบบ!")
             .setDescription("นายท่านต้องทำการเปิดใช้งานระบบ `privateme` และพิม `s!privateme` ก่อนอย่างน้อยหนึ่งรอบนะ โฮ่ง~~!")
             .setColor(0xFF0000)
            message.channel.send(embed)
            break;
        }
        db.delete(`spcate.${message.guild.id}`)
        message.channel.send("✅ รีเซ็ตเสร็จสิ้น!").catch(err => message.reply(`รีเซ็ตล้มเหลว ${err} ติดต่อ u4lly33x`))
        usedResetCooldown.set(message.author.id)
        setTimeout(() => usedResetCooldown.delete(message.author.id), 864000000)
        console.log("[RESET COOLDOWN] เพิ่ม " + message.author.username)
        break;

      }

      if(args[0] === "on") {

        if(serverPrivateChannel === "on") {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: เปิดใช้งานระบบนี้อยู่แล้วนะ โฮ่ง~~!")
           .setColor(0x00FFFF)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }

        if(message.member.hasPermission("ADMINISTRATOR")) {
        db.set(`spc.${message.guild.id}`, "on")
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ✅ เปิดใช้งานระบบห้องส่วนตัวแล้ว โฮ่ง~~!")
         .setTitle("ระบบห้องส่วนตัว")
         .addField("สถานะ :", "สำเร็จ!", false)
         .setColor(0x00FE00)
         .setTimestamp(now)
        message.channel.send(embed)
        break;
        }

        if(!message.member.hasPermission("ADMINISTRATOR")) {
          const embed = new MessageEmbed()
          .setDescription(message.member.toString() + " ⛔ คำสั่งนี้ข้าน้อยอนุญาติแค่แอดมินนะ โฮ่ง~~!")
          .addField("สถานะ :", "ไม่สำเร็จ!", false)
          .setColor(0xFF0000)
        message.channel.send(embed)
        break;
        }
      }
      

      if(args[0] === "off") {
        if(serverPrivateChannel === "off") {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: ปิดใช้งานระบบนี้อยู่แล้วนะ โฮ่ง~~!")
           .setColor(0x00FFFF)
           .setTimestamp(now)
           message.channel.send(embed)
           break;
        }
        if(message.member.hasPermission("ADMINISTRATOR")) {
        db.set(`spc.${message.guild.id}`, "off")
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ❌ ปิดใช้งานระบบห้องส่วนตัวแล้ว โฮ่ง~~!")
         .setTitle("ระบบห้องส่วนตัว")
         .addField("สถานะ :", "สำเร็จ!", false)
         .setColor(0xFF0000)
         .setTimestamp(now)
        message.channel.send(embed)
        break;
        }

        if(!message.member.hasPermission("ADMINISTRATOR")) {
          const embed = new MessageEmbed()
          .setDescription(message.member.toString() + " ⛔ คำสั่งนี้ข้าน้อยอนุญาติแค่แอดมินนะ โฮ่ง~~!")
          .setColor(0xFF0000)
          .addField("สถานะ :", "ไม่สำเร็จ!", false)
        message.channel.send(embed)
        break;
        }
    }

    if(!message.member.hasPermission("MANAGE_CHANNELS")) {
      const embed = new Discord.MessageEmbed()
       .setDescription(message.member.toString() + " ⛔ นายท่านไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Manage Channels>`")
       .setColor(0xFF0000)
      message.channel.send(embed)
      break;
    }


    if(args[0] === "delete") {

      if(message.guild.channels.cache.find(ch => ch.name === `${message.author.username} 🔒 Private Room`)) {
      message.guild.channels.cache.find(ch => ch.name === `${message.author.username} 🔒 Private Room`).delete();
      const embed = new MessageEmbed()
       .setDescription(message.member.toString() + " ✅ ลบห้องส่วนตัวของนายท่านเรียบร้อยแล้ว โฮ่ง~~!")
       .setColor(0x00FE00)
       .setTimestamp(now)
      message.channel.send(embed)
      break;
      }
      if(!message.guild.channels.cache.find(ch => ch.name === `${message.author.username} 🔒 Private Room`)) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ❌ นายท่านไม่มีห้องส่วนตัวนะ โฮ่ง~~!")
         .setColor(0xFF0000)
         .setTimestamp(now)
        message.channel.send(embed)
        break;
      }
    }

    if(db.get(`spc.${message.guild.id}`) === "off") {
      const embed = new MessageEmbed()
       .setDescription(message.member.toString() + " ❌ เซิพเวอร์นี้ได้ปิดระบบนี้ไว้นะ โฮ่ง~~!")
       .setColor(0xFF0000)
      message.channel.send(embed)
      break;
    }

      
    if(!db.get(`spcate.${message.guild.id}`))  
    message.guild.channels.create("🔒 PRIVATE 🔒", {
          type: 'category',
        permissionOverwrites: [{

          id: message.guild.id,
          deny: ['MUTE_MEMBERS']
        }]
      
      } ).catch(err => message.reply(`พบปัญหา ${err} ติดต่อแอดมินที่เซิพเวอร์ชิบะย่างเกลือ`)).then(async channel => {

         await db.set(`spcate.${message.guild.id}`, channel.id)

        }) 

      if(!message.guild.channels.cache.find(channel => channel.name === `${message.author.username} 🔒 Private Room`)) {
      message.guild.channels.create(`${message.author.username} 🔒 Private Room`, 
      { type: 'voice',
    permissionOverwrites: [{
      id: message.author.id,
      allow: ["VIEW_CHANNEL", "CONNECT", "SPEAK"]
    },], reason: 'ระบบชิบะทำงาน!' 
  }).then(async channel => {
    await channel.setParent(db.get(`spcate.${message.guild.id}`)).catch(error => message.reply(`เกิดปัญหา ${error} กรุณาติดต่อ u4lly33x \n **การแก้ปัญหาเบื้องต้นของ CATEGORY DOES NOT EXIST คือการให้แอดมินพิม s!privateme reset ก่อน 1 ครั้งแล้วจะสามารถใช้ได้ปกติ`))
    await channel.updateOverwrite(channel.guild.roles.everyone, {CONNECT: false });
    const embed = new MessageEmbed()
     .setDescription(message.member.toString() + " ✅ สร้างห้องส่วนตัวสำหรับนายท่านเรียบร้อยแล้ว โฮ่ง~~!")
     .setColor(0x00FE00)
     .addField("สถานะ :", "สำเร็จ!", false)
    message.channel.send(embed)
  })
  break;
  }
      if(message.guild.channels.cache.find(ch => ch.name === `${message.author.username} 🔒 Private Room`)) {
      const embed = new MessageEmbed()
      .setDescription(message.member.toString() + " :information_source: นายท่านมีห้องส่วนตัวอยู่แล้วนะ โฮ่ง~~!")
      .setColor(0x00FFFF)
        message.channel.send(embed)
        break;
      }   
        
        case 'jail' : // ขังคุก -----------------------------------------------

        let role2 = message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Jail System");
        let user2 = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }

      if(!message.member.hasPermission("MUTE_MEMBERS" && "KICK_MEMBERS" && "BAN_MEMBERS")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Mute Members, Kick Members, Ban Members>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!message.guild.me.hasPermission("MANAGE_ROLES" && "MANAGE_CHANNELS")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้ โฮ่ง ~~! `<Manage Roles, Manage Channels>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      
      if(!user2) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านจำเป็นต้อง `@คนที่จะจำคุก` ด้วยนะ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(user2.user.id === message.guild.me.user.id) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ ข้าน้อยไม่สามารถจำคุกตัวเองได้ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      } 
      
      if(user2.user.id === message.author.id) {
         const embed = new MessageEmbed()
          .setDescription(message.member.toString() + "⛔ นายท่านไม่สามารถจำคุกได้นะ โฮ่ง ~~!")
          .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(user2.hasPermission("ADMINISTRATOR")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "🐕 ข้าน้อยเกรงว่าถ้าข้าน้อยจำคุกท่าน " + user2.toString() + "ข้าน้อยจะโดนจำคุกเองนะ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(!user2.kickable) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ ข้าน้อยไม่สามารถจำคุกได้ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!args[1]) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านต้องใส่เวลาด้วยนะ โฮ่ง ~~! `<หน่วย : วินาที>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if (isNaN(args[1])) {
        const embed = new Discord.MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านต้องใส่เวลาเป็นตัวเลขเท่านั้นนะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(args[1] > 9999) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านใส่เวลามากกว่า `9999` วินาทีนะ โฮ่ง~~! ")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(args[1] < 1) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านใส่เวลาน้อยกว่า `1` วินาทีนะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(user2.roles.cache.find(r => r.name === "✿ Shiba ✿ Jail System")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านได้ทำการจำคุกคนนี้แล้วนะ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      
      if (!role2) {
          message.guild.roles.create({
            data: {
              name: "✿ Shiba ✿ Jail System",
              color: 0x000001,
              permissions: ["READ_MESSAGE_HISTORY" && "VIEW_CHANNEL"]
            }
            }).then(async newrole => {
              const promises = [];
              for(const channel of message.guild.channels.cache.values())
              promises.push(channel.updateOverwrite(newrole, {SEND_MESSAGES: false, VIEW_CHANNEL: false}))
              Promise.all(promises);
            }).catch(err => {message.reply(`พบปัญหา ${err}!`), console.log("[!] PROMISE ERROR REPORT [!]")})
          }

        let ms3 = Math.floor(args[1] * 1000);
        let msminute3 = Math.floor((ms3/1000/60) % 60)
        let mssecond3 = Math.floor((ms3/1000) % 60)
        let mshour3 = Math.floor((ms3/1000/60/60) % 24)
        let msday3 = Math.floor((ms3/1000/60/60/24))
        let msminutedis3 = Math.floor((ms3/1000/60) % 60)
        let msseconddis3 = Math.floor((ms3/1000) % 60)
        let mshourdis3 = Math.floor((ms3/1000/60/60 % 24))
        let msdaydis3 = Math.floor((ms3/1000/60/60/24))
        if (mshour3 === 0) mshour3 = 1;
        if (msminute3 === 0) msminute3 = 1;
        if (mssecond3 === 0) mssecond3 = 1;
        if (msday3 === 0) msday3 = 1;
        let alltime3 = Math.floor((msday3 * msminute3 * mssecond3 * mshour3 * 1000))
      let timer3 = setTimeout(function() {
        user2.roles.remove(message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Jail System")).catch(err => console.log("[!]Jail System Error Report[!]"))
        const embedjailfinish = new MessageEmbed()
        .setTitle("🐕 พ้นโทษ 👮")
        .setDescription(user2.toString() + " พ้นโทษจากการถูกจำคุกแล้ว!")
        .setFooter(now)
       message.channel.send(embedjailfinish)
      }, ms3)
      message.guild.channels.create(`⛓️ คุกของ ${user2.user.username} ⛓️`, {
        type: 'text',
        permissionOverwrites: [{
          id: user2.id,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
        },
        {
          id: message.member.user.id,
          allow: ['SEND_MESSAGES', 'VIEW_CHANNEL', 'READ_MESSAGE_HISTORY']
        }
      ], reason: "สั่งจำคุกนักโทษแล้ว!"
      }).then(async newchannel => {
        newchannel.updateOverwrite(message.guild.roles.everyone, {VIEW_CHANNEL: false, SEND_MESSAGES: false})
        const embedjail = new MessageEmbed()
        .setTitle("👨‍⚖️ ทำการพิพากษา")
        .setDescription("✅ " + message.member.toString() + " ทำการจำคุก " + user2.toString() + " เรียบร้อยแล้ว")
        .addField("เป็นเวลา", `${msdaydis3} วัน ${mshourdis3} ชม. ${msminutedis3} นาที ${msseconddis3} วินาที`, false)
        .setFooter(now)
       newchannel.send(embedjail)
      })
      const embedjail = new MessageEmbed()
       .setTitle("👨‍⚖️ ทำการพิพากษา")
       .setDescription("✅ " + message.member.toString() + " ทำการจำคุก " + user2.toString() + " เรียบร้อยแล้ว")
       .addField("เป็นเวลา", `${msdaydis3} วัน ${mshourdis3} ชม. ${msminutedis3} นาที ${msseconddis3} วินาที`, false)
       .setFooter(now)
      message.channel.send(embedjail).then(async message => {
        await message.react("👨‍⚖️")
       await user2.roles.add(message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Jail System"))
       if (user2.roles.cache.find(r => r.name === "✿ Shiba ✿ Jail System"))
       await timer3
       else return;
      })

        break;

        case 'unjail' : // ยกเลิกจำคุก --------------------------------------

        let target10 = message.mentions.members.first();

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน <Embed Link>")
          break;
      }

      if(!message.member.hasPermission("MUTE_MEMBERS" && "KICK_MEMBERS" && "BAN_MEMBERS")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Mute members,Kick Members,Ban Members>")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้ โฮ่ง ~~! `<Manage Roles>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      
      if(!target10) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านจำเป็นต้อง `@คนที่จะประกันตัว` ด้วยนะ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!target10.roles.cache.find(r => r.name === "✿ Shiba ✿ Jail System")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านไม่ได้จำคุกคนนี้นะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      target10.roles.remove(message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Jail System")).catch(err => console.log("[!]Jail System Error Report[!]"))
        const embedjailfinish = new MessageEmbed()
        .setTitle("🐕 ประกันตัว 👮")
        .setDescription(target10.toString() + " ออกจากคุก!")
        .addField("ประกันตัวโดย", message.member.toString(), false)
        .setFooter(now)
       message.channel.send(embedjailfinish)
       break;

        case 'rm' : // สุ่มคน --------------------------------------------------------------------------

        var randommember = message.guild.members.cache.random();

        const embedrm = new MessageEmbed()
         .setTitle("🎉 ผู้โชคดี! 🎉")
         .setDescription(randommember.toString() + " คุณคือผู้โชคดี!")
         .setColor(0x00FFFF)
         .setTimestamp(now)
         .setThumbnail(randommember.user.avatarURL({dynamic: true, size: 2048}))
        message.channel.send(embedrm)

        break;

        case 'rn' : // สุ่มหวย ----------------------------------------------------------------

        var randomnumber6 = Math.floor(Math.random() * 999999);
        var lastrandomnumber3 = Math.floor(Math.random() * 999);
        var lastrandomnumber3z = Math.floor(Math.random() * 999);
        var firstrandomnumber3 = Math.floor(Math.random() * 999);
        var firstrandomnumber3z = Math.floor(Math.random() * 999);
        var lastrandomnumber2 = Math.floor(Math.random() * 99);

        const embedrn = new MessageEmbed()
         .setTitle("🎉 เลขที่ออกคือ... 🎉")
         .addField("รางวัลที่ 1 :", randomnumber6, false)
         .addField("เลขหน้า 3 ตัว :", firstrandomnumber3 + " " + firstrandomnumber3z, true)
         .addField("เลขท้าย 3 ตัว :", lastrandomnumber3 + " " + lastrandomnumber3z, true)
         .addField("เลขท้าย 2 ตัว :", lastrandomnumber2, false)
         .setColor(0x00FFFF)
         message.channel.send(embedrn)
        
        break;

        case 'unmute' : //ยกเลิกใบ้ --------------------------------------
        let target5 = message.mentions.members.first();

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน <Embed Link>")
          break;
      }

      if(!message.member.hasPermission("MUTE_MEMBERS" && "KICK_MEMBERS" && "BAN_MEMBERS")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Mute Members,Kick Members,Ban Members>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้ โฮ่ง ~~! `<Manage Roles>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      
      if(!target5) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านจำเป็นต้อง `@คนที่จะยกเลิกใบ้` ด้วยนะ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!target5.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านไม่ได้ใบ้คนนี้นะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      target5.roles.remove(message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System")).catch(err => console.log("[!]Mute System Error Report[!]"))
      const embedmutefinish = new MessageEmbed()
      .setTitle("🐕 การรักษาสำเร็จ! 🏥")
      .setDescription(target5.toString() + " รักษาหายจากการใบ้แล้ว!")
      .addField("รักษาโดย :", message.member.toString())
      .setFooter(now)
     message.channel.send(embedmutefinish)
       break;
        

        case 'mute' : //ใบ้ --------------------------------------------------------

        let role = message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System");
        let user = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]);

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }

      if(!message.member.hasPermission("MUTE_MEMBERS" && "KICK_MEMBERS" && "BAN_MEMBERS")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Mute Members,Kick Members,Ban Members>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!message.guild.me.hasPermission("MANAGE_ROLES")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้ โฮ่ง ~~! `<Manage Roles>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      
      if(!user) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านจำเป็นต้อง `@คนที่จะใบ้` ด้วยนะ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(user.user.id === message.guild.me.user.id) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ ข้าน้อยไม่สามารถใบ้ตัวเองได้ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      } 
      
      if(user.user.id === message.author.id) {
         const embed = new MessageEmbed()
          .setDescription(message.member.toString() + "⛔ นายท่านไม่สามารถใบ้ตัวเองได้นะ โฮ่ง ~~!")
          .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(user.hasPermission("ADMINISTRATOR")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "🐕 ข้าน้อยเกรงว่าถ้าข้าน้อยใบ้ท่าน " + user.toString() + "ข้าน้อยจะโดนใบ้เองนะ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(!user.kickable) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ ข้าน้อยไม่สามารถใบ้ได้ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(!args[1]) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านต้องใส่เวลาด้วยนะ โฮ่ง ~~! `<หน่วย : วินาที>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if (isNaN(args[1])) {
        const embed = new Discord.MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านต้องใส่เวลาเป็นตัวเลขเท่านั้นนะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(args[1] > 9999) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านใส่เวลามากกว่า `9999` วินาทีนะ โฮ่ง~~! ")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      if(args[1] < 1) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านใส่เวลาน้อยกว่า `1` วินาทีนะ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(user.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านได้ทำการใบ้คนนี้แล้วนะ โฮ่ง ~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
      
      if (!role) {
          message.guild.roles.create({
            data: {
              name: "✿ Shiba ✿ Mute System",
              color: 0xF25E23,
              permissions: ["READ_MESSAGE_HISTORY", "CONNECT", "VIEW_CHANNEL"]
            }
            }).then(async newrole => {
              const promises = [];
              for (const channel of message.guild.channels.cache.values())
              promises.push(channel.updateOverwrite(newrole, {SEND_MESSAGES: false, ADD_REACTIONS: false, SPEAK: false}))
              Promise.all(promises);
            }).catch(err => {message.reply(`พบปัญหา ${err}`), console.log("[!] PROMISE ERROR [!]")})
        }
      let ms = Math.floor(args[1] * 1000);
      let msminute = Math.floor((ms/1000/60) % 60)
      let mssecond = Math.floor((ms/1000) % 60)
      let mshour = Math.floor((ms/1000/60/60) % 24)
      let msday = Math.floor((ms/1000/60/60/24))
      let msminutedis = Math.floor((ms/1000/60) % 60)
      let msseconddis = Math.floor((ms/1000) % 60)
      let mshourdis = Math.floor((ms/1000/60/60) % 24)
      let msdaydis = Math.floor((ms/1000/60/60/24))
      if (mshour === 0) mshour = 1;
      if (msminute === 0) msminute = 1;
      if (mssecond === 0) mssecond = 1;
      if (msday === 0) msday = 1;
      let alltime = Math.floor((msday * msminute * mssecond * mshour * 1000))
      let timer = setTimeout(function() {
        user.roles.remove(message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System")).catch(err => console.log("[!]Mute System Error Report[!]"))
        const embedmutefinish = new MessageEmbed()
        .setTitle("🐕 การรักษาสำเร็จ! 🏥")
        .setDescription(user.toString() + " รักษาหายจากการใบ้แล้ว!")
        .setFooter(now)
       message.channel.send(embedmutefinish)
      }, ms)
      const embedmute = new MessageEmbed()
       .setTitle("👨‍⚖️ ทำการพิพากษา")
       .setDescription("✅ " + message.member.toString() + " ฉีดยาเพื่อทำการใบ้ " + user.toString() + " เรียบร้อยแล้ว")
       .addField("เป็นเวลา", `${msdaydis} วัน ${mshourdis} ชม. ${msminutedis} นาที ${msseconddis} วินาที`, false)
       .setFooter(now)
      message.channel.send(embedmute).then(async message => {
        await message.react("👨‍⚖️")
       await user.roles.add(message.guild.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System"))
       if (user.roles.cache.find(r => r.name === "✿ Shiba ✿ Mute System"))
       await timer
      })

        break;

        case 'channelinfo' : // ดูข้อมูลแชแนล ---------------------------------------------------

        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }

      if(!message.member.hasPermission("MANAGE_CHANNELS")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านไม่มีสิทธิ์ใช้คำสั่งนี้นะ โฮ่ง~~! `<Manage Channels>`")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }

      if(message.channel.topic) {
      const embedchid = new MessageEmbed()
       .setDescription("ชื่อช่อง : " + message.channel.name + "\n \n")
       .addField("ไอดี : ", message.channel.id, false)
       .addField("สร้างเมื่อ : ", dateFormat(message.channel.createdAt, false))
       .addField("อยู่ในหมวดหมู่ : ", message.channel.parent, false)
       .addField("ไอดีหมวดหมู่ : ", message.channel.parentID, false)
       .addField("หัวข้อ :", message.channel.topic, false)
       .addField("ตำแหน่ง : ", message.channel.position, false)
       .addField("ประเภท : ", "ห้องส่งข้อความ", false)
       message.channel.send(embedchid)
       break;
      }

      if(!message.channel.topic) {
        const embedchid = new MessageEmbed()
         .setDescription("ชื่อช่อง : " + message.channel.name + "\n \n")
         .addField("ไอดี : ", message.channel.id, false)
         .addField("สร้างเมื่อ : ", dateFormat(message.channel.createdAt, false))
         .addField("อยู่ในหมวดหมู่ : ", message.channel.parent, false)
         .addField("ไอดีหมวดหมู่ : ", message.channel.parentID, false)
         .addField("หัวข้อ :", "ไม่มีหัวข้อ", false)
         .addField("ตำแหน่ง : ", message.channel.position, false)
         .addField("ประเภท : ", "ห้องส่งข้อความ", false)
         message.channel.send(embedchid)
         break;
        }

      break;

        case 'votekick' : // โหวดเพื่อเตะ --------------------------------------------------

        let target3 = message.mentions.members.first();


        if(!message.guild.me.hasPermission("EMBED_LINKS")) {
          message.reply("❌ ไม่สามารถใช้คำสั่งได้เนื่องจากบอทไม่มีสิทธิ์เข้าถึงส่วน `<Embed Link>`")
          break;
      }

      if(args[0] === "settime") {
        if(!message.member.hasPermission("ADMINISTRATOR")) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " ⛔ คำสั่งนี้ข้าน้อยอนุญาติแค่แอดมินนะ โฮ่ง~~!")
           .setColor(0xFF0000)
          message.channel.send(embed)
          break;
        }
        if(!args[1]) {
            const embed = new MessageEmbed()
             .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่เวลาด้วยนะ โฮ่ง~~!")
             .setColor(0xFF0000)
             message.channel.send(embed)
             break;
           }
  
        if(isNaN(args[1])) {
             const embed = new MessageEmbed()
              .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่เวลาเป็นตัวเลขเท่านั้นนะ โฮ่ง~~!")
              .setColor(0xFF0000)
            message.channel.send(embed)
            break;
           }

        if(args[1] < 10) {
             const embed = new MessageEmbed()
              .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่เวลามากกว่า `10` วินาทีนะ โฮ่ง~~!")
              .setColor(0xFF0000)
            message.channel.send(embed)
            break;
           }

        if(args[1] > 9999) {
            const embed = new MessageEmbed()
             .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่เวลาน้อยกว่า `9999` วินาทีนะ โฮ่ง~~!")
             .setColor(0xFF0000)
            message.channel.send(embed)
            break;

        }

        db.set(`timekick.${message.guild.id}`, args[1]);
        const embedtimekickset = new MessageEmbed()
         .setDescription(message.member.toString() + " ✅ ตั้งเวลาในการโหวต " + args[1] + " วินาที")
         .setColor(0xFF0000)
        message.channel.send(embedtimekickset)
        break;
        }
      
      if(args[0] === "setMin") {
        if(!message.member.hasPermission("ADMINISTRATOR")) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " ⛔ คำสั่งนี้ข้าน้อยอนุญาติแค่แอดมินนะ โฮ่ง~~!")
           .setColor(0xFF0000)
          message.channel.send(embed)
          break;
        }

        if(!args[1]) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่จำนวนคนด้วยนะ โฮ่ง~~!")
           .setColor(0xFF0000)
           message.channel.send(embed)
           break;
         }

         if(isNaN(args[1])) {
           const embed = new MessageEmbed()
            .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่เวลาเป็นตัวเลขเท่านั้นนะ โฮ่ง~~!")
            .setColor(0xFF0000)
          message.channel.send(embed)
          break;
         }

         if(args[1] < 5) {
           const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่ค่าตั้งแต่ 5 ขึ้นไปนะ โฮ่ง ~~!")
           .setColor(0xFF0000)
          message.channel.send(embed)
          break;
         } 

         if(args[1] > message.guild.memberCount) {
           const embed = new MessageEmbed()
            .setDescription(message.member.toString() + " ⛔ นายท่านต้องใส่ค่าไม่เกิน " + `${message.guild.memberCount}` + " นะ โฮ่ง ~~!")
            .setColor(0xFF0000)
          message.channel.send(embed)
          break;
         }

         db.set(`memberrequired.${message.guild.id}`, args[1]);
         const embedsetmembermin = new MessageEmbed()
          .setDescription(message.member.toString() + " ✅ ตั้งค่าจำนวนคนอย่างต่ำ " + `${args[1]}` + " คนที่จะโหวตสำเร็จเรียบร้อย")
          .setColor(0x00FFFF)
         message.channel.send(embedsetmembermin).catch(err => console.log("[!] Vote Kick Member Required Error Report [!]"))
         break;
      }

      if(usedCommandRecently.has(message.author.id)) {
        const embed = new Discord.MessageEmbed()
        .setTitle("นายท่านใช้คำสั่งไปเมื่อเร็วๆนี้") 
        .setDescription(message.member.toString() + " ⛔ นายท่านได้ใช้คำสั่งนี้ไปเมื่อเร็วๆนี้ โปรดรอเวลาเพื่อใช้อีกรอบนะ โฮ่ง~~!")
         .addField("ติดคูลดาวน์", "1 ชั่วโมง", false)
         .setColor(0xFF0000)
         .setTimestamp(now)
         message.channel.send(embed)
         break;
         
      }

      if(!db.get(`timekick.${message.guild.id}`)) {
          const embed = new MessageEmbed()
           .setDescription(message.member.toString() + " :information_source: นายท่านต้องให้แอดมินเซ็ตเวลาก่อนนะ โฮ่ง~~! `<s!votekick settime [เวลา]>`")
           .setColor(0x00FFFF)
          message.channel.send(embed)
          break;
      }

      if(!db.get(`memberrequired.${message.guild.id}`)) {
        const embed = new MessageEmbed()
        .setDescription(message.member.toString() + " :information_source: นายท่านต้องให้แอดมินเซ็ตจำนวนคนก่อนนะ โฮ่ง~~! `<s!votekick setMin [จำนวนคน]>`")
        .setColor(0x00FFFF)
       message.channel.send(embed)
       break;
      }

      if(message.guild.members.cache.get(args[0])) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ นายท่านไม่สามารถโหวตเตะคนที่ไม่อยู่ในเซิพเวอร์ได้นะ โฮ่ง~~")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
      }
    if(!message.guild.me.hasPermission("KICK_MEMBERS")) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + " ⛔ ข้าน้อยไม่มีสิทธิ์ใช้คำสั่งนี้ โฮ่ง ~~!")
         .setColor(0xFF0000)
      message.channel.send(embed)
      break;
    }
    if(message.guild.memberCount < '40') {

      const embed = new MessageEmbed()
       .setDescription(message.member.toString() + "⛔ เซิพเวอร์นี้ต้องมีจำเป็นต้องมีอย่างน้อย `40` คน!")
       .setColor(0xFF0000)
      message.channel.send(embed)
      break;
    }
    if(!target3) {
        const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ นายท่านจำเป็นต้อง `@คนที่จะโหวต` ด้วยนะ โฮ่ง ~~!")
         .setColor(0xFF0000)
      message.channel.send(embed)
      break;
    }
    if(!target3.kickable) {
      const embed = new MessageEmbed()
         .setDescription(message.member.toString() + "⛔ ข้าน้อยไม่สามารถเตะได้ โฮ่ง~~!")
         .setColor(0xFF0000)
        message.channel.send(embed)
        break;
    }    
    if(target3.user.id === message.author.id) {
      const embed = new MessageEmbed()
       .setDescription(message.member.toString() + "⛔ นายท่านไม่สามารถโหวตตัวเองได้นะ โฮ่ง ~~!")
       .setColor(0xFF0000)
    message.channel.send(embed)
    break;
  }   
    const embed5 = new MessageEmbed()
     .setTitle("Vote Kick")
     .setDescription(`โหวตให้ทำการเตะ ${target3} โดยการกด ✅ ข้างล่างเพื่อโหวตนะ โฮ่ง ~~!`)
     .addField("เวลาทั้งหมด", db.fetch(`timekick.${message.guild.id}`) + " วินาที", false)
     .setFooter(`ขอโดย ${message.author.username}`)
     .setColor(0x00FFFF)
     .setTimestamp(now)
     usedCommandRecently.set(message.author.id)
     console.log("[ / + / ] เพิ่ม " + message.author.username + " เข้าคูลดาวน์!")
     setTimeout(() => {usedCommandRecently.delete(message.author.id)}, 36000000)
   message.channel.send(embed5).then(async message => {
      await message.react("✅")
      message.delete({timeout : Math.floor(db.fetch(`timekick.${message.guild.id}`) * 1000)}).catch(err => message.reply(`พบข้อผิดพลาด ${error}`))
      const reactions = await message.awaitReactions(reaction => reaction.emoji.name === "✅");
      if (reactions.get("✅").count -1 >= db.fetch(`memberrequired.${message.guild.id}`)) {
      const embed = new MessageEmbed()
          .setTitle("👨‍⚖️ ทำการพิพากษา") 
          .setDescription("การโหวตเพื่อเตะ " + target3.toString() +  " สำเร็จ!")
          .addField(" ด้วยคะแนนเสียง ", reactions.get("✅").count -1 + " คะแนน!", false)
          .setFooter(now)
          .setColor(0x00FFFF)
          .setTimestamp()
          message.channel.send(embed)
          console.log("< !สำเร็จ! > เตะ " + `${target3.user.username}` +  " ที่เซิพเวอร์ " + message.guild.name );
          target3.kick("ถูกโหวตออกจากเซิพเวอร์!")
      }
        
      if (reactions.get("✅").count < db.fetch(`memberrequired.${message.guild.id}`) + 1) {
          const embed = new MessageEmbed()
           .setTitle("👨‍⚖️ ทำการพิพากษา")
           .setDescription("การโหวตเพื่อเตะ " + target3.toString() + " ไม่สำเร็จ")
           .addField(" ขาดอีก ", Math.floor(db.fetch(`memberrequired.${message.guild.id}`) - reactions.get("✅").count +1 ) + " คะแนน!", false)
           .setColor(0xFF0000)
           .setTimestamp()
          message.channel.send(embed)
          console.log("< xไม่สำเร็จx > ไม่มีคะแนนเพียงพอที่จะเตะ " + `${target3.user.username}` + " ที่เซิพเวอร์ " + message.guild.name );
      }
    });
   break;
  }
});

client.on("messageReactionAdd", message => {
  
})

client.login(process.env.token);