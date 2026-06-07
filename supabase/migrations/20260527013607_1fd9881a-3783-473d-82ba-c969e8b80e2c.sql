REVOKE INSERT ON public.contact_inquiries FROM anon;
REVOKE INSERT ON public.contact_inquiries FROM authenticated;
DROP POLICY IF EXISTS "Anyone can submit contact inquiries" ON public.contact_inquiries;
