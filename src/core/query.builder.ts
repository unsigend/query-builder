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

import { Filter, FilterGroup } from "./types/filter/filter.types";
import { Include } from "./types/include/include.types";
import { Sort, SortDirection } from "./types/sort/sort.types";
import { ConditionOperator } from "./types/filter/filter-operator.type";
import { Pagination } from "./types/pagination/pagination.types";

/**
 * Query config meta interface
 * @description This interface defines the meta information for a query.
 * @note This interface is used to define the meta information for a query.
 */
interface QueryConfigMeta {
  /* The filters to apply to the query */
  filters: (Filter | FilterGroup)[];
  /* The sorts to apply to the query */
  sorts: Sort[];
  /* The includes to apply to the query */
  includes: Include[];
  /* The pagination to apply to the query */
  pagination: Pagination;
}

/**
 * Query Builder class
 * @description This class is used to build a query.
 */
export class QueryBuilder {
  /* The meta information for the query */
  private readonly _meta: QueryConfigMeta;

  /* The default page number */
  private static readonly _DEFAULT_PAGE = 1;
  /* The default limit number */
  private static readonly _DEFAULT_LIMIT = 10;
  /* The maximum limit number */
  private static readonly _MAX_LIMIT = 1000;

  /**
   * Constructor
   * @description This constructor is used to create a new QueryBuilder instance.
   * @param meta The meta information for the query.
   */
  private constructor(meta: QueryConfigMeta) {
    this._meta = meta;
  }

  /**
   * Create a new QueryBuilder instance
   * @description This method is used to create a new QueryBuilder instance.
   * @returns A new QueryBuilder instance.
   */
  public static create(): QueryBuilder {
    return new QueryBuilder({
      filters: [],
      sorts: [],
      includes: [],
      pagination: {
        page: this._DEFAULT_PAGE,
        limit: this._DEFAULT_LIMIT,
      },
    });
  }

  /**
   * Add a filter to the query
   * @description This method is used to add a filter to the query.
   * @param filter The filter to add to the query.
   * @returns A new QueryBuilder instance.
   */
  public filter(filter: Filter | FilterGroup): QueryBuilder {
    return new QueryBuilder({
      ...this._meta,
      filters: [...this._meta.filters, filter],
    });
  }

  /**
   * Add a where filter to the query
   * @description This method is used to add a where filter to the query.
   * @param field The field to filter on.
   * @param operator The operator to use for the filter.
   * @param value The value to filter on.
   * @returns A new QueryBuilder instance.
   */
  public where(field: string, operator: ConditionOperator, value: unknown): QueryBuilder {
    return this.filter({
      field,
      operator,
      value,
    });
  }

  /**
   * Add a sort to the query
   * @description This method is used to add a sort to the query.
   * @param field The field to sort on.
   * @param direction The direction to sort on.
   * @returns A new QueryBuilder instance.
   */
  public sortBy(field: string, direction: SortDirection): QueryBuilder {
    return new QueryBuilder({
      ...this._meta,
      sorts: [...this._meta.sorts, { field, direction }],
    });
  }

  /**
   * Add an include to the query
   * @description This method is used to add an include to the query.
   * @param include The include to add to the query.
   * @returns A new QueryBuilder instance.
   */
  public include(include: Include): QueryBuilder {
    return new QueryBuilder({
      ...this._meta,
      includes: [...this._meta.includes, include],
    });
  }

  /**
   * Add pagination to the query
   * @description This method is used to add pagination to the query.
   * @param page The page number to paginate to.
   * @param limit The number of items to return per page.
   * @returns A new QueryBuilder instance.
   */
  public paginate(page: number, limit: number): QueryBuilder {
    if (page < 1) {
      throw new Error("Page must be >= 1");
    }
    if (limit < 1 || limit > QueryBuilder._MAX_LIMIT) {
      throw new Error(`Limit must be between 1 and ${QueryBuilder._MAX_LIMIT}`);
    }
    return new QueryBuilder({
      ...this._meta,
      pagination: { page, limit },
    });
  }

  /**
   * Get the filters for the query
   * @description This method is used to get the filters for the query.
   * @returns The filters for the query.
   */
  public getFilters(): (Filter | FilterGroup)[] {
    return [...this._meta.filters];
  }

  /**
   * Get the sorts for the query
   * @description This method is used to get the sorts for the query.
   * @returns The sorts for the query.
   */
  public getSorts(): Sort[] {
    return [...this._meta.sorts];
  }

  /**
   * Get the includes for the query
   * @description This method is used to get the includes for the query.
   * @returns The includes for the query.
   */
  public getIncludes(): Include[] {
    return [...this._meta.includes];
  }

  /**
   * Get the pagination for the query
   * @description This method is used to get the pagination for the query.
   * @returns The pagination for the query.
   */
  public getPagination(): Pagination {
    return { ...this._meta.pagination };
  }

  /**
   * Get the offset for the query
   * @description This method is used to get the offset for the query.
   * @returns The offset for the query.
   */
  public getOffset(): number {
    return (this._meta.pagination.page - 1) * this._meta.pagination.limit;
  }

  /**
   * Get the limit for the query
   * @description This method is used to get the limit for the query.
   * @returns The limit for the query.
   */
  public getLimit(): number {
    return this._meta.pagination.limit;
  }
}
