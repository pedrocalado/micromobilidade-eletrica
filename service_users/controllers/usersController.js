const { User } = require('../models');
const config = require('../config/config');
const axios = require('axios');
var FormData = require('form-data');
const fs = require('fs')
const path = require('path');
const calculateAge = require('../utils/calculateAge');

const listUsers = async (req, res) => {
    res.send("Lista de utilizadores")
}

const createUser = async (req, res) => {
    const { name, email, password, birth_date, gender, role } = req.body;
    const file = req.file;

    try {
        const date = new Date();
        const today = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
        const userAge = calculateAge(birth_date, today);

        console.log("User age: " + userAge)

        if (userAge < 16) {
            res.status(400).send({
                error: "O registo apenas é válido para utilizadores com idade igual ou superior a 16 anos."
            });
        }

        // Age and gender
        const genderAgeUrl = config.gender_age.url;

        const imagePath = path.join(__dirname + '/..', file.path)
        const image = fs.createReadStream(imagePath)

        let form = new FormData();
        form.append('image', image)

        let predictGender = predictAge = null;

        try {
            genderAge = await axios.post(genderAgeUrl, form, { headers: form.getHeaders() });

            predictGender = genderAge?.data?.gender
            predictAge = genderAge?.data?.age
        } catch (err) {
            res.status(201).send({
                error: "Error validating gender and age."
            });
        }

        console.log("Predict age: " + predictAge)

        if (predictAge < 16) {
            res.status(201).send({
                error: "A fotografia introduzida indica que a idade é inferior a 16 anos."
            });
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

const updateUser = async (req, res) => {
    res.send("Criar utilizador")
}

module.exports = {
    listUsers,
    createUser,
    updateUser,
}