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
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const character = new Character();
            character.mbId = mbId;
            character.chImage = chImage;
            character.chName = chName;
            character.chLevel = chLevel;
            character.chMurung = chMurung;

            await queryRunner.manager.save(character);

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
            await queryRunner.release();
        }
    }

    async delCharacter(mbId: string, chName: string): Promise<void> {
        const queryRunner = this.dataSource.createQueryRunner();
        try {
            await queryRunner.connect();
            await queryRunner.startTransaction();

            const character = await queryRunner.manager.findOne(Character, {
                where: { mbId, chName },
            });

            if (character) {
                await queryRunner.manager.remove(character);
            } else {
                throw new Error("Character not found.");
            }

            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        } finally {
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