import type { IconType } from "react-icons";
import {
  FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp, FaYoutube,
  FaLinkedinIn, FaPinterestP, FaTelegramPlane, FaSnapchatGhost,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

export const SOCIAL_PLATFORMS = [
  { value: "facebook",  label: "Facebook",  icon: FaFacebookF },
  { value: "instagram", label: "Instagram", icon: FaInstagram },
  { value: "tiktok",    label: "TikTok",    icon: FaTiktok },
  { value: "whatsapp",  label: "WhatsApp",  icon: FaWhatsapp },
  { value: "youtube",   label: "YouTube",   icon: FaYoutube },
  { value: "linkedin",  label: "LinkedIn",  icon: FaLinkedinIn },
  { value: "x",         label: "X (Twitter)", icon: FaXTwitter },
  { value: "pinterest", label: "Pinterest", icon: FaPinterestP },
  { value: "telegram",  label: "Telegram",  icon: FaTelegramPlane },
  { value: "snapchat",  label: "Snapchat",  icon: FaSnapchatGhost },
  { value: "email",     label: "Email",     icon: MdEmail },
] as const;

export type SocialPlatform = (typeof SOCIAL_PLATFORMS)[number]["value"];

const MAP: Record<string, { label: string; icon: IconType }> = Object.fromEntries(
  SOCIAL_PLATFORMS.map((p) => [p.value, { label: p.label, icon: p.icon }]),
);

export function getSocialMeta(platform: string) {
  return MAP[platform] ?? { label: platform, icon: MdEmail };
}
