import { UserData } from "@shared/interfaces/userData.interface";

export interface UserResData extends UserData {
  userId: string,
  token: string,
  message: string
}