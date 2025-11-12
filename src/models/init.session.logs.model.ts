import {Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn} from 'typeorm';

@Entity('init_session_logs')
export class InitSessionLogs {
  @PrimaryGeneratedColumn('increment')
  id!: number;

  @Column({ name: 'email', type: 'varchar', length: 255, nullable: false })
  @Index('idx_init_session_logs_email')
  email!: string;

  @Column({ name: 'session_id', type: 'varchar', length: 255, nullable: false })
  @Index('idx_init_session_logs_session')
  sessionId!: string;

  @Column({ name: 'session_index', type: 'varchar', length: 255, nullable: false })
  sessionIndex!: string;

  @Column({ name: 'in_response_to', type: 'varchar', length: 255, nullable: false })
  inResponseTo!: string;

  @Column({ name: 'logout_time', type: 'timestamp', nullable: true })
  logoutTime!: Date | null;

  @CreateDateColumn({ name: 'login_time', default: () => 'CURRENT_TIMESTAMP' })
  loginTime!: Date;
}
