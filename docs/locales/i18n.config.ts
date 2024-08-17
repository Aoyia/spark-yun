import en from "./en.json";
import zh from "./zh.json";

export default defineI18nConfig(() => ({
  legacy: false,
  locale: "zh",
  messages: {
    en,
    zh,
  },
}));
