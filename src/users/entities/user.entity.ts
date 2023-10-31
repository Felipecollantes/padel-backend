import { Exclude, Transform } from 'class-transformer';
import { League } from 'src/league/entities/league.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Match } from '../../matches/entities/match.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true,
  })
  email: string;

  @Column('text', {
    select: true,
  })
  password: string;

  @Column('text')
  name: string;

  @Column('text')
  surname: string;

  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ManyToMany(() => User)
  @JoinTable()
  friendship: User[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @ManyToMany(() => League, (league) => league.participants)
  leagues: League[];

  @ManyToMany(() => Match, (match) => match.teamOnePlayers)
  teamOneMatches: Match[];

  @ManyToMany(() => Match, (match) => match.teamTwoPlayers)
  teamTwoMatches: Match[];

  @Column({ default: 1200 })
  elo: number;

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
