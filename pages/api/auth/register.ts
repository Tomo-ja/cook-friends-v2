import type { NextApiRequest, NextApiResponse } from "next";
import connectMongo from "../../../utils/connectMongo";
import User from "../../../models/user";

const bcrypt = require("bcrypt");

export default async function register(
	req: NextApiRequest,
	res: NextApiResponse<any>
) {
	try {
		await connectMongo();
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
		if (checkEmail) return res.json("exist");
		const auth = await User.create(newUser);
		
		res.json(auth);
	} catch (error) {
		res.json({ error });
	}
}
