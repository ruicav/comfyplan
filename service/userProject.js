const models = require('../models')
const { UserProject } = models

userProjectService = {
  groupHoursWithProjects: (timekeepers, userId) => {
    const query = userId ? { where: { userId }} : {}
    const reduced = [...timekeepers].reduce(
      (acc, current) =>  acc.concat(current),
      []
    )
    return UserProject.findAll(query)
      .then(userProjects => {
        const grouped = [...userProjects].map(uP => {
          const hours = reduced.filter(tK => uP.id===tK.userProjectId)
            .reduce((acc, current) => {
              return acc + current.workingTime
            }, 0)
          return { project: uP.projectId, hours }
        })
        return grouped
      })
  },
  findIdWithUserAndProject: ({ projectId, userId }) => {
    return UserProject.findAll({ where: { projectId, userId }})
      .then(userProjects => {
        return userProjects[0].id
      })
  }
}

module.exports = userProjectService