# query-builder

> A type-safe, DB-agnostic query builder for TypeScript, inspired by LINQ in C# with Entity Framework.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

## Overview

`query-builder` provides a fluent, type-safe API for building database queries that works across different database providers. The core query builder is database-agnostic, while provider-specific translators convert queries to the appropriate format (e.g., Prisma, TypeORM, Mongoose).

### Key Features

- **Type-safe**: Built with TypeScript for full type safety
- **DB-agnostic**: Core query builder works with any database provider
- **Fluent API**: Chainable methods for intuitive query construction
- **Provider support**: Extensible architecture for multiple database providers
- **Immutable**: All operations return new instances, ensuring predictable behavior

## Installation

```bash
npm install query-builder
```

**Prerequisites**: TypeScript 5.0+ and Node.js 18+

## Quick Start

```typescript
import { QueryBuilder, ConditionOperator, SortDirection } from "query-builder";
import { PrismaTranslator } from "query-builder";
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

## API Documentation

### QueryBuilder

The main class for building queries. All methods return a new `QueryBuilder` instance.

#### Static Methods

##### `QueryBuilder.create(): QueryBuilder`

Creates a new `QueryBuilder` instance with default pagination (page: 1, limit: 10).

```typescript
const query = QueryBuilder.create();
```

#### Instance Methods

##### `where(field: string, operator: ConditionOperator, value: unknown): QueryBuilder`

Adds a filter condition to the query.

```typescript
query.where("email", ConditionOperator.EQ, "user@example.com");
```

##### `filter(filter: Filter | FilterGroup): QueryBuilder`

Adds a filter or filter group to the query. Useful for complex nested conditions.

```typescript
import { LogicalOperator } from "query-builder";

query.filter({
  operator: LogicalOperator.AND,
  conditions: [
    { field: "status", operator: ConditionOperator.EQ, value: "active" },
    { field: "age", operator: ConditionOperator.GTE, value: 18 }
  ]
});
```

##### `sortBy(field: string, direction: SortDirection): QueryBuilder`

Adds a sort order to the query. Can be called multiple times for multi-field sorting.

```typescript
query.sortBy("name", SortDirection.ASC)
     .sortBy("createdAt", SortDirection.DESC);
```

##### `include(include: Include): QueryBuilder`

Adds a relation to include in the query. Can be called multiple times.

```typescript
query.include("posts").include("comments");
```

##### `paginate(page: number, limit: number): QueryBuilder`

Sets pagination parameters. Throws an error if page < 1 or limit is not between 1 and 1000.

```typescript
query.paginate(2, 20); // Page 2, 20 items per page
```

##### Getters

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
import { PrismaTranslator } from "query-builder";

const query = QueryBuilder.create()
  .where("status", ConditionOperator.EQ, "active")
  .paginate(1, 10);

const prismaQuery = PrismaTranslator.translate(query);
const results = await prisma.user.findMany(prismaQuery);
```

### Coming Soon

- TypeORM
- Mongoose

## Examples

### Basic Filtering

```typescript
const query = QueryBuilder.create()
  .where("email", ConditionOperator.EQ, "user@example.com")
  .where("age", ConditionOperator.GTE, 18);
```

### Complex Filter Groups

```typescript
import { LogicalOperator } from "query-builder";

const query = QueryBuilder.create()
  .filter({
    operator: LogicalOperator.OR,
    conditions: [
      { field: "status", operator: ConditionOperator.EQ, value: "active" },
      { field: "status", operator: ConditionOperator.EQ, value: "pending" }
    ]
  })
  .where("age", ConditionOperator.GTE, 18);
```

### Sorting and Pagination

```typescript
const query = QueryBuilder.create()
  .sortBy("name", SortDirection.ASC)
  .sortBy("createdAt", SortDirection.DESC)
  .paginate(1, 20);
```

### Using with Prisma

```typescript
import { QueryBuilder, ConditionOperator, SortDirection } from "query-builder";
import { PrismaTranslator } from "query-builder";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUsers() {
  const query = QueryBuilder.create()
    .where("status", ConditionOperator.EQ, "active")
    .sortBy("createdAt", SortDirection.DESC)
    .paginate(1, 10)
    .include("posts")
    .include("profile");

  const prismaQuery = PrismaTranslator.translate(query);
  return await prisma.user.findMany(prismaQuery);
}
```

## Contributing

Contributions are welcome! This project follows best practices for TypeScript, DDD, and hexagonal architecture.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style

- Follow TypeScript best practices
- Use ESLint and Prettier (configuration included)
- Write clear JSDoc comments for public APIs
- Add tests for new features

### Adding Database Providers

To add support for a new database provider:

1. Create a new translator class in `src/providers/[provider-name]/`
2. Implement translation methods for filters, sorts, includes, and pagination
3. Export the translator from `src/providers/[provider-name]/index.ts`
4. Update this README with provider documentation

## License

MIT License

Copyright (c) 2025 Yixiang Qiu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
