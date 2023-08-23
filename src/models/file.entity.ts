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
  id: number | undefined;

  @ManyToOne(() => User, (user) => user.id)
  user: User | undefined;

  @ManyToOne(() => Folder, (folder) => folder.id, { nullable: true })
  folder: Folder | undefined;

  @Column()
  name!: string;

  @Column()
  size!: number;

  @Column()
  mime_type!: string;

  @Column({ default: false })
  unsafe!: boolean;

  @CreateDateColumn()
  uploaded_at: Date | undefined;
}
