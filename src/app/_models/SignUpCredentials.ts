/**
 * Represents the credentials required for a user to sign up.
 */
export class SignUpCredentials {
  constructor(username: string, password: string, role?: string, admin_code?: string) {
    this.username = username;
    this.password = password;
    if (role) this.role = role;
    if (admin_code) this.admin_code = admin_code;
    }
    username: string;
    password: string;
    role?: string;
    admin_code?: string;
}
