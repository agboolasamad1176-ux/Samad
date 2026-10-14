const express = require('express');
const { Telegraf, Markup } = require('telegraf');

const BOT_TOKEN = process.env.BOT_TOKEN;
const GROUP_ID = "-1002293164661";
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
app.get('/', (req, res) => res.send('Bot Alive - 5h/5m'));
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
    const msg = await bot.telegram.sendMessage(GROUP_ID, 
      `📜 *eFootball Community Rules* 📜\n\n⚠️ Please read rules before chatting!\n\n👇 Click VIEW RULES below 👇\n\n*This message will delete after 5 minutes*`,
      { parse_mode: 'Markdown', ...getButtons() });
    
    console.log('Sent, will delete in 5 min:', msg.message_id);
    
    // DELETE AFTER 5 MINUTES
    setTimeout(async () => {
      try {
        await bot.telegram.deleteMessage(GROUP_ID, msg.message_id);
        console.log('Deleted after 5 min');
      } catch(e){ console.log('Delete failed:', e.message); }
    }, 5 * 60 * 1000); // 5 minutes

  } catch(e){ console.error(e.message); }
}

bot.command('test', async (ctx) => {
  await ctx.reply('✅ Bot Alive! Testing 5h/5m...');
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
  setTimeout(sendReminder, 5000);
  setInterval(sendReminder, 5*60*60*1000); // Every 5 hours
});
