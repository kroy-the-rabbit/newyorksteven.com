CREATE TABLE counter (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  visits INTEGER NOT NULL
);

INSERT INTO counter (id, visits) VALUES (1, 4206);

CREATE TABLE guestbook (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  ip_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX guestbook_created_at ON guestbook (created_at);
CREATE INDEX guestbook_ip_hash_created_at ON guestbook (ip_hash, created_at);
