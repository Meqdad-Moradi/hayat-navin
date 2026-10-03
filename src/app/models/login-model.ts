export interface LoginModel {
  email: string;
  password: string;
}

/**
 * initLoginModel
 * @description Initializes a new instance of the LoginModel with default values.
 * @returns LoginModel
 */
export function initLoginModel(): LoginModel {
  return {
    email: '',
    password: '',
  };
}
