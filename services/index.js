import User from "../daos/mongo/classes/user.dao.js";
import UsersRepository from "../repositories/user.repository.js";

export const usersService = new UsersRepository(new User());