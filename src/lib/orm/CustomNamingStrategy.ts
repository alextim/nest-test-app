import crypto from 'node:crypto';
import type { NamingStrategyInterface } from 'typeorm';
import { Table } from 'typeorm';
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

  relationConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
    where?: string,
  ) {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const columnsSnakeCase = columnNames.join('_');

    const wherePart = where ? `__${where}` : '';

    return `REL_${table}_${columnsSnakeCase}${wherePart}`;
  }

  uniqueConstraintName(
    tableOrName: Table | string,
    columnNames: string[],
  ): string {
    const table = tableOrName instanceof Table ? tableOrName.name : tableOrName;
    const columnsSnakeCase = columnNames.join('_');

    return `UQ_${table}_${columnsSnakeCase}`;
  }

  /**
   * Ambiguous Columns When Eager Loading Relation with Relation Id Exposed on Entity #4902
   *
   * https://github.com/typeorm/typeorm/issues/4902#issuecomment-542080781
   *
   */
  //public eagerJoinRelationAlias(alias: string, propertyPath: string): string {
  //  return `r_${alias}_${propertyPath.replace('.', '_')}`;
  // }
}
