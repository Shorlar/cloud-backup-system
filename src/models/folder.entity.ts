import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { User } from "./user.entity";
import { File } from "./file.entity";

@Entity()
export class Folder {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.id, { eager: false })
  user!: User;

  @Column()
  name!: string;

  @OneToMany(() => File, (file) => file.folder, { eager: true })
  file!: File[]

  @CreateDateColumn({type: "timestamp"})
  created_date!: Date;
}
