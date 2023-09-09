import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { League } from './league.entity';
import { User } from 'src/users/entities/user.entity';

@Entity('leagues_participants_users')
export class UserLeague {
  @PrimaryColumn()
  leaguesId: string;

  @PrimaryColumn()
  usersId: string;

  @ManyToOne(() => League, (league) => league.participants, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'leaguesId', referencedColumnName: 'id' }])
  leagues: League[];

  @ManyToOne(() => User, (user) => user.leagues, {
    onDelete: 'NO ACTION',
    onUpdate: 'NO ACTION',
  })
  @JoinColumn([{ name: 'usersId', referencedColumnName: 'id' }])
  user: User;

  @Column({ default: 0 })
  totalMatches: number;

  @Column({ default: 0 })
  matchesWon: number;

  @Column({ default: 0 })
  matchesTied: number;

  @Column({ default: 0 })
  matchesLost: number;

  @Column({ default: 0 })
  points: number;
}
