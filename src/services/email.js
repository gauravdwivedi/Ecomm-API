const config = require("../config/super").getConfig();

const sendgridmail = require("@sendgrid/mail");

class EmailService{
  constructor(){
    sendgridmail.setApiKey(config.SENDGRID.API_KEY);
    this.sendgridmail = sendgridmail;
  }
  
  /**
  * sending newsletter confirmation email
  * @param {*} email 
  * @param {*} token 
  */
  async sendNewsletterConfirmationEmail(email, token){
    const confirmation_url = `${config["WEBSITE_HOST_URL"]}newsletter-confirmation?token=${token}`;
    const msg = {
      from: config.SENDGRID.EMAIL_LIST.VIDIREN_HOST, // Sender address
      to: email,
      templateId: config.SENDGRID.TEMPLATES.NEWSLETTER_EMAIL_CONFIRMATION,
      dynamic_template_data: {
        confirmation_url
      }
    }
    return await sendgridmail
    .send(msg)
  }
  
  /**
  * sending reset password email
  * @param {*} email 
  * @param {*} token 
  */
  async resetPassword(email, token){
    const reset_password_url = `${config["WEBSITE_HOST_URL"]}reset-password?token=${token}`;
    const msg = {
      from: config.SENDGRID.EMAIL_LIST.VIDIREN_HOST, // Sender address
      to: email,
      templateId: config.SENDGRID.TEMPLATES.RESET_PASSWORD,
      dynamic_template_data: {
        reset_password_url
      }
    }
    return await sendgridmail
    .send(msg)
  }
  
}

module.exports = new EmailService();

