
CREATE TABLE character
(
  mb_id         VARCHAR(255) NOT NULL COMMENT '회원 아이디',
  ch_name       VARCHAR(255) NOT NULL COMMENT '캐릭터명',
  ch_level      SMALLINT     NULL     COMMENT '레벨',
  ch_murung     TINYINT      NULL     COMMENT '무릉층수',
  daily_count   INT          NULL     COMMENT '일퀘횟수',
  weekly_count  INT          NULL     COMMENT '주간퀘횟수',
  monthly_count INT          NULL     COMMENT '월간퀘횟수',
  weekly_meso   BIGINT       NULL     COMMENT '주간메소획득량',
  todo_list     TEXT         NULL     COMMENT '고정 투두리스트',
  created_date  DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '컬럼 생성 날짜',
  PRIMARY KEY (mb_id, ch_name)
) COMMENT '캐릭터';

ALTER TABLE character
  ADD CONSTRAINT UQ_ch_name UNIQUE (ch_name);

CREATE TABLE member
(
  mb_no               INT          NOT NULL AUTO_INCREMENT COMMENT '회원 기본키',
  mb_id               VARCHAR(255) NOT NULL COMMENT '회원 아이디',
  mb_pw               VARCHAR(255) NULL     COMMENT '회원 비밀번호',
  login_refresh_token VARCHAR(255) NULL     COMMENT '회원 리프래쉬 토큰',
  cnt_login_date      DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '최근 로그인 날짜',
  created_date        DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '컬럼 생성 날짜',
  PRIMARY KEY (mb_no, mb_id)
) COMMENT '회원';

ALTER TABLE member
  ADD CONSTRAINT UQ_mb_id UNIQUE (mb_id);

CREATE TABLE todo
(
  todo_id      INT          NOT NULL AUTO_INCREMENT COMMENT '투두 기본키',
  todo_name    VARCHAR(255) NOT NULL COMMENT '투두명',
  todo_image   VARCHAR(255) NOT NULL COMMENT '투두아이콘 이미지경로',
  todo_type    VARCHAR(255) NULL     COMMENT '투두 타입: d: 매일, w1: 주(월), w2: 주(목) m: 달(1일)',
  created_date DATETIME     NULL     DEFAULT CURRENT_TIMESTAMP COMMENT '컬럼 생성 날짜',
  PRIMARY KEY (todo_id, todo_name)
) COMMENT '할일 리스트';

ALTER TABLE todo
  ADD CONSTRAINT UQ_todo_name UNIQUE (todo_name);

ALTER TABLE character
  ADD CONSTRAINT FK_member_TO_character
    FOREIGN KEY (mb_id)
    REFERENCES member (mb_id);
