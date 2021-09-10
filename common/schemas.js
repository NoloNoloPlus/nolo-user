import Joi from "joi"

const login = Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
    remember: Joi.boolean()
})

const signup = Joi.object().keys({
    name: Joi.string(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required()
})

export default {
    login,
    signup
}