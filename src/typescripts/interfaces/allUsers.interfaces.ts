export interface IUserItem {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  gender?: string;
  date_of_birth?: string;
  user_type?: string | null;
  status?: string;
}

export interface IAllUsersRoot {
  success: boolean;
  users: IUserItem[];
}
