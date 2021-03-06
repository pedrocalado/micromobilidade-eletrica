const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
        JWT_SECRET: Joi.string().required().description('JWT secret key'),
        JWT_ACCESS_EXPIRATION_SECONDS: Joi.number().default(3600).description('seconds after which access tokens expire'),
        SERVICE_GENDER_AGE_HOST: Joi.string(),
        SERVICE_GENDER_AGE_PORT: Joi.number(),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    port: envVars.SERVICE_USERS_PORT,
    // port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL,
        options: {
            // useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    genderAge: {
        url: `http://${envVars.SERVICE_GENDER_AGE_HOST}:${envVars.SERVICE_GENDER_AGE_PORT}/api/predict`
    },
    jwt: {
        secret: envVars.JWT_SECRET,
        expiresIn: envVars.JWT_ACCESS_EXPIRATION_SECONDS,
    },
    headerApiKey: envVars.HEADER_API_KEY,
};
