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

/**
 * Sort direction type for query sort
 * @description These directions define how to sort the results of a query.
 */
export enum SortDirection {
  /* Ascending: Sorts in ascending order */
  ASC = "ASC",
  /* Descending: Sorts in descending order */
  DESC = "DESC",
}

/**
 * Sort object interface
 * @description This interface defines the sort order for a query.
 * @example
 * ```ts
 * const sort: Sort = {
 *   field: "name",
 *   direction: SortDirection.ASC,
 * };
 * ```
 */
export interface Sort {
  /* The field name to sort on */
  field: string;
  /* The direction to sort on */
  direction: SortDirection;
}
