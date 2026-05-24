
-- Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor');

-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- User roles
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- handle_new_user: create profile + promote first user to admin
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count INT;
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''));

  SELECT COUNT(*) INTO user_count FROM public.profiles;
  IF user_count = 1 THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin');
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Services
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  long_description TEXT NOT NULL DEFAULT '',
  highlights JSONB NOT NULL DEFAULT '[]'::jsonb,
  icon TEXT NOT NULL DEFAULT 'FileText',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER services_updated BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Site settings (key/value json)
CREATE TABLE public.site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Inquiries
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RLS policies
-- profiles
CREATE POLICY "Users view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins view all profiles" ON public.profiles FOR SELECT USING (public.is_admin());

-- user_roles
CREATE POLICY "Users view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage roles" ON public.user_roles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- services
CREATE POLICY "Public read published services" ON public.services FOR SELECT USING (is_published = true OR public.is_admin());
CREATE POLICY "Admins manage services" ON public.services FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- site_settings
CREATE POLICY "Public read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins manage site settings" ON public.site_settings FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

-- inquiries
CREATE POLICY "Anyone can submit inquiry" ON public.inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins view inquiries" ON public.inquiries FOR SELECT USING (public.is_admin());
CREATE POLICY "Admins update inquiries" ON public.inquiries FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins delete inquiries" ON public.inquiries FOR DELETE USING (public.is_admin());

-- Storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('site-assets', 'site-assets', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read site-assets" ON storage.objects FOR SELECT USING (bucket_id = 'site-assets');
CREATE POLICY "Admins upload site-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site-assets' AND public.is_admin());
CREATE POLICY "Admins update site-assets" ON storage.objects FOR UPDATE USING (bucket_id = 'site-assets' AND public.is_admin());
CREATE POLICY "Admins delete site-assets" ON storage.objects FOR DELETE USING (bucket_id = 'site-assets' AND public.is_admin());

-- Seed services
INSERT INTO public.services (slug, title, description, long_description, highlights, icon, sort_order) VALUES
('visa-processing','Visa Processing','Complete assistance for new visas, visa renewals, cancellations, status change, family visa applications, and visit visa services.','We handle every step of UAE visa processing — new employment visas, family sponsorship, visit visas, renewals, cancellations and in-country status change. Our team coordinates directly with immigration and typing centers so you avoid queues and paperwork errors.','["New employment & family visas","Visit visa and tourist visa","Renewals and cancellations","Status change (in-country)","Sponsorship documentation"]'::jsonb,'FileCheck',10),
('moi-services','MOI Services','Support for Ministry of Interior services including application processing, approvals, updates, and online submissions.','End-to-end Ministry of Interior services — from form submissions and approvals to records updates and online portal transactions. We make sure the right documents reach the right authority the first time.','["Online MOI submissions","Approvals and renewals","Records and data updates","Authority follow-up"]'::jsonb,'Building2',20),
('emirates-id','Emirates ID Services','Application, renewal, replacement, biometric appointment booking, and Emirates ID updates handled professionally.','From a brand-new Emirates ID application to renewals, lost-card replacements and biometric appointments — we book, fill and follow up so your ID is ready without the back-and-forth.','["New Emirates ID applications","Renewals and replacements","Biometric appointment booking","Data updates and corrections"]'::jsonb,'IdCard',30),
('medical-insurance','Medical & Insurance','Medical test appointments, health insurance registration, renewal, and related documentation support.','We arrange UAE medical fitness tests, health insurance enrollments and renewals, and any supporting documentation required for visa and employment processes.','["Medical fitness appointments","Health insurance enrollment","Insurance renewals","Supporting documentation"]'::jsonb,'HeartPulse',40),
('trade-license','Trade License Services','New trade license applications, renewals, modifications, cancellations, and business activity updates.','Whether you are starting a new business, renewing an existing license or amending your activities, we handle the full trade license lifecycle across mainland and free zones.','["New trade license applications","License renewals","Activity modifications","License cancellations"]'::jsonb,'Briefcase',50),
('business-setup','Business Setup','Professional guidance for company formation, mainland and free zone setup, documentation, and approvals.','We guide entrepreneurs and investors through complete UAE company formation — mainland, free zone or offshore — including structure advice, document preparation and government approvals.','["Mainland & free zone setup","Company structure advice","Document preparation","Government approvals"]'::jsonb,'Building',60),
('pro-services','PRO Services','Government liaison services including document submission, approvals, labor and immigration processing.','Our PRO team acts as your government liaison — submitting documents, securing approvals, and handling labor and immigration formalities so you can focus on running your business.','["Government document submission","Labor & immigration processing","Approvals and attestations","Ongoing PRO support"]'::jsonb,'ShieldCheck',70),
('mohre','MOHRE','Complete labour services including employment contracts, work permits, labour card processing, and Ministry of Human Resources compliance.','We handle all MOHRE-related formalities — from employment contract drafting and work permit applications to labour card renewals and ministry compliance. Our team ensures your workforce documentation meets every UAE labour regulation.','["Employment contract processing","Work permit applications","Labour card renewals","MOHRE compliance & updates"]'::jsonb,'Users',80),
('icp-gdrfa','ICP / GDRFA','Immigration and residency services including entry permits, residency visas, Emirates ID linking, and GDRFA portal transactions.','Full immigration support through the ICP (Federal Authority for Identity and Citizenship) and GDRFA (General Directorate of Residency and Foreigners Affairs) systems — entry permits, residency stamping, status updates and portal management.','["Entry permit applications","Residency visa stamping","ICP portal transactions","GDRFA status updates"]'::jsonb,'Plane',90),
('typing-attestation','Document Typing & Attestation','Fast and accurate typing services for official documents, agreements, applications, and document attestation assistance.','Professional Arabic and English typing for official forms, agreements and applications — plus full document attestation support from notary to MOFA.','["Arabic & English typing","Official forms & applications","Notary and MOFA attestation","Agreements and contracts"]'::jsonb,'FileText',100);

-- Seed site_settings
INSERT INTO public.site_settings (key, value) VALUES
('hero', '{"badge":"UAE All Documents Clearing","title_line1":"JUMANAH","title_line2":"Typing & Documents","title_line3":"Clearing","subtitle":"A premium UAE partner for visa processing, Emirates ID, trade licensing, PRO services and complete business setup — handled with precision and discretion.","cta_primary":"Explore Services","cta_secondary_phone":"054 549 9790","image_url":null}'::jsonb),
('about', '{"label":"About Us","heading":"A premium standard for UAE documentation","intro":"Jumanah Typing & Documents Clearing is a UAE-based firm offering a complete range of documents clearing, PRO and business setup services for individuals, families and enterprises.","body":"We combine in-depth knowledge of UAE regulations with a refined client experience — handling every visa, license and government interaction with discretion and precision.","closing":"From Ras Al Khaimah, we serve clients across the Emirates with a single promise: paperwork, perfected.","founder_name":"Tanvirul Islam","founder_title":"Founder & CEO","values":["Founder-led, hands-on service","Deep knowledge of UAE regulations","Transparent process and pricing","Confidential handling of every document","Multilingual client support","Fast turnaround across all emirates"],"image_url":null}'::jsonb),
('contact', '{"phone1":"054 549 9790","phone2":"054 547 6784","email":"jumanahdoc@gmail.com","address":"Dahan, Ras Al Khaimah, UAE","whatsapp":"971545499790","heading":"Let''s talk","subtitle":"Reach out for a quick consultation — we typically respond within the hour."}'::jsonb),
('branding', '{"logo_text":"JUMANAH","logo_tagline":"Typing & Clearing","logo_url":null,"primary_color":"#16a34a","accent_color":"#dc2626","font_display":"Playfair Display","font_sans":"Inter"}'::jsonb);
