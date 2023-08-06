/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { Character } from 'src/entity/character.entity';
import { Member } from 'src/entity/member.entity';
import { Todo } from 'src/entity/todo.entity';
import { TodoPer } from 'src/entity/todo.per.entity';
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
      type: 'mysql',
      host: MYSQL_DB_HOST,
      port: MYSQL_DB_PORT,
      username: MYSQL_DB_USER,
      password: MYSQL_DB_PW,
      database: MYSQL_DB_NAME,
      synchronize: MYSQL_DB_Synch, // development: true, production: false
      entities: [Member, Character, Todo, TodoPer],
    };
  }
}
