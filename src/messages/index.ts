import { ar } from "./ar";
import { en } from "./en";

export const messages = {
  ar,
  en,
};

export type Lang = keyof typeof messages;