import { Router } from "express";
import { deleteUser, getUserInfo, signOut, updateUser } from "../controllers/user.controllers.mjs";
import { verifyToken } from "../utils/verifyUser.mjs";
const route = Router();
//user info updating route
route.post('/update-user/:id',verifyToken,updateUser);
//delete user route
route.delete('/delete-user/:id',verifyToken,deleteUser);
//sign-out endpoing
route.get('/sign-out',verifyToken,signOut);
//get user info by id
route.get('/:id',verifyToken,getUserInfo);
export default route;