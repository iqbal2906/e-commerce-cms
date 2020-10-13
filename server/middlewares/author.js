const { Task } = require('../models')

const Authorization = (req, res, next) => {
    const { id } = req.params
    Task.findByPk(id)
        .then(task => {
            if (!task) {
                return res.status(404).json({ message: 'Task not found' })
            } else if (req.userData.id !== task.UserId) {
                return res.status(404).json({ message: 'You are not authorized' })
            } else {
                next()
            }
        })
}

module.exports = {
    Authorization
}