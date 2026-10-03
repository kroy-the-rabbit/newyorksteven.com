-- Spread the original entries over the ~5 months before launch (2026-10-02)
-- so the guestbook reads like it has been signed all along.
UPDATE guestbook
SET created_at = datetime(
  '2026-10-02',
  '-' || ((id * 47) % 150 + 1) || ' days',
  '+' || ((id * 11) % 24) || ' hours',
  '+' || ((id * 23) % 60) || ' minutes'
)
WHERE ip_hash = 'seed';
