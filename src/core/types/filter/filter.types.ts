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

import { ConditionOperator, LogicalOperator } from "./filter-operator.type";

/**
 * Filter interface
 * @description This interface defines the condition for a filter operation.
 * @example
 * ```ts
 * const filter: Filter = {
 *   field: "name",
 *   operator: ConditionOperator.EQ,
 *   value: "John",
 * };
 * ```
 */
export interface Filter {
  /* The field name to filter on */
  field: string;

  /* The operator to use for the filter */
  operator: ConditionOperator;

  /* The value to filter on */
  value: unknown;
}

/**
 * Filter group interface
 * @description This interface defines a group of filters that are combined using a logical operator.
 * @note Recursive type support for nested filter groups.
 * @example
 * ```ts
 * const filterGroup: FilterGroup = {
 *   operator: LogicalOperator.AND,
 *   conditions: [
 *     {
 *       field: "name",
 *       operator: ConditionOperator.EQ,
 *       value: "John",
 *     },
 *     {
 *       field: "age",
 *       operator: ConditionOperator.GT,
 *       value: 30,
 *     },
 *   ],
 * };
 * ```
 */
export interface FilterGroup {
  /* The logical operator to use for the nested filter */
  operator: LogicalOperator;

  /* The conditions to filter on */
  conditions: (Filter | FilterGroup)[];
}
