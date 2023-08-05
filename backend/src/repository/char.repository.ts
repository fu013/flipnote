import { Injectable } from '@nestjs/common';
import { Character } from 'src/entity/character.entity';
import { Member } from 'src/entity/member.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class CharRepository extends Repository<Character> {
    constructor(
        private dataSource: DataSource,
    ) {
        super(Character, dataSource.createEntityManager());
    }

    async setCharacter(mbId: string, chName: string, chImage: string, chLevel: string, chMurung: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            // 트랜잭션 시작
            await queryRunner.connect();
            await queryRunner.startTransaction();

            // Character 엔티티 생성
            const character = new Character();
            character.mbId = mbId;
            character.chImage = chImage;
            character.chName = chName;
            character.chLevel = chLevel;
            character.chMurung = chMurung;

            // Character 엔티티 저장
            await queryRunner.manager.save(character);

            // 트랜잭션 커밋
            await queryRunner.commitTransaction();
        } catch (err) {
            // 에러 발생 시 롤백
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            // QueryRunner 해제
            await queryRunner.release();
        }
    }

    async getCharacterInfoByMemberId(mbId: string): Promise<Character[]> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const characters = await queryRunner.manager.find(Character, {
                select: ['mbId', 'chName', 'chImage', 'chLevel', 'chMurung'],
                where: { mbId },
            });

            await queryRunner.commitTransaction();

            return characters;
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        } finally {
            await queryRunner.release();
        }
    }
}