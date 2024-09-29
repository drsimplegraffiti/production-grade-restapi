import Joi from "joi";

const registerUserSchema = Joi.object({
  name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().email().required(),
  profilePic: Joi.string(),
});

const loginUserSchema = Joi.object({
  password: Joi.string().required(),
  email: Joi.string().email().required(),
});

export { registerUserSchema, loginUserSchema };
