import { minLength, required, SchemaPath, SchemaPathTree, pattern } from '@angular/forms/signals';

export interface INeoncorn {
  callsign: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerm: boolean;
}

export const PASSWORD_RULES = [
  {
    label: 'Uppercase letter',
    regex: /[A-Z]/,
    message: 'Include at least one uppercase letter.',
  },
  {
    label: 'Lowercase letter',
    regex: /[a-z]/,
    message: 'Include at least one lowercase letter.',
  },
  { label: 'Number', regex: /\d/, message: 'Include at least one number.' },
  {
    label: 'Symbol',
    regex: /[^A-Za-z0-9\s]/,
    message: 'Include at least one symbol.',
  },
] as const;

/**
 * TFieldPaths
 */
type TFieldPaths<T extends object> = {
  [K in keyof T & string]: SchemaPath<T[K]>;
};

/**
 * requiredValidation
 * @param schemaPath SchemaPathTree<T>
 * @param fields readonly (keyof T & string)[]
 */
export function requiredValidation<T extends object>(
  schemaPath: SchemaPathTree<T>,
  fields: readonly (keyof T & string)[],
): void {
  const path = schemaPath as TFieldPaths<T>;
  fields.forEach((field) => required(path[field], { message: "Can't be blank" }));
}

/**
 * minLengthValidation
 * @param path SchemaPath<string>
 * @param length number
 */
export function minLengthValidation(path: SchemaPath<string>, length: number): void {
  minLength(path, length, { message: `Min. ${length} Characters!` });
}

/**
 * patternValidation
 * @param path SchemaPath<string>
 * @param regex RegExp
 * @param message string
 */
export function patternValidation(path: SchemaPath<string>, regex: RegExp, message: string): void {
  pattern(path, regex, { message });
}
