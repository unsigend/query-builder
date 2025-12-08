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
 * Condition operator type for query condition
 * @description These operators define how to compare field values in a condition.
 */
export enum ConditionOperator {
  /* Equals: Checks if field value equals the provided value */
  EQ = "EQ",
  /* Not Equals: Checks if field value does not equal the provided value */
  NE = "NE",
  /* Greater Than: Checks if field value is greater than the provided value */
  GT = "GT",
  /* Greater Than or Equal: Checks if field value is greater than or equal to the provided value */
  GTE = "GTE",
  /* Less Than: Checks if field value is less than the provided value */
  LT = "LT",
  /* Less Than or Equal: Checks if field value is less than or equal to the provided value */
  LTE = "LTE",
  /* In: Checks if field value is in the provided array */
  IN = "IN",
  /* Not In: Checks if field value is not in the provided array */
  NOT_IN = "NOT_IN",
  /* Like: Checks if field value matches the provided pattern */
  LIKE = "LIKE",
  /* ILIKE: Checks if field value matches the provided pattern case-insensitively */
  ILIKE = "ILIKE",
  /* Between: Checks if field value is between the provided values */
  BETWEEN = "BETWEEN",
  /* Is Null: Checks if field value is null */
  IS_NULL = "IS_NULL",
  /* Is Not Null: Checks if field value is not null */
  IS_NOT_NULL = "IS_NOT_NULL",
}

/**
 * Logical operator type for query condition
 * @description These operators define how to combine multiple filter conditions.
 */
export enum LogicalOperator {
  /* And: Combines multiple filter conditions with a logical AND */
  AND = "AND",
  /* Or: Combines multiple filter conditions with a logical OR */
  OR = "OR",
  /* Not: Negates a filter condition */
  NOT = "NOT",
}
