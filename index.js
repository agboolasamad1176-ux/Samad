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
app.get('/', (req, res) => res.send('Bot Alive - 5m Delete Working'));
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
    const m = await bot.telegram.sendMessage(GROUP_ID, 
      `📜 *eFootball Community Rules* 📜\n\n⚠️ Please read rules before chatting!\n\n👇 Click VIEW RULES below 👇\n\n*Deleting in 5 minutes*`,
      { parse_mode: 'Markdown', ...getButtons() });
    
    console.log(`Sent ${m.message_id}, deleting in 5 min...`);

    setTimeout(async () => {
      try {
        await bot.telegram.deleteMessage(GROUP_ID, m.message_id);
        console.log(`✅ DELETED ${m.message_id}`);
      } catch(err){
        console.log(`❌ Delete failed: ${err.message}`);
      }
    }, 5 * 60 * 1000);

  } catch(err){ console.log(err.message); }
}

bot.command('test', async (ctx) => {
  await ctx.reply('✅ Test - Will delete in 5 min!');
  await sendReminder();
});

bot.on('sticker', async (ctx) => {
  try {
    const n = ctx.message.sticker.set_name?.toLowerCase();
    if (n && BANNED_SETS.includes(n)) await ctx.deleteMessage();
  } catch{}
});

bot.launch().then(() => {
  console.log('Bot Launched - 5h send, 5m delete');
  setTimeout(sendReminder, 3000);
  setInterval(sendReminder, 5*60*60*1000);
});
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
