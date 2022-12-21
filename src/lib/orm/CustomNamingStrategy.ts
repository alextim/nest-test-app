import { Table, NamingStrategyInterface } from 'typeorm';
import crypto from 'node:crypto';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

export class CustomNamingStrategy
  extends SnakeNamingStrategy
  implements NamingStrategyInterface
{
  primaryKeyName(tableOrName: Table | string, columnNames: string[]) {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const columnsSnakeCase = columnNames.join('_');

    return `PK_${table}_${columnsSnakeCase}`;
  }

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
}
