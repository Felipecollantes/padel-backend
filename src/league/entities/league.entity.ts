import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

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

  @Column({ default: 0 })
  matchesWon: number;

  @Column({ default: 0 })
  matchesTied: number;

  @Column({ default: 0 })
  matchesLost: number;

  @Column({ default: 0 })
  points: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToMany(() => User, (user) => user.leagues, { cascade: true })
  @JoinTable()
  participants: User[];
}
