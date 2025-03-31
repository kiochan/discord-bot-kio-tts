type ExtractPlaceholders<T extends string> =
  T extends `${infer _Start}{${infer Param}}${infer Rest}`
    ? Param | ExtractPlaceholders<Rest>
    : never;

type TemplateToObject<T extends string> = [ExtractPlaceholders<T>] extends [
  never
]
  ? {} | undefined
  : { [K in ExtractPlaceholders<T>]: string };

export const TextBuilder = {
  build: <T extends string>(
    template: T,
    ...args: TemplateToObject<T> extends {} | undefined
      ? [options?: TemplateToObject<T>]
      : [options: TemplateToObject<T>]
  ) => {
    const options = args[0];

    if (!options || typeof options !== "object") return template;

    const record = options as Record<string, string>;

    return template.replace(/\{(.*?)\}/g, (_, key) => {
      return record[key] ?? `{${key}:undefined}`;
    });
  },
};
