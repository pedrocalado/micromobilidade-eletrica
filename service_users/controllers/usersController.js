const { User } = require('../models');

const listUsers = async (req, res) => {
    res.send("Lista de utilizadores")
}

const createUser = async (req, res) => {

    const { name, email, password, birth_date, gender, role } = req.body;

    try {
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
    updateUser
}