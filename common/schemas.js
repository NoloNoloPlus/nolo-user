import Joi from "joi"

const login = Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required().label('Email'),
    password: Joi.string().required().label('Password'),
})

const paymentPreferences = Joi.array().items(Joi.string().valid(
    'barter',
  )).unique()

const password = (value, helpers) => {
    if (value.length < 8) {
        return helpers.message('Password must be at least 8 characters');
    }
    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
        return helpers.message('Password must contain at least 1 letter and 1 number');
    }
    return value;
};

const user = (creation, additionalFields) => {
    const streetSchema = {
        line1: Joi.string().allow('').label('Line 1'),
        line2: Joi.string().allow('').label('Line 2'),
    }
  
    const addressSchema = {
        street: Joi.object().keys(streetSchema).label('Street'),
        city: Joi.string().allow('').label('City'),
        state: Joi.string().allow('').label('State'),
        zip: Joi.string().allow('').label('ZIP'),
        country: Joi.string().allow('').label('Country')
    }
  
    const schema = {
        firstName: Joi.string().label('First Name'),
        lastName: Joi.string().label('Last Name'),
        email: Joi.string().email({ tlds: { allow: false } }).label('Email'),
        company: Joi.string().allow('').label('Company'),
        address: Joi.object().keys(addressSchema).label('Address'),
        avatarUrl: Joi.string().allow('').label('Avatar URL'),
        paymentPreferences: paymentPreferences.label('Payment Preferences'),
    };

    if (creation) {
        schema.firstName = schema.firstName.required();
        schema.lastName = schema.lastName.required();
        schema.email = schema.email.required();
        schema.password = Joi.string().custom(password).required().label('Password');
        schema.confirmPassword = Joi.string().valid(Joi.ref('password')).required().messages(
            {
                'any.only': 'Passwords must match',
                'string.empty': 'Passwords must match'
            }
        );
    }
  
    return Joi.object().keys({ ...schema, ...additionalFields });
}

const signup = user(true, {})
const editUser = user(false, {})

export default {
    login,
    editUser,
    signup
}