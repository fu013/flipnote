import { IsNumber, IsString } from 'class-validator';

/* API가 요구하는 데이터 파라미터를 client가 제대로 전송하였는지 검증 및 요청 데이터를
객체의 멤버 변수와 매핑시키기 위하여 Data Transfer Object 작성 
entity는 데이터베이스와의 1:1 매핑이지만, dto는 요청데이터와 1:1매핑 비교라는 차이가 있다.
*/
export class loginMemberDto {
    @IsString()
    readonly mb_id: string;

    @IsString()
    readonly mb_pw: string;
}
