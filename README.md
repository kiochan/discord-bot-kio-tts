# Kiochan’s Chotto Kawaii TTS Bot ♡

<img src="./avatar.jpg" width="150" alt="Kio-chan Avatar" align="right">

A tiny, super-moe Discord bot that **reads your messages out loud** like a magical familiar.

---

## Setup

1. **Clone** this repo & install dependencies:
   ```bash
   git clone https://github.com/kiochan/discord-bot-kio-tts.git
   cd discord-bot-kio-tts
   npm install
   ```
2. **Add** your `.env` with:
   ```bash
   DISCORD_TOKEN=YOUR_TOKEN
   ```
3. **Build & run**:
   ```bash
   npm run build
   npm run start
   ```
   _(Or `npm run dev` for dev mode.)_

---

## Usage

- Join a voice channel, then type any message.
- Kio-chan detects language & recites: "**{Username} said ...**"
- Special cases:
  - **Images:** "Sent an image"
  - **Links:** "Sent a link"
  - **Long text:** "Filter long text out"

---

## Moe Features

- **Auto-Detect Language**
- **Cooldown**: No spam – wait seconds, senpai!
- **Timeout**: Bot leaves after 10 minutes of silence.
- **Avatar**: Want Kiochan’s cuteness? Use `avatar.jpg` in the main directory for your bot’s icon!

---

## License

Released under the MIT License. Arigato for choosing Kiochan’s TTS Bot, and may all your messages echo with kawaii charm!
