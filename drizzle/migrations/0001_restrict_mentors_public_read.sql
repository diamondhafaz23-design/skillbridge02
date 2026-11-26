DROP POLICY IF EXISTS mentors_public_read ON public.mentors;
CREATE POLICY mentors_public_read ON public.mentors FOR SELECT TO anon, authenticated USING (is_sample = true);