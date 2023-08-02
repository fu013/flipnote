import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

// Entity는 테이블과 객체를 1:1 매핑하는 ORM의 대표적인 기능이다.
// 설정을 완료하면, 현재 연결된 DB안의 테이블명(클래스명)과 자동으로 데이터가 매핑된다.
@Entity()
class Member {
  @PrimaryGeneratedColumn() // 기본키 컬럼
  public mb_no: number;

  @Column({ unique: true }) // 아이디 유니크키
  public mb_id: string;
  @Column() // 비밀번호
  public mb_pw: string;

  @Column({ nullable: true }) // 최근 로그인 날짜
  public cnt_login_date: Date;

  @Column({ nullable: false, default: () => "CURRENT_TIMESTAMP" }) // 아이디 가입일
  public created_date: Date;

  @Column({ nullable: true }) // 리프레쉬 토큰(로그인)
  @Exclude()
  login_refresh_token?: string;
}

export default Member;