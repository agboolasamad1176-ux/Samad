const express = require('express');
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_ID = -1002293164661;
const RULES_LINK = "https://telegra.ph/eFootball-Friendly-match-Global-10-14";
const CHANNEL_LINK = "https://t.me/eFootballFriendlyOfficial";
const YOUTUBE_LINK = "https://youtube.com/@gamingngofficial?si=LGEfJ806ypv8GjrN";

const BANNED_SETS = [
  "mabarefootballidn1",
  "MABAR4Mabarefootballidn1",
  "FriendlyMabarefootballidn1",
  "Friendly_mabarefootballidn1",
  "FriendlyMabarefootballidn13",
  "TournamentMabarefootballidn1"
].map(s => s.toLowerCase());

const bot = new Telegraf(BOT_TOKEN);
const app = express();
app.get('/', (req, res) => res.send('Bot Alive - 5h/5m delete'));
app.listen(process.env.PORT || 3000);

function getButtons() {
  return Markup.inlineKeyboard([
    [Markup.button.url('👁️ VIEW RULES 👁️', RULES_LINK)],
    [Markup.button.url('📢 Join Channel', CHANNEL_LINK)],
    [Markup.button.url('▶️ Subscribe YouTube', YOUTUBE_LINK)]
  ]);
}

async function sendReminder() {
  try {
    const sentMsg = await bot.telegram.sendMessage(GROUP_ID, 
      `📜 *eFootball Community Rules* 📜\n\n⚠️ Please read rules before chatting!\n\n👇 Click VIEW RULES below 👇\n\n*This message will delete after 5 minutes*`, 
      { parse_mode: 'Markdown', ...getButtons() });
    
    console.log('Sent:', sentMsg.message_id, '- Will delete in 5 min');

    setTimeout(async () => {
      try {
        await bot.telegram.deleteMessage(GROUP_ID, sentMsg.message_id);
        console.log('Deleted after 5 min:', sentMsg.message_id);
      } catch (e) {
        console.log('Delete failed:', e.message);
      }
    }, 5 * 60 * 1000);

  } catch(e){
    console.log('Send Error:', e.message);
  }
}

bot.command('test', async (ctx) => {
  await ctx.reply('✅ Bot Alive! 5m delete test...');
  await sendReminder();
});

bot.on('sticker', async (ctx) => {
  try {
    const name = ctx.message.sticker.set_name?.toLowerCase();
    if (name && BANNED_SETS.includes(name)) {
      await ctx.deleteMessage();
    }
  } catch(e){}
});

bot.launch().then(() => {
  console.log('Bot Launched - 5h send, 5m delete');
  setTimeout(sendReminder, 3000);
  setInterval(sendReminder, 5*60*60*1000);
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
