import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @ManyToOne(() => User, (user) => user.id)
  user: User | undefined;

  @Column()
    name!: string;

  @CreateDateColumn()
  created_date: Date | undefined;
}
