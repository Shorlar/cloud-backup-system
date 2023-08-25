import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class CreateTables1692961652325 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: "email",
            type: "varchar",
            isUnique: true,
            isNullable: false,
          },
          {
            name: "fullName",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "password",
            type: "varchar",
            isNullable: false,
          },
        ],
      })
    );
    await queryRunner.createTable(
      new Table({
        name: "file",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "size",
            type: "int",
            isNullable: false,
          },
          {
            name: "mime_type",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "filename",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "unsafe",
            type: "boolean",
            isNullable: false,
            default: false,
          },
          {
            name: "userId",
            type: "int",
            isNullable: false,
          },
          {
            name: "folderId",
            type: "int",
            isNullable: true,
          },
          {
            name: "uploaded_at",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );
    await queryRunner.createTable(
      new Table({
        name: "folder",
        columns: [
          {
            name: "id",
            type: "int",
            isGenerated: true,
            isPrimary: true,
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
          },
          {
            name: "userId",
            type: "int",
            isNullable: false,
          },
          {
            name: "created_date",
            type: "timestamp",
            default: "now()",
          },
        ],
      })
    );
    await queryRunner.createForeignKey(
      "folder",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
      })
    );
    await queryRunner.createForeignKey(
      "file",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
      })
    );

    await queryRunner.createForeignKey(
      "file",
      new TableForeignKey({
        columnNames: ["folderId"],
        referencedColumnNames: ["id"],
        referencedTableName: "folder",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const fileTable = await queryRunner.getTable("file");
    if (fileTable) {
      const userForeignKey = fileTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("userId") !== 1
      );
      const folderForeignKey = fileTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("folderId") !== 1
      );
      if (userForeignKey && folderForeignKey) {
        await queryRunner.dropForeignKey("file", userForeignKey);
        await queryRunner.dropForeignKey("file", folderForeignKey);
        await queryRunner.dropColumn("file", "userId");
        await queryRunner.dropColumn("file", "folderId");
        await queryRunner.dropTable("file");
      }
    }
    const folderTable = await queryRunner.getTable("folder");
    if (folderTable) {
      const foreignKey = folderTable.foreignKeys.find(
        (fk) => fk.columnNames.indexOf("userId") !== -1
      );
      if (foreignKey) {
        await queryRunner.dropForeignKey("folder", foreignKey);
        await queryRunner.dropColumn("folder", "userId");
        await queryRunner.dropTable("folder");
      }
    }
    await queryRunner.dropTable("user");
  }
}
