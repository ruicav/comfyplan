const models = require('../models')
const { Timekeep } = models

const userService = require('../service/users')

const timekeepService = {
  create: ({ userProjectId, workingDate , workingTime }) => {
    return Timekeep.create({ userProjectId: userProjectId, workingDate: workingDate , workingTime: workingTime })
  },
  findAll: () => Timekeep.findAll(),
  isAbleToCreate: ({ userId, userProjectId }) => {
    return userService.findById(userId)
      .then(user => {
        return [...user.projects].map(p => (p["UserProject"]))
      })
      .then(userProjects => {
        return [...userProjects]
          .filter(userPro => {
            return (userPro.userId === userId && userPro.id === userProjectId)
          }).length > 0
      })
  },
  findByUser: (userId) => {
    return userService.findById(userId)
      .then(user => {
        return [...user.projects].map(p => (p["UserProject"].id))
      })
      .then(userProjectsId => {
        return [...userProjectsId].map(id => {
          return Timekeep.findAll({ where: { userProjectId: id } })
        })
      })
      .then(promises => {
        return Promise.all(promises)
      })
  }
}

module.exports = timekeepService