import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';
import crypto from 'node:crypto';

export class CustomNamingStrategy
  extends DefaultNamingStrategy
  implements NamingStrategyInterface
{
  primaryKeyName(tableOrName: Table | string, columnNames: string[]) {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const columnsSnakeCase = columnNames.join('_');

    return `PK_${table}_${columnsSnakeCase}`;
  }
  /*
      relationConstraintName(tableOrName, columnNames, where) {
        // sort incoming column names to avoid issue when ["id", "name"] and ["name", "id"] arrays
        const clonedColumnNames = [...columnNames];
        clonedColumnNames.sort();
        const tableName = this.getTableName(tableOrName);
        const replacedTableName = tableName.replace(".", "_");
        let key = `${replacedTableName}_${clonedColumnNames.join("_")}`;
        if (where)
            key += `_${where}`;
        return "REL_" + RandomGenerator_1.RandomGenerator.sha1(key).substr(0, 26);

  foreignKeyName(
    tableOrName: string | Table,
    columnNames: string[],
    referencedTablePath?: string,
    referencedColumnNames?: string[],
  ): string {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const columnsSnakeCase = columnNames.join('_');

    const name = columnNames.reduce(
      (name, column) => `${name}_${column}`,
      `${table}_${referencedTablePath}`,
    );

    const a: string[] = [];
    if (referencedTablePath) {
      a.push(referencedTablePath);
    }
    if (referencedColumnNames) {
      a.push(...referencedColumnNames);
    }

    const referenced = a.length
      ? a.join('_')
      : crypto.createHash('md5').update(name).digest('hex');
    return `FK_${table}_${columnsSnakeCase}__${referenced}`;
  }
  */
}
