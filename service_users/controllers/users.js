const { User } = require('../models');
const config = require('../config/config');
const axios = require('axios');
var FormData = require('form-data');
const fs = require('fs')
const path = require('path');
const calculateAge = require('../utils/calculateAge');
const jwt = require('jsonwebtoken');

const list = async (req, res) => {
    const users = await User.find({}, {
        _id: true,
        name: true,
        email: true,
        birthDate: true,
        balance: true,
    });

    res.send(users);
}

const create = async (req, res) => {
    const { name, email, password, birth_date, gender, role } = req.body;
    const file = req.file;

    try {
        const date = new Date();
        const today = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        const userAge = calculateAge(birth_date, today);

        if (userAge < 16) {
            res.status(400).send({
                error: "O registo apenas é válido para utilizadores com idade igual ou superior a 16 anos."
            });
        }

        // Age and gender
        const genderAgeUrl = config.genderAge.url;

        const imagePath = path.join(__dirname + '/..', file.path);
        const image = fs.createReadStream(imagePath);

        let form = new FormData();
        form.append('image', image);

        let predictGender = predictAge = null;

        try {
            genderAge = await axios.post(genderAgeUrl, form, { headers: form.getHeaders() });

            predictGender = genderAge?.data?.gender;
            predictAge = genderAge?.data?.age;

            if (predictAge < 16) {
                res.status(201).send({
                    error: "A fotografia introduzida indica que a idade é inferior a 16 anos."
                });
            }
        } catch (err) {
            // return res.status(400).send({
            //     error: "Error validating gender and age."
            // });
        }

        const user = await User.create({
            name,
            email,
            password,
            birthDate: birth_date,
            gender,
            role
        })
        res.status(201).send(user)
    } catch (error) {
        res.status(400).send(error)
    }
}

function generateAccessToken(email) {
    return jwt.sign(email, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !(await user.isPasswordMatch(password))) {
        return res.status(403).send({ error: "Unauthorized" })
    }

    const token = generateAccessToken({ email });
    res.json({
        token,
        expires: config.jwt.expiresIn
    });
}

const checkAuth = (req, res) => {
    const token = req.body.token;

    if (token == null) return res.sendStatus(401);

    jwt.verify(token, config.jwt.secret, (err, user) => {
        console.log(user)
        if (err) {
            return res.json({
                is_authenticated: false
            });
        }

        const nowSeconts = Math.floor(Date.now() / 1000);

        const expiresIn = user.exp - nowSeconts;

        res.json({
            is_authenticated: true,
            expires_in: expiresIn
        })
    })
}

module.exports = {
    list,
    create,
    login,
    checkAuth
}