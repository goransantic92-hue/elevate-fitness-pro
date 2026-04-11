-- Jednokratno u Supabase → SQL Editor → Run
-- Uslov: nalog mora već postojati (bar jednom Sign up + potvrda mejla ako je uključena).

-- 1) Admin (Coach panel + sve RLS koje dozvoljava admin)
update public.profiles
set role = 'admin'
where lower(email) = lower('santic.goran@yahoo.com');

-- 2) Pristup programu kao „kupljeno“ (lifetime)
update public.member_access as ma
set
  has_access = true,
  access_type = 'lifetime',
  source = 'manual',
  activated_at = coalesce(ma.activated_at, now()),
  expires_at = null
from public.profiles as p
where ma.user_id = p.id
  and lower(p.email) = lower('santic.goran@yahoo.com');

-- Provera (opciono — treba 1 red u oba upita)
-- select id, email, role from public.profiles where lower(email) = lower('santic.goran@yahoo.com');
-- select * from public.member_access where user_id = (select id from public.profiles where lower(email) = lower('santic.goran@yahoo.com'));
