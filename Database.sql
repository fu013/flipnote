
CREATE TABLE character
(
  mb_id         VARCHAR(255) NOT NULL COMMENT '회원 아이디',
  ch_name       VARCHAR(255) NOT NULL COMMENT '캐릭터명',
  ch_image      TEXT         NOT NULL COMMENT '캐릭터이미지',
  ch_level      VARCHAR(255) NULL     COMMENT '레벨',
  ch_murung     VARCHAR(255) NULL     COMMENT '무릉층수',
  daily_count   INT          NULL     DEFAULT 0 COMMENT '일퀘횟수',
  weekly_count  INT          NULL     DEFAULT 0 COMMENT '주간퀘횟수',
  monthly_count INT          NULL     DEFAULT 0 COMMENT '월간퀘횟수',
  weekly_meso   BIGINT       NULL     DEFAULT 0 COMMENT '주간메소획득량',
  created_date  DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '컬럼 생성 날짜',
  PRIMARY KEY (mb_id, ch_name, ch_image)
) COMMENT '캐릭터';

ALTER TABLE character
  ADD CONSTRAINT UQ_ch_name UNIQUE (ch_name);

CREATE TABLE member
(
  mb_id               VARCHAR(255) NOT NULL COMMENT '회원 아이디',
  mb_pw               VARCHAR(255) NULL     COMMENT '회원 비밀번호',
  login_refresh_token VARCHAR(255) NULL     COMMENT '회원 리프래쉬 토큰',
  cnt_login_date      DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '최근 로그인 날짜',
  created_date        DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '컬럼 생성 날짜',
  PRIMARY KEY (mb_id)
) COMMENT '회원';

ALTER TABLE member
  ADD CONSTRAINT UQ_mb_id UNIQUE (mb_id);

CREATE TABLE todo_complete
(
  mb_id          VARCHAR(255) NOT NULL COMMENT '회원 아이디',
  ch_name        VARCHAR(255) NOT NULL COMMENT '캐릭터명',
  todo_id        INT          NOT NULL COMMENT '투두 기본키',
  todo_name      VARCHAR(255) NOT NULL COMMENT '투두명',
  todo_image     VARCHAR(255) NULL     COMMENT '투두아이콘 이미지경로',
  todo_type      CHAR(1)      NULL     COMMENT '투두 타입: d: 매일, w1: 주(월), w2: 주(목) m: 달(1일)',
  completed_date DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '완료 일자',
  todo_name      VARCHAR(255) NOT NULL COMMENT '투두명',
  PRIMARY KEY (todo_id, todo_name)
) COMMENT '투두 리스트(완료)';

ALTER TABLE todo_complete
  ADD CONSTRAINT UQ_todo_name UNIQUE (todo_name);

CREATE TABLE todo_private
(
  mb_id        VARCHAR(255) NOT NULL COMMENT '회원 아이디',
  ch_name      VARCHAR(255) NOT NULL COMMENT '캐릭터명',
  todo_name    VARCHAR(255) NOT NULL COMMENT '투두명',
  todo_id      INT          NOT NULL AUTO_INCREMENT COMMENT '투두 기본키',
  todo_image   VARCHAR(255) NULL     COMMENT '투두아이콘 이미지경로',
  todo_type    CHAR(1)      NULL     COMMENT '투두 타입: d: 매일, w1: 주(월), w2: 주(목) m: 달(1일)',
  created_date DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '컬럼 생성 날짜',
  PRIMARY KEY (todo_name, todo_id)
) COMMENT '투두 리스트(개인)';

ALTER TABLE todo_private
  ADD CONSTRAINT UQ_todo_name UNIQUE (todo_name);

CREATE TABLE todo_public
(
  todo_id      INT          NOT NULL AUTO_INCREMENT COMMENT '투두 기본키',
  todo_name    VARCHAR(255) NOT NULL COMMENT '투두명',
  todo_image   VARCHAR(255) NULL     COMMENT '투두아이콘 이미지경로',
  todo_type    CHAR(1)      NULL     COMMENT '투두 타입: d: 매일, w1: 주(월), w2: 주(목) m: 달(1일)',
  created_date DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '컬럼 생성 날짜',
  PRIMARY KEY (todo_id, todo_name)
) COMMENT '투두 리스트(공통)';

ALTER TABLE todo_public
  ADD CONSTRAINT UQ_todo_name UNIQUE (todo_name);

ALTER TABLE character
  ADD CONSTRAINT FK_member_TO_character
    FOREIGN KEY (mb_id)
    REFERENCES member (mb_id);

ALTER TABLE todo_private
  ADD CONSTRAINT FK_member_TO_todo_private
    FOREIGN KEY (mb_id)
    REFERENCES member (mb_id);

ALTER TABLE todo_private
  ADD CONSTRAINT FK_character_TO_todo_private
    FOREIGN KEY (ch_name)
    REFERENCES character (ch_name);

ALTER TABLE todo_complete
  ADD CONSTRAINT FK_todo_private_TO_todo_complete
    FOREIGN KEY (todo_name, todo_id)
    REFERENCES todo_private (todo_name, todo_id);

CREATE UNIQUE INDEX char_index
  ON character (ch_name ASC, mb_id ASC);

CREATE UNIQUE INDEX todo_public_index
  ON todo_public (todo_name ASC);

CREATE UNIQUE INDEX todo_private_index
  ON todo_private (mb_id ASC, ch_name ASC, todo_name ASC);

CREATE UNIQUE INDEX member_index
  ON member (mb_id ASC);

CREATE INDEX todo_complete_index
  ON todo_complete (mb_id ASC, ch_name ASC, todo_name ASC);
