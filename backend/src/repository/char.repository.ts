import { Injectable } from '@nestjs/common';
import { Character } from 'src/entity/character.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CharRepository extends Repository<Character> {
    constructor(
        private dataSource: DataSource,
    ) {
        super(Character, dataSource.createEntityManager());
    }

    async getMemberAll(): Promise<Character[]> {
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