export interface IUser {
  name: string;
  email: string;
  password: string;
  profilePic?: string;
}

export interface IUserLogin {
  email: string;
  password: string;
}

