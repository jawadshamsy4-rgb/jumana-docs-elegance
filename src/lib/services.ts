// Fallback images for the originally-seeded service slugs.
// All service text/icons/highlights now come from the `services` table.
import imgVisa from "@/assets/svc-visa-processing.jpg";
import imgMoi from "@/assets/svc-moi.jpg";
import imgEid from "@/assets/svc-emirates-id.jpg";
import imgMedical from "@/assets/svc-medical.jpg";
import imgTrade from "@/assets/svc-trade-license.jpg";
import imgBusiness from "@/assets/svc-business-setup.jpg";
import imgPro from "@/assets/svc-pro.jpg";
import imgMohre from "@/assets/svc-mohre.jpg";
import imgIcp from "@/assets/svc-icp.jpg";
import imgTyping from "@/assets/svc-typing.jpg";
import imgFallback from "@/assets/dubai-highrise.jpg";

export const serviceImageFallback: Record<string, string> = {
  "visa-processing": imgVisa,
  "moi-services": imgMoi,
  "emirates-id": imgEid,
  "medical-insurance": imgMedical,
  "trade-license": imgTrade,
  "business-setup": imgBusiness,
  "pro-services": imgPro,
  "mohre": imgMohre,
  "icp-gdrfa": imgIcp,
  "typing-attestation": imgTyping,
};

export const defaultServiceImage = imgFallback;

export function getServiceImage(slug: string, dbImageUrl?: string | null) {
  return dbImageUrl || serviceImageFallback[slug] || defaultServiceImage;
}
