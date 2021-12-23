import Joi from "joi"

const login = Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required(),
    remember: Joi.boolean()
})

const paymentPreferences = Joi.array().items(Joi.string().valid(
    'barter',
  )).unique()

const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('password must contain at least 1 letter and 1 number');
    }
    return value;
};

const user = (creation, additionalFields) => {
    const streetSchema = {
        line1: Joi.string(),
        line2: Joi.string()
    }
  
    const addressSchema = {
        street: Joi.object().keys(streetSchema),
        city: Joi.string(),
        state: Joi.string(),
        zip: Joi.string(),
        country: Joi.string()
    }
  
    const schema = {
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email({ tlds: { allow: false } }),
        password: Joi.string().custom(password),
        company: Joi.string(),
        address: Joi.object().keys(addressSchema),
        avatarUrl: Joi.string(),
        paymentPreferences
    };
  
    if (creation) {
        schema.firstName = schema.firstName.required();
        schema.lastName = schema.lastName.required();
        schema.email = schema.email.required();
        schema.password = schema.password.required();
    }
  
    return Joi.object().keys({ ...schema, ...additionalFields });
}

const signup = user(true, {})

/*const signup = Joi.object().keys({
    firstName: Joi.string(),
    lastName: Joi.string(),
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    password: Joi.string().required()
})*/

export default {
    login,
    signup
}