module.exports = function (connection) {
  const TaskSchema = require('./Task/task');
  const UserSchema = require('./User/user');


  return {
    User: connection.model('User', UserSchema),
    Task: connection.model('Task', TaskSchema),
  }
}