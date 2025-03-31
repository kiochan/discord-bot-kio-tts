import { Client, GatewayIntentBits, Message } from "discord.js";
import {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  StreamType,
  VoiceConnection,
} from "@discordjs/voice";
import * as googleTTS from "google-tts-api";

import { Config } from "./config";
import { LogMessages, ReplyMessages, VoiceMessages } from "./const/messages";
import { Logger } from "./feature/logger";
import { TextBuilder } from "./feature/text-builder";

const userCooldown = new Map<string, number>();
const disconnectTimers = new Map<string, NodeJS.Timeout>();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  Logger.log(LogMessages.LoginAs, { userTag: client.user?.tag ?? "UNKNWON" });
});

client.on("messageCreate", async (message: Message) => {
  // not bot
  if (message.author.bot) return;

  // user is in voice channel
  const voiceChannel = message.member?.voice.channel;
  if (!voiceChannel) return;

  const userId = message.author.id;
  const now = Date.now();
  const lastTime = userCooldown.get(userId) || 0;
  if (now - lastTime < 5000) {
    message.reply(TextBuilder.build(ReplyMessages.SendTooQuick));
    return;
  }
  userCooldown.set(userId, now);

  let text = message.content.trim();

  if (message.attachments.size > 0) {
    text = VoiceMessages.SendImage;
  } else {
    const linkRegex = /https?:\/\/\S+/;
    if (linkRegex.test(text)) {
      text = VoiceMessages.SendLink;
    }
  }

  if (text.length > 50) {
    message.reply(ReplyMessages.TextTooLong);
    return;
  }

  const username = message.member.displayName; // or message.author.username
  const finalText = TextBuilder.build(VoiceMessages.UserSay, {
    user: username,
    text,
  });

  const language = detectLanguage(text);

  try {
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    Logger.log(LogMessages.VoiceSend, {
      user: username,
      channel: voiceChannel.name,
      text: message.content,
      voice: finalText,
    });

    await playTTS(connection, finalText, language);

    resetDisconnectTimer(voiceChannel.guild.id, connection);
  } catch (error) {
    Logger.log(LogMessages.PlaybackError, { error: (error as Error).message });
    console.error(error);
    message.reply(TextBuilder.build(ReplyMessages.UnableToPlayVoice));
  }
});

async function playTTS(
  connection: VoiceConnection,
  text: string,
  language: string
): Promise<void> {
  const url = googleTTS.getAudioUrl(text, {
    lang: language,
    slow: false,
    host: "https://translate.google.com",
  });

  const resource = createAudioResource(url, {
    inputType: StreamType.Arbitrary,
  });

  const player = createAudioPlayer();
  connection.subscribe(player);
  player.play(resource);

  return new Promise((resolve) => {
    player.on(AudioPlayerStatus.Idle, () => {
      Logger.log(LogMessages.PlaybackFinish, {});
      resolve();
    });
    player.on("error", (error) => {
      Logger.log(LogMessages.PlaybackError, { error: error.message });
      console.error(error);
      resolve();
    });
  });
}

function detectLanguage(text: string): string {
  // TODO: detect language maybe?
  return "zh-CN";
}

function resetDisconnectTimer(guildId: string, connection: VoiceConnection) {
  // clear old timer
  const oldTimer = disconnectTimers.get(guildId);
  if (oldTimer) {
    clearTimeout(oldTimer);
  }
  // new timer for timeout
  const timer = setTimeout(() => {
    Logger.log(LogMessages.IdleTimeout, {});
    connection.destroy();
    disconnectTimers.delete(guildId);
  }, 30 * 60 * 1000); // 30 min

  disconnectTimers.set(guildId, timer);
}

client
  .login(Config.token)
  .then(() => {
    Logger.log(LogMessages.LoginSuccess, {});
  })
  .catch((err: Error) => {
    Logger.log(LogMessages.LoginFailed, { error: err.message });
    console.log(err);
  });
