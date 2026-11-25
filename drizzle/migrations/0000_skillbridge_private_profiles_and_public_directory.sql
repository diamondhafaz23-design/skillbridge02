CREATE TABLE public.profiles (
 user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
 full_name text NOT NULL DEFAULT '' CHECK (length(full_name) <= 100), professional_title text NOT NULL DEFAULT '',
 work_experience text NOT NULL DEFAULT '', years_experience integer NOT NULL DEFAULT 0 CHECK (years_experience BETWEEN 0 AND 60),
 education text NOT NULL DEFAULT '', languages text[] NOT NULL DEFAULT '{}', location text NOT NULL DEFAULT '', professional_summary text NOT NULL DEFAULT '',
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY profiles_owner ON public.profiles FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));

CREATE TABLE public.assessments (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
 category text NOT NULL DEFAULT 'combined_professional', questions_answered jsonb NOT NULL DEFAULT '[]', score integer NOT NULL DEFAULT 0 CHECK (score BETWEEN 0 AND 100),
 results jsonb NOT NULL DEFAULT '{}', completed_at timestamptz NOT NULL DEFAULT now(), UNIQUE(user_id, category)
);
GRANT SELECT, DELETE ON public.assessments TO authenticated;
GRANT ALL ON public.assessments TO service_role;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY assessment_read_owner ON public.assessments FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE POLICY assessment_delete_owner ON public.assessments FOR DELETE TO authenticated USING (user_id = (SELECT auth.uid()));

CREATE TABLE public.skills (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
 skill_name text NOT NULL CHECK (length(skill_name) BETWEEN 1 AND 100), source text NOT NULL CHECK (source IN ('self-reported', 'assessment-supported')),
 origin text NOT NULL CHECK (origin IN ('profile', 'assessment')), assessment_id uuid REFERENCES public.assessments(id) ON DELETE CASCADE,
 UNIQUE(user_id, skill_name, origin), CHECK (source <> 'assessment-supported' OR (origin = 'assessment' AND assessment_id IS NOT NULL))
);
GRANT SELECT ON public.skills TO authenticated;
GRANT ALL ON public.skills TO service_role;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY skills_read_owner ON public.skills FOR SELECT TO authenticated USING (user_id = (SELECT auth.uid()));
CREATE INDEX skills_assessment_id_idx ON public.skills(assessment_id);

CREATE TABLE public.opportunities (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), sample_key text UNIQUE, job_title text NOT NULL, employer text NOT NULL, description text NOT NULL DEFAULT '',
 required_skills text[] NOT NULL DEFAULT '{}', location text NOT NULL DEFAULT '', experience_requirements text NOT NULL DEFAULT '',
 employment_type text NOT NULL DEFAULT 'Full-time', credential_flexible boolean NOT NULL DEFAULT true, languages text[] NOT NULL DEFAULT '{}', is_sample boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.opportunities TO anon, authenticated;
GRANT ALL ON public.opportunities TO service_role;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY opportunities_public_read ON public.opportunities FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.mentors (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), sample_key text UNIQUE, name text NOT NULL, profession text NOT NULL DEFAULT '', professional_industry text NOT NULL,
 expertise text[] NOT NULL DEFAULT '{}', skills text[] NOT NULL DEFAULT '{}', languages text[] NOT NULL DEFAULT '{}', short_biography text NOT NULL DEFAULT '',
 experience_years integer NOT NULL DEFAULT 0, story text NOT NULL DEFAULT '', is_sample boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.mentors TO anon, authenticated;
GRANT ALL ON public.mentors TO service_role;
ALTER TABLE public.mentors ENABLE ROW LEVEL SECURITY;
CREATE POLICY mentors_public_read ON public.mentors FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.mentorship_requests (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
 mentor_id uuid NOT NULL REFERENCES public.mentors(id), requester_name text NOT NULL CHECK (length(requester_name) BETWEEN 1 AND 100),
 contact_email text NOT NULL CHECK (length(contact_email) <= 255), message text NOT NULL CHECK (length(message) BETWEEN 1 AND 1000), preferred_language text NOT NULL,
 status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'cancelled')), created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.mentorship_requests TO authenticated;
GRANT ALL ON public.mentorship_requests TO service_role;
ALTER TABLE public.mentorship_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY requests_owner ON public.mentorship_requests FOR ALL TO authenticated USING (user_id = (SELECT auth.uid())) WITH CHECK (user_id = (SELECT auth.uid()));
CREATE INDEX requests_user_id_idx ON public.mentorship_requests(user_id);
CREATE INDEX requests_mentor_id_idx ON public.mentorship_requests(mentor_id);

CREATE FUNCTION public.create_skillbridge_profile() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
BEGIN INSERT INTO public.profiles(user_id) VALUES (NEW.id) ON CONFLICT DO NOTHING; RETURN NEW; END;
$$;
REVOKE ALL ON FUNCTION public.create_skillbridge_profile() FROM PUBLIC, anon, authenticated;
CREATE TRIGGER skillbridge_profile_on_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.create_skillbridge_profile();
INSERT INTO public.profiles(user_id) SELECT id FROM auth.users ON CONFLICT DO NOTHING;

