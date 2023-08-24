import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { Folder } from "./folder.entity";

@Entity()
export class File {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.id, { eager: false })
  user!: User;

  @ManyToOne(() => Folder, (folder) => folder.id, { nullable: true })
  folder!: Folder;

  @Column()
  name!: string;

  @Column()
  size!: number;

  @Column()
  mime_type!: string;

  @Column()
  filename!: string;

  @Column({ default: false })
  unsafe!: boolean;

  @CreateDateColumn()
  uploaded_at!: Date;
}
