/**
 * RAG Service - Retrieval-Augmented Generation
 * Simple utility functions for the RAG service
 */

/**
 * Calculates the sum of an array of numbers
 * @param numbers - Array of numbers to sum
 * @returns The sum of all numbers in the array
 */
export function sum(numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

/**
 * Calculates the sum of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns The sum of a and b
 */
export function add(a: number, b: number): number {
  return a + b;
}

/**
 * Calculates the sum of multiple numbers
 * @param numbers - Variable number of numbers to sum
 * @returns The sum of all provided numbers
 */
export function sumMultiple(...numbers: number[]): number {
  return numbers.reduce((acc, num) => acc + num, 0);
}

// Example usage
console.log('Sum of [1, 2, 3, 4, 5]:', sum([1, 2, 3, 4, 5])); // 15
console.log('Add 10 + 20:', add(10, 20)); // 30
console.log('Sum multiple: 1 + 2 + 3 + 4:', sumMultiple(1, 2, 3, 4)); // 10
