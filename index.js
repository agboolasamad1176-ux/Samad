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
app.get('/', (req, res) => res.send('Bot Alive'));
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
    await bot.telegram.sendMessage(GROUP_ID, 
      `📜 *eFootball Community Rules* 📜\n\n⚠️ Please read rules before chatting!\n\n👇 Click VIEW RULES below 👇`, 
      { parse_mode: 'Markdown', ...getButtons() });
  } catch(e){}
}

bot.command('test', async (ctx) => {
  await ctx.reply('✅ Bot Alive!');
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
  setTimeout(sendReminder, 3000);
  setInterval(sendReminder, 5*60*60*1000);
});
