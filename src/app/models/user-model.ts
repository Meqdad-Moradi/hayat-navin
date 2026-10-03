export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  roles: string[];
  token?: string;
}
