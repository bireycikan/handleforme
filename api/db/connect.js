module.exports = function (uri, mongoose) {
  try {
    const connection = mongoose.createConnection(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    require("../models")(connection);

    return connection;
  } catch (err) {
    console.log('Something failed while connecting to db: ', err);
  }

}