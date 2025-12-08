/**
 * MIT License
 *
 * Copyright (c) 2025 Yixiang Qiu
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { Sort } from "../../core/types/sort/sort.types";
import { Include } from "../../core/types/include/include.types";
import { ConditionOperator, LogicalOperator } from "../../core/types/filter/filter-operator.type";
import { Filter, FilterGroup } from "../../core/types/filter/filter.types";
import { QueryBuilder } from "../../core/query.builder";

/**
 * Prisma query clauses interface
 * @description This interface defines the query clauses for Prisma.
 * @example
 * ```ts
 * const queryClauses: PrismaQueryClauses = {
 *   where: { name: "John" },
 *   orderBy: { name: "asc" },
 *   skip: 10,
 *   take: 10,
 *   include: { posts: true },
 * };
 * ```
 */
export interface PrismaQueryClauses {
  /* The where clause for the query */
  where?: GenericPrismaWhere;
  /* The order by clause for the query */
  orderBy?: GenericPrismaOrderBy;
  /* The skip clause for the query */
  skip?: GenericPrismaSkip;
  /* The take clause for the query */
  take?: GenericPrismaTake;
  /* The include clause for the query */
  include?: GenericPrismaInclude;
}

/**
 * Generic Prisma order by type
 * @description This type defines the order by clause for a Prisma query.
 */
export type GenericPrismaOrderBy = Record<string, any> | Array<Record<string, any>>;

/**
 * Generic Prisma where type
 * @description This type defines the where clause for a Prisma query.
 */
export type GenericPrismaWhere = Record<string, any>;

/**
 * Generic Prisma skip type
 * @description This type defines the skip clause for a Prisma query.
 */
export type GenericPrismaSkip = number;

/**
 * Generic Prisma take type
 * @description This type defines the take clause for a Prisma query.
 */
export type GenericPrismaTake = number;

/**
 * Generic Prisma include type
 * @description This type defines the include clause for a Prisma query.
 */
export type GenericPrismaInclude = Record<string, any>;

/**
 * Prisma translator class
 * @description This class is used to translate the query builder to a Prisma query group.
 */
export class PrismaTranslator {
  /**
   * Translate the order by clause for the query
   * @description This method is used to translate the order by clause for the query.
   * @param sorts The sorts to translate.
   * @returns The translated order by clause.
   */
  public static translateOrderBy(sorts: Sort[]): GenericPrismaOrderBy {
    if (sorts.length === 0) {
      return {} as GenericPrismaOrderBy;
    }

    // single sort
    if (sorts.length === 1) {
      return {
        [sorts[0]!.field]: sorts[0]!.direction.toLowerCase(),
      } as GenericPrismaOrderBy;
    }

    // multiple sorts
    return sorts.map((sort) => ({
      [sort.field]: sort.direction.toLowerCase(),
    })) as GenericPrismaOrderBy;
  }

  /**
   * Translate the include clause for the query
   * @description This method is used to translate the include clause for the query.
   * @param includes The includes to translate.
   * @returns The translated include clause.
   */
  public static translateInclude(includes: Include[]): GenericPrismaInclude {
    const result: GenericPrismaInclude = {};

    includes.forEach((include) => {
      result[include] = true;
    });

    return result as GenericPrismaInclude;
  }

  /**
   * Translate the operator for the query
   * @description This method is used to translate the operator for the query.
   * @param operator The operator to translate.
   * @param value The value to translate.
   * @returns The translated operator.
   */
  private static _translateOperator(operator: ConditionOperator, value: unknown): any {
    switch (operator) {
      case ConditionOperator.EQ:
        return { equals: value };
      case ConditionOperator.NE:
        return { not: value };
      case ConditionOperator.GT:
        return { gt: value };
      case ConditionOperator.GTE:
        return { gte: value };
      case ConditionOperator.LT:
        return { lt: value };
      case ConditionOperator.LTE:
        return { lte: value };
      case ConditionOperator.IN:
        return { in: value };
      case ConditionOperator.NOT_IN:
        return { notIn: value };
      case ConditionOperator.LIKE:
        return { contains: value, mode: "default" };
      case ConditionOperator.ILIKE:
        return { contains: value, mode: "insensitive" };
      case ConditionOperator.BETWEEN:
        if (!Array.isArray(value) || value.length !== 2) {
          throw new Error("BETWEEN operator value must be an array of 2 elements");
        }
        return { gte: value[0], lte: value[1] };
      case ConditionOperator.IS_NULL:
        return { equals: null };
      case ConditionOperator.IS_NOT_NULL:
        return { not: null };
      default:
        throw new Error(`Unsupported operator: ${operator}`);
    }
  }

  /**
   * Translate the filter for the query
   * @description This method is used to translate the filter for the query.
   * @param filter The filter to translate.
   * @returns The translated filter.
   */
  private static _translateFilter(filter: Filter): GenericPrismaWhere {
    const prismaWhere: GenericPrismaWhere = this._translateOperator(filter.operator, filter.value);
    return {
      [filter.field]: prismaWhere,
    } as GenericPrismaWhere;
  }

  /**
   * Translate the filter group for the query
   * @description This method is used to translate the filter group for the query.
   * @param filterGroup The filter group to translate.
   * @returns The translated filter group.
   */
  private static _translateFilterGroup(filterGroup: FilterGroup): GenericPrismaWhere {
    const logic =
      filterGroup.operator === LogicalOperator.AND
        ? "AND"
        : filterGroup.operator === LogicalOperator.OR
          ? "OR"
          : "NOT";

    return {
      [logic]: filterGroup.conditions.map((condition) =>
        "conditions" in condition
          ? this._translateFilterGroup(condition as FilterGroup)
          : this._translateFilter(condition as Filter)
      ),
    } as GenericPrismaWhere;
  }

  /**
   * Translate the where clause for the query
   * @description This method is used to translate the where clause for the query.
   * @param filters The filters to translate.
   * @returns The translated where clause.
   */
  public static translateWhere(filters: (Filter | FilterGroup)[]): GenericPrismaWhere {
    if (filters.length === 0) {
      return {} as GenericPrismaWhere;
    }

    if (filters.length === 1) {
      const condition: Filter | FilterGroup = filters[0]!;
      return "conditions" in condition
        ? this._translateFilterGroup(condition as FilterGroup)
        : this._translateFilter(condition as Filter);
    }

    return {
      AND: filters.map((condition) =>
        "conditions" in condition
          ? this._translateFilterGroup(condition as FilterGroup)
          : this._translateFilter(condition as Filter)
      ),
    } as GenericPrismaWhere;
  }

  /**
   * Translate the query to a Prisma query clauses
   * @description This method is used to translate the query to a Prisma query clauses.
   * @param query The query to translate.
   * @returns The translated Prisma query clauses.
   */
  public static translate(query: QueryBuilder): PrismaQueryClauses {
    const result: PrismaQueryClauses = {};

    const filters: (Filter | FilterGroup)[] = query.getFilters();
    if (filters.length > 0) {
      result.where = this.translateWhere(filters);
    }

    const sorts: Sort[] = query.getSorts();
    if (sorts.length > 0) {
      result.orderBy = this.translateOrderBy(sorts);
    }

    const includes: Include[] = query.getIncludes();
    if (includes.length > 0) {
      result.include = this.translateInclude(includes);
    }

    result.skip = query.getOffset();
    result.take = query.getLimit();

    return result;
  }
}
