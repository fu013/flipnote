import { Injectable } from '@nestjs/common';
import { Member } from 'src/entity/member.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class MemberRepository extends Repository<Member> {
    constructor(
        private dataSource: DataSource,
    ) {
        super(Member, dataSource.createEntityManager());
    }

    async getMemberAll(): Promise<Member[]> {
        return await this.createQueryBuilder('m')
            .select([
                'm.mb_no',
                'm.mb_id',
                'm.created_date',
            ])
            .orderBy('m.mb_id', 'DESC')
            .getMany();
    }
}