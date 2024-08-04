export interface User {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  color: string;

  [key: string]: unknown;
}
