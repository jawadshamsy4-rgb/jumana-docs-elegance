import {
  FileCheck, Building2, IdCard, HeartPulse, Briefcase, Building,
  ShieldCheck, Users, FileText,
} from "lucide-react";

export const services = [
  {
    icon: FileCheck,
    title: "Visa Processing",
    desc: "Complete assistance for new visas, visa renewals, cancellations, status change, family visa applications, and visit visa services.",
  },
  {
    icon: Building2,
    title: "MOI Services",
    desc: "Support for Ministry of Interior services including application processing, approvals, updates, and online submissions.",
  },
  {
    icon: IdCard,
    title: "Emirates ID Services",
    desc: "Application, renewal, replacement, biometric appointment booking, and Emirates ID updates handled professionally.",
  },
  {
    icon: HeartPulse,
    title: "Medical & Insurance",
    desc: "Medical test appointments, health insurance registration, renewal, and related documentation support.",
  },
  {
    icon: Briefcase,
    title: "Trade License Services",
    desc: "New trade license applications, renewals, modifications, cancellations, and business activity updates.",
  },
  {
    icon: Building,
    title: "Business Setup",
    desc: "Professional guidance for company formation, mainland and free zone setup, documentation, and approvals.",
  },
  {
    icon: ShieldCheck,
    title: "PRO Services",
    desc: "Government liaison services including document submission, approvals, labor and immigration processing.",
  },
  {
    icon: Users,
    title: "Labour & Immigration",
    desc: "Labour contracts, work permits, visa quota processing, immigration applications, and employee-related services.",
  },
  {
    icon: FileText,
    title: "Document Typing & Attestation",
    desc: "Fast and accurate typing services for official documents, agreements, applications, and document attestation assistance.",
  },
] as const;
