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
 * Fluent Query Builder
 * @description A type-safe, DB-agnostic query builder with typescript
 */

// Core Query Builder
export { QueryBuilder } from "./core/query.builder";

// Filter Types
export { ConditionOperator, LogicalOperator } from "./core/types/filter/filter-operator.type";
export type { Filter, FilterGroup } from "./core/types/filter/filter.types";

// Sort Types
export { SortDirection } from "./core/types/sort/sort.types";
export type { Sort } from "./core/types/sort/sort.types";

// Include Types
export type { Include } from "./core/types/include/include.types";

// Pagination Types
export type { Pagination } from "./core/types/pagination/pagination.types";
export type { PaginatedResult } from "./core/types/pagination/pagination-result.types";

// Prisma Provider
export * from "./providers/prisma";
