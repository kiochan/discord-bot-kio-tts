export enum LogMessages {
  LoginAs = "login as {userTag}",
  LoginSuccess = "🤖 Bot login successful!",
  LoginFailed = "❌ Failed to login: {error}",
  PlaybackFinish = "⏹️ Playback finished.",
  PlaybackError = "⚠️ Playback error: {error}",
  IdleTimeout = "⏰ Timeout... {minutes} minutes no chats",
  VoiceSend = '[{user}] in #{channel} => "${text}" -> TTS: "${voice}"',
}

export enum ReplyMessages {
  SendTooQuick = "发的太快了，我不读~",
  TextTooLong = "太长了我不读~",
  UnableToPlayVoice = "我无法正常播放音频，出错啦。",
}

export enum VoiceMessages {
  SendImage = "他发送了图片",
  SendLink = "他发送了链接",
  UserSay = "{user} 说 {text}",
}
