export interface User {
  id: string;
  full_name: string;
  email: string;
  role?: string;
  phone_number?: string;
  avatar_url?: string;
  avatar_key?: String
}

export interface UpdateProfilePayload {
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
  avatar_key?: string;
}
