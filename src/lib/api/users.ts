import axios from "axios";
import { AuthorizeUser } from "../types/Employees";

export const getAuthorizeUsers = async (): Promise<AuthorizeUser[]> => {
  try {
    const res = await axios.get("/api/authorize");
    return res.data.authorizedUsers;
  } catch (error) {
    throw new Error(`Unable to fetch users : ${error}`);
  }
};

export const addAuthorizeUser = async (user: Partial<AuthorizeUser>) => {
  try {
    const response = await axios.post("/api/authorize", user);
    return response.data;
  } catch (e) {
    throw new Error(`Unable to authorize user  : ${e}`);
  }
};

export const deleteAuthorizeUser = async (id: string) => {
  try {
    const response = await axios.delete(`/api/authorize/${id}`);
    return response.data;
  } catch (e) {
    throw new Error(`Unable to delete user  : ${e}`);
  }
};
