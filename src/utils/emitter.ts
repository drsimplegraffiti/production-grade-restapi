import EventEmitter from "events";
import { sendEmail } from "./mail/emailsender";
import welcomeUserTemp from "./template/welcometemplate";

const FRONT_END_URL =
  (process.env.FRONT_END_URL as string) || "http://localhost:7676/signup";

class EmailEmitter extends EventEmitter {
  private readonly frontendUrl: string;

  constructor(frontendUrl: string) {
    super();
    this.frontendUrl = frontendUrl;
    this.on("welcome-email", this.sendWelcomeEmail);
  }

  private async sendWelcomeEmail(data: { email: string; name: string }) {
    const emailContent = await welcomeUserTemp.generateWelcomeEmail(
      data.email,
      data.name
    );

    await sendEmail({
      email: data.email,
      subject: "welcome to our service",
      message: emailContent,
    });
  }
}

const emailEmitter = new EmailEmitter(FRONT_END_URL);
export default emailEmitter;
