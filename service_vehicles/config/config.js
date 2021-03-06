const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
    .keys({
        PORT: Joi.number().default(3000),
        MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    })
    .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
    throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
    port: envVars.SERVICE_VEHICLES_PORT,
    // port: envVars.PORT,
    mongoose: {
        url: envVars.MONGODB_URL,
        options: {
            // useCreateIndex: true,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        },
    },
    headerApiKey: envVars.HEADER_API_KEY,
    usersService: {
        auth: `http://localhost:${envVars.SERVICE_USERS_PORT}/users/check-auth`,
        admin: `http://localhost:${envVars.SERVICE_USERS_PORT}/users/check-admin`,
    }
};
