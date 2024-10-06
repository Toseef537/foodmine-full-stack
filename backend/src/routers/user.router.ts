import { Router } from "express";
import jwt from "jsonwebtoken";
import { Sample_Users } from "../data";
import expressAsyncHandler from "express-async-handler";
import { IUser, UserModel } from "../models/user.model";
import { HTTP_BAD_REQUEST, HTTP_GOOD_REQUEST } from "../constants/http_status";
import bcrypt from "bcryptjs"
const router = Router();


router.get('/seed', expressAsyncHandler(
    async (req, res) => {
        const usersCount = await UserModel.countDocuments();
        if (usersCount > 0) {
            res.send("seed is already done")
            return;
        }
        await UserModel.create(Sample_Users);
        res.send("seed is  done")


    })
)
router.post('/signup', expressAsyncHandler(
    async (req, res) => {
        const { name, email, password, address } = req.body;
        const user = await UserModel.findOne({ email });
        if (user) {
            res.status(HTTP_BAD_REQUEST).send('User is already exists, Please login!')
        }
        const encriptedPassword = await bcrypt.hash(password, 10);
        const newUser: IUser = {
            id: '',
            name,
            email: email.toLowerCase(),
            password: encriptedPassword,
            address,
            isAdmin: false
        }
        const dbUser = await UserModel.create(newUser);
        res.send(dbUser);
    }
))

router.post('/login', expressAsyncHandler(
    async (req, res) => {
        const { email, password } = req.body;
        let user = await UserModel.findOne({ email, password })
        if (user) {
            const currentUser = user.toObject();
            res.send(generateWebTokenResponse(currentUser))
        } else {
            res.status(400).send('Username or Password is not valid!')
        }
    }
))

const generateWebTokenResponse = (user: any) => {
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign({
        id:user.id,
        email: user.email,
        isAdmin: user.isAdmin
    }, secretKey!, { expiresIn: '3d' })
    user.token = token;
    return user;

}
export default router;