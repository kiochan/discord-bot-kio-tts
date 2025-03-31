import { config } from "dotenv";
import ffmpegPath from "ffmpeg-static";

config();

if (ffmpegPath) {
  process.env.FFMPEG_PATH = ffmpegPath;
}

export const Config = {
  token: process.env.DISCORD_TOKEN,
} as const;
