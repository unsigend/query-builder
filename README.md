# fluent-query-builder

> A type-safe, DB-agnostic query builder for TypeScript, inspired by LINQ in C# with Entity Framework.

[![npm version](https://img.shields.io/npm/v/fluent-query-builder.svg)](https://www.npmjs.com/package/fluent-query-builder)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Overview

`fluent-query-builder` provides a fluent, type-safe API for building database queries that works across different database providers. The core query builder is database-agnostic, while provider-specific translators convert queries to the appropriate format (e.g., Prisma, TypeORM, Mongoose).

### Key Features

- **Type-safe**: Built with TypeScript for full type safety
- **DB-agnostic**: Core query builder works with any database provider
- **Fluent API**: Chainable methods for intuitive query construction
- **Provider support**: Extensible architecture for multiple database providers
- **Immutable**: All operations return new instances, ensuring predictable behavior

## Installation

```bash
npm install fluent-query-builder
```

**Prerequisites**: TypeScript 5.0+ and Node.js 18+

## Quick Start

```typescript
import { QueryBuilder, ConditionOperator, SortDirection } from "fluent-query-builder";
import { PrismaTranslator } from "fluent-query-builder";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Build a query
const query = QueryBuilder.create()
  .where("name", ConditionOperator.EQ, "John")
  .where("age", ConditionOperator.GTE, 18)
  .sortBy("createdAt", SortDirection.DESC)
  .paginate(1, 10)
  .include("posts");

// Translate to Prisma format
const prismaQuery = PrismaTranslator.translate(query);

// Execute with Prisma
const users = await prisma.user.findMany(prismaQuery);
```

## Usage Guide

### Basic Filtering with `where()`

The `where()` method is the simplest way to add filter conditions. Each call adds an AND condition.

```typescript
import { QueryBuilder, ConditionOperator } from "fluent-query-builder";

// Simple equality check
const query1 = QueryBuilder.create().where("email", ConditionOperator.EQ, "user@example.com");

// Multiple conditions (AND by default)
const query2 = QueryBuilder.create()
  .where("status", ConditionOperator.EQ, "active")
  .where("age", ConditionOperator.GTE, 18);

// Using different operators
const query3 = QueryBuilder.create()
  .where("name", ConditionOperator.LIKE, "John%")
  .where("age", ConditionOperator.IN, [18, 19, 20])
  .where("deletedAt", ConditionOperator.IS_NULL);
```

### Complex Filtering with `filter()`

Use `filter()` for complex nested conditions with explicit logical operators (AND, OR, NOT).

```typescript
import { QueryBuilder, ConditionOperator, LogicalOperator } from "fluent-query-builder";

// OR condition
const query1 = QueryBuilder.create().filter({
  operator: LogicalOperator.OR,
  conditions: [
    { field: "status", operator: ConditionOperator.EQ, value: "active" },
    { field: "status", operator: ConditionOperator.EQ, value: "pending" },
  ],
});

// Nested conditions
const query2 = QueryBuilder.create().filter({
  operator: LogicalOperator.AND,
  conditions: [
    { field: "status", operator: ConditionOperator.EQ, value: "active" },
    {
      operator: LogicalOperator.OR,
      conditions: [
        { field: "role", operator: ConditionOperator.EQ, value: "admin" },
        { field: "role", operator: ConditionOperator.EQ, value: "moderator" },
      ],
    },
  ],
});
```

### Sorting

Add one or more sort orders to your query.

```typescript
import { QueryBuilder, SortDirection } from "fluent-query-builder";

// Single sort
const query1 = QueryBuilder.create().sortBy("createdAt", SortDirection.DESC);

// Multiple sorts
const query2 = QueryBuilder.create()
  .sortBy("name", SortDirection.ASC)
  .sortBy("createdAt", SortDirection.DESC);
```

### Pagination

Control the number of results and which page to return.

```typescript
import { QueryBuilder } from "fluent-query-builder";

// Page 1, 10 items per page (default)
const query1 = QueryBuilder.create();

// Page 2, 20 items per page
const query2 = QueryBuilder.create().paginate(2, 20);
```

### Including Relations

Include related data in your query results.

```typescript
import { QueryBuilder } from "fluent-query-builder";

const query = QueryBuilder.create().include("posts").include("profile").include("comments");
```

### Complete Example with Prisma

```typescript
import { QueryBuilder, ConditionOperator, SortDirection } from "fluent-query-builder";
import { PrismaTranslator } from "fluent-query-builder";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getActiveUsers() {
  // Build the query
  const query = QueryBuilder.create()
    .where("status", ConditionOperator.EQ, "active")
    .where("age", ConditionOperator.GTE, 18)
    .sortBy("createdAt", SortDirection.DESC)
    .paginate(1, 10)
    .include("posts")
    .include("profile");

  // Translate to Prisma format
  const prismaQuery = PrismaTranslator.translate(query);

  // Execute the query
  return await prisma.user.findMany(prismaQuery);
}
```

## API Reference

### QueryBuilder

The main class for building queries. All methods return a new `QueryBuilder` instance.

#### `QueryBuilder.create(): QueryBuilder`

Creates a new `QueryBuilder` instance with default pagination (page: 1, limit: 10).

```typescript
const query = QueryBuilder.create();
```

#### `where(field: string, operator: ConditionOperator, value: unknown): QueryBuilder`

Adds a simple filter condition. Multiple `where()` calls are combined with AND.

```typescript
query.where("email", ConditionOperator.EQ, "user@example.com");
```

#### `filter(filter: Filter | FilterGroup): QueryBuilder`

Adds a filter or filter group for complex nested conditions with explicit logical operators.

```typescript
query.filter({
  operator: LogicalOperator.AND,
  conditions: [
    { field: "status", operator: ConditionOperator.EQ, value: "active" },
    { field: "age", operator: ConditionOperator.GTE, value: 18 },
  ],
});
```

#### `sortBy(field: string, direction: SortDirection): QueryBuilder`

Adds a sort order. Can be called multiple times for multi-field sorting.

```typescript
query.sortBy("name", SortDirection.ASC);
```

#### `include(include: Include): QueryBuilder`

Adds a relation to include. Can be called multiple times.

```typescript
query.include("posts");
```

#### `paginate(page: number, limit: number): QueryBuilder`

Sets pagination parameters. Throws an error if page < 1 or limit is not between 1 and 1000.

```typescript
query.paginate(2, 20);
```

#### Getters

- `getFilters(): (Filter | FilterGroup)[]` - Returns all filters
- `getSorts(): Sort[]` - Returns all sort orders
- `getIncludes(): Include[]` - Returns all includes
- `getPagination(): Pagination` - Returns pagination settings
- `getOffset(): number` - Returns calculated offset for pagination
- `getLimit(): number` - Returns the limit value

### Condition Operators

The `ConditionOperator` enum provides the following operators:

- `EQ` - Equals
- `NE` - Not equals
- `GT` - Greater than
- `GTE` - Greater than or equal
- `LT` - Less than
- `LTE` - Less than or equal
- `IN` - In array
- `NOT_IN` - Not in array
- `LIKE` - Pattern match (case-sensitive)
- `ILIKE` - Pattern match (case-insensitive)
- `BETWEEN` - Between two values (array of 2 elements)
- `IS_NULL` - Is null
- `IS_NOT_NULL` - Is not null

### Logical Operators

The `LogicalOperator` enum provides:

- `AND` - Logical AND
- `OR` - Logical OR
- `NOT` - Logical NOT

### Sort Direction

The `SortDirection` enum provides:

- `ASC` - Ascending
- `DESC` - Descending

### Types

- `Filter` - Single filter condition
- `FilterGroup` - Group of filters with logical operator
- `Sort` - Sort configuration
- `Include` - Relation name (string)
- `Pagination` - Pagination configuration
- `PaginatedResult<T>` - Paginated result with metadata

### PrismaTranslator

Translates `QueryBuilder` instances to Prisma query clauses.

#### `translate(query: QueryBuilder): PrismaQueryClauses`

Translates a complete query builder to Prisma query clauses.

```typescript
const prismaQuery = PrismaTranslator.translate(query);
// Returns: { where, orderBy, include, skip, take }
```

#### Individual Translators

- `translateWhere(filters: (Filter | FilterGroup)[]): GenericPrismaWhere`
- `translateOrderBy(sorts: Sort[]): GenericPrismaOrderBy`
- `translateInclude(includes: Include[]): GenericPrismaInclude`

## Supported Database Providers

### Prisma

Full support for Prisma ORM. Use `PrismaTranslator` to convert queries to Prisma format.

```typescript
import { QueryBuilder, ConditionOperator } from "fluent-query-builder";
import { PrismaTranslator } from "fluent-query-builder";

const query = QueryBuilder.create().where("status", ConditionOperator.EQ, "active").paginate(1, 10);

const prismaQuery = PrismaTranslator.translate(query);
const results = await prisma.user.findMany(prismaQuery);
```

### Coming Soon

- TypeORM
- Mongoose

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
