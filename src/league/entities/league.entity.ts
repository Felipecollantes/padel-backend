import { User } from 'src/users/entities/user.entity';
import { Match } from '../../matches/entities/match.entity';
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('leagues')
export class League {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: 0 })
  totalMatches: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToMany(() => User, (user) => user.leagues, { cascade: true })
  @JoinTable()
  participants: User[];

  @OneToMany(() => Match, (match) => match.league, { cascade: true })
  matches: Match[];
}
