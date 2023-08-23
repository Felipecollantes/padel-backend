import { Exclude, Transform } from 'class-transformer';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: false,
  })
  password: string;

  @Column('text')
  fullName: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @Exclude()
  @Column('json', {
    default: ['user'],
  })
  roles: string[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @Transform(({ value }) => JSON.parse(JSON.stringify(value)))
  get rolesArray(): string[] {
    return this.roles;
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.checkFieldsBeforeInsert();
  }
}
