// catch err in return
module.exports.catchError = ({ res, err, status = 400, message = "Internal Server Error" }) => {
  if (process.env.NODE_ENV === "development") console.log(`${res.req.originalUrl}: ${err || message}`);
  res.status(status).json(message);
};

// verification code
module.exports.verificationGenerator = (len = 256) => {
  let text = "";
  const allowed = "ABCDEFGHIkLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-";
  for (let i = 0; i < len; i++) text += allowed.charAt(Math.floor(Math.random() * allowed.length));

  return text.replace(/\s/g, "");
};
