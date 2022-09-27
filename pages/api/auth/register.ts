import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../utils/connectMongo";
import User from "../../../models/user";
import { parseCookies } from "nookies";
const bcrypt = require("bcrypt");
interface newUser {}
export default async function register(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	console.log("working");
	try {
		await connectMongo();
		console.log("connected to Mongo");
		const hashPsw = await bcrypt
			.hash(req.body.data.password, 12)
			.then((hashedPassword: string) => {
				return hashedPassword;
			});
		const newUser = {
			username: req.body.data.username,
			email: req.body.data.email,
			password: hashPsw,
		};
		const checkEmail = await User.findOne({ email: req.body.data.email });
		if (checkEmail) return res.json("exsist");
		const auth = await User.create(newUser);
		console.log(auth);
		
		res.json(auth);
	} catch (error) {
		res.json({ error });
	}
}
