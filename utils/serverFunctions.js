// catch err in return
module.exports.catchError = ({ res, err, status = 400, message = "Internal Server Error" }) => {
  if (process.env.NODE_ENV !== "production") console.log(`${res.req.originalUrl}: ${err}`);
  res.status(status).json(message);
};
