const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
           user: process.env.EMAIL_ADDRESS,
           pass: process.env.EMAIL_PASSWORD
       }
   });

function Email() {

    this.mailOptions = {
        from: process.env.EMAIL_ADDRESS, // sender address
        to: process.env.EMAIL_ADDRESS, // list of receivers
        subject: '', // Subject line
        html: ''// plain text body
      };

    this.setSubject = (subject) => {
        this.mailOptions.subject = subject;
    }

    this.setBody = (text) => {
        this.mailOptions.html = `<div>${text}</div>`
    }

    this.send = () => {
        transporter.sendMail(this.mailOptions, function (err, info) {
            if(err)
              console.log(err)
            else
              console.log(info);
         });
    }
    
}

module.exports = { Email }