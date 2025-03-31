import { LogMessages } from "../const/messages";
import { TextBuilder } from "./text-builder";

export const Logger = {
  log<T extends LogMessages>(
    message: Parameters<typeof TextBuilder.build<T>>[0],
    options: Parameters<typeof TextBuilder.build<T>>[1]
  ) {
    console.log(TextBuilder.build(message, options));
  },
} as const;
