import {
  FileCheck, Building2, IdCard, HeartPulse, Briefcase, Building,
  ShieldCheck, Users, FileText, Plane, Star, Globe, Mail, Phone,
  Award, Clock, Shield, Briefcase as BriefcaseIcon, type LucideIcon,
} from "lucide-react";

export const ICONS: Record<string, LucideIcon> = {
  FileCheck, Building2, IdCard, HeartPulse, Briefcase, Building,
  ShieldCheck, Users, FileText, Plane, Star, Globe, Mail, Phone,
  Award, Clock, Shield,
};

export const ICON_NAMES = Object.keys(ICONS);

export function getIcon(name: string | null | undefined): LucideIcon {
  if (!name) return FileText;
  return ICONS[name] ?? FileText;
}
