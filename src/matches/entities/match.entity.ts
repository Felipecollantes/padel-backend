import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { League } from '../../league/entities/league.entity';
import { User } from '../../users/entities/user.entity';

@Entity('matches')
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', nullable: true })
  startTime: Date;

  @Column({ default: false })
  isCompleted: boolean;

  @Column({ default: false })
  isCancelled: boolean;

  @ManyToOne(() => League, (league) => league.matches)
  league: League;

  @ManyToMany(() => User, (user) => user.teamOneMatches, { cascade: true })
  @JoinTable()
  teamOnePlayers: User[];

  @ManyToMany(() => User, (user) => user.teamTwoMatches, { cascade: true })
  @JoinTable()
  teamTwoPlayers: User[];

  @Column({ default: 0 })
  setsWonByTeamOne: number;

  @Column({ default: 0 })
  setsWonByTeamTwo: number;

  @Column({ default: 0 })
  gamesWonByTeamOne: number;

  @Column({ default: 0 })
  gamesWonByTeamTwo: number;
}