CREATE FUNCTION public.save_skillbridge_profile(p_profile jsonb, p_skills text[]) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE uid uuid := auth.uid();
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 IF length(trim(p_profile->>'full_name')) < 1 OR jsonb_typeof(p_profile->'languages') <> 'array' OR cardinality(p_skills) > 100 THEN RAISE EXCEPTION 'Invalid profile'; END IF;
 INSERT INTO public.profiles(user_id,full_name,professional_title,work_experience,years_experience,education,languages,location,professional_summary)
 VALUES(uid,p_profile->>'full_name',p_profile->>'professional_title',p_profile->>'work_experience',(p_profile->>'years_experience')::integer,p_profile->>'education',ARRAY(SELECT jsonb_array_elements_text(p_profile->'languages')),p_profile->>'location',p_profile->>'professional_summary')
 ON CONFLICT(user_id) DO UPDATE SET full_name=EXCLUDED.full_name,professional_title=EXCLUDED.professional_title,work_experience=EXCLUDED.work_experience,years_experience=EXCLUDED.years_experience,education=EXCLUDED.education,languages=EXCLUDED.languages,location=EXCLUDED.location,professional_summary=EXCLUDED.professional_summary,updated_at=now();
 DELETE FROM public.skills WHERE user_id=uid AND origin='profile';
 INSERT INTO public.skills(user_id,skill_name,source,origin) SELECT uid,trim(s),'self-reported','profile' FROM unnest(p_skills) s WHERE trim(s)<>'' ON CONFLICT DO NOTHING;
END;
$$;
REVOKE ALL ON FUNCTION public.save_skillbridge_profile(jsonb,text[]) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_skillbridge_profile(jsonb,text[]) TO authenticated;

CREATE FUNCTION public.save_skillbridge_assessment(p_answers jsonb, p_experience jsonb) RETURNS timestamptz LANGUAGE plpgsql SECURITY DEFINER SET search_path = '' AS $$
DECLARE uid uuid := auth.uid(); aid uuid; stamp timestamptz := now(); correct integer := 0; i integer; idx integer; verified text[] := '{}'; names text[] := ARRAY['Accounting','Excel','First Aid','JavaScript','Electrical Wiring','Customer Service']; expected integer[] := ARRAY[1,0,1,0,1,1];
BEGIN
 IF uid IS NULL THEN RAISE EXCEPTION 'Sign in required'; END IF;
 IF jsonb_typeof(p_answers) <> 'array' OR jsonb_array_length(p_answers)>6 OR jsonb_typeof(p_experience) <> 'object' OR jsonb_typeof(p_experience->'practical') IS DISTINCT FROM 'array' OR jsonb_typeof(p_experience->'transferable') IS DISTINCT FROM 'array' OR jsonb_typeof(p_experience->'languages') IS DISTINCT FROM 'array' OR length(trim(p_experience->>'occupation')) < 1 OR (p_experience->>'years')::integer NOT BETWEEN 0 AND 60 THEN RAISE EXCEPTION 'Invalid assessment'; END IF;
 FOR i IN 1..jsonb_array_length(p_answers) LOOP
 idx := (p_answers->>(i-1))::integer;
 IF idx NOT BETWEEN 0 AND 2 THEN RAISE EXCEPTION 'Invalid answer'; END IF;
 IF idx = expected[i] THEN correct := correct+1; verified := array_append(verified,names[i]); END IF;
 END LOOP;
 INSERT INTO public.profiles(user_id) VALUES(uid) ON CONFLICT DO NOTHING;
 INSERT INTO public.assessments(user_id,category,questions_answered,score,results,completed_at)
 VALUES(uid,'combined_professional',p_answers,round(correct*100.0/6),jsonb_build_object('experience',p_experience,'verifiedSkills',to_jsonb(verified)),stamp)
 ON CONFLICT(user_id,category) DO UPDATE SET questions_answered=EXCLUDED.questions_answered,score=EXCLUDED.score,results=EXCLUDED.results,completed_at=stamp RETURNING id INTO aid;
 DELETE FROM public.skills WHERE user_id=uid AND origin='assessment';
 INSERT INTO public.skills(user_id,skill_name,source,origin,assessment_id) SELECT uid,s,'assessment-supported','assessment',aid FROM unnest(verified) s;
 INSERT INTO public.skills(user_id,skill_name,source,origin,assessment_id)
 SELECT uid,trim(s),'self-reported','assessment',aid FROM (SELECT jsonb_array_elements_text(p_experience->'practical') s UNION SELECT jsonb_array_elements_text(p_experience->'transferable') UNION SELECT jsonb_array_elements_text(p_experience->'languages')) entries
 WHERE trim(s) <> '' AND NOT(trim(s)=ANY(verified)) ON CONFLICT DO NOTHING;
 RETURN stamp;
END;
$$;
REVOKE ALL ON FUNCTION public.save_skillbridge_assessment(jsonb,jsonb) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.save_skillbridge_assessment(jsonb,jsonb) TO authenticated;
