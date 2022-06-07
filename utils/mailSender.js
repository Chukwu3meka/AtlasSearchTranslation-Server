const nodemailer = require("nodemailer");

const mailTransporter = nodemailer.createTransport({
  service: "zoho",
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailSender = async ({ to, subject, html }) =>
  await mailTransporter.sendMail(
    {
      from: process.env.EMAIL_ADDRESS,
      to,
      subject,
      html: `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Email Verification!!!</title>
        </head>
        <body>
${html}
        <hr/>
        OpenTranslation  
      </body>
    </html>

      `,
    },

    (err, data) => {
      if (err) throw "error sending mail";
      if (data) return true;

      if (process.env.NODE_ENV !== "production") console.log("nodemailer res", { err, data });
    }
  );

exports.default = mailSender;
