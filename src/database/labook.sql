-- Active: 1690833567484@@127.0.0.1@3306
CREATE TABLE users (
  id TEXT PRIMARY KEY UNIQUE NOT NULL, 
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT NOT NULL,
  created_at TEXT DEFAULT(DATETIME()) NOT NULL
);

CREATE TABLE posts (
  id TEXT PRIMARY KEY UNIQUE NOT NULL, 
  creator_id TEXT NOT NULL, /*ref: > users.id */
  content TEXT NOT NULL,
  likes INTEGER NOT NULL,
  dislikes INTEGER NOT NULL,
  created_at TEXT DEFAULT(DATETIME()) NOT NULL,
  updated_at TEXT DEFAULT(DATETIME()) NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE
);

CREATE TABLE likes_dislikes (
  user_id TEXT NOT NULL, /*ref: <> users.id*/
  post_id TEXT NOT NULL, /*ref: <> posts.id*/ 
  like INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE,

  FOREIGN KEY (post_id) REFERENCES posts (id)
  ON UPDATE CASCADE
  ON DELETE CASCADE

);

-- VISUALIZAR TABELAS 

PRAGMA table_info ("users");
PRAGMA table_info ("posts");
PRAGMA table_info ("likes_dislikes"); 


-- POPULAR TABELAS
INSERT INTO users (id, name, email, password, role)
VALUES
  -- ('u001', 'Beltrana', 'beltrana@email.com', 'beltrana00', 'X'),
	-- ('u002', 'Ciclana', 'ciclana@email.com', 'ciclana01', 'w'),
	('u004', 'Priscila', 'priscila@email.com', 'priscila74', 'ADMIN');

INSERT INTO posts (id, creator_id, content, likes, dislikes)
VALUES
  ('p001', 'u001', 'Não curti o que você disse!', 1, 0 ),
	('p002', 'u002', 'Não curti o que você disse!', 1, 0 ),
  ('p003', 'u003', 'Deixa ela em paz!', 1, 0 );
	

INSERT INTO likes_dislikes (user_id, post_id, like )
VALUES
	('u002', 'p002', '1'),
  ('u003', 'p003', '1');



-- LEITURA DAS TABELAS
SELECT * FROM users;
SELECT * FROM posts;
SELECT * FROM likes_dislikes;


-- DELETAR TABELAS

DROP TABLE users;
DROP TABLE posts;
DROP TABLE likes_dislikes;

DELETE FROM users
WHERE id "b776d54f-4160-4a18-9e36-d602ba21b237"



