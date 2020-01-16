const models = require('../models')
const { Project, UserProject } = models

const projectService = {
  findAll: () => {
    return Project.findAll()
  },
  findByUser: (userId) => {
    return UserProject.findAll({ where: { userId }})
      .then(userProjects => {
        return [...userProjects].map(userProject => {
          return Project.findByPk(userProject.projectId)
        })
      })
      .then(promises => Promise.all(promises))
  }
}

module.exports = projectService