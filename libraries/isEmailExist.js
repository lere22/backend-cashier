import user from "../models/User.js";

const isEmailExist = async (email) => {
	const User = await user.findOne({ email });
	if (!User) {
		return false;
	}
	return true;
};

export default isEmailExist;
