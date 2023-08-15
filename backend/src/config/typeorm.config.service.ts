/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Character } from 'src/entity/character.entity';
import { Member } from 'src/entity/member.entity';
import { TodoComplete } from 'src/entity/todo.complete.entity';
import { TodoPublic } from 'src/entity/todo.public.entity';
import { TodoPrivate } from 'src/entity/todo.private.entity';
import {
  MYSQL_DB_HOST,
  MYSQL_DB_NAME,
  MYSQL_DB_PORT,
  MYSQL_DB_PW,
  MYSQL_DB_Synch,
  MYSQL_DB_USER,
} from './config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      logging: false,
      type: 'mysql',
      host: MYSQL_DB_HOST,
      port: MYSQL_DB_PORT,
      username: MYSQL_DB_USER,
      password: MYSQL_DB_PW,
      database: MYSQL_DB_NAME,
      synchronize: MYSQL_DB_Synch, // development: true, production: false
      entities: [Member, Character, TodoPublic, TodoPrivate, TodoComplete],
    };
  }
}
