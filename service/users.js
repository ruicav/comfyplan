const bcrypt = require('bcrypt')

const db = require('../models')
const { User } = db

const authService = require('./auth')

const userService = {
  findAll: () => User.findAll({ include: ['projects'] }),
  authenticate: ({ email, password }) => {
    return User.scope('withPassword').findOne({ where: {email}, include: ['projects'] })
      .then(user => {
        return user && bcrypt.compareSync(password, user.password)
          ? authService.generateToken(user)
          : null
      })
  },
  findById: (id) => User.findByPk(id, { include: ['projects'] })
}

module.exports = userService