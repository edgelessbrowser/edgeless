export enum Status {
  Pending = "Pending",
  Completed = "Completed",
  Failed = "Failed",
}

export function greet(name: string): string {
  return `Hello, ${name}!`;
}
