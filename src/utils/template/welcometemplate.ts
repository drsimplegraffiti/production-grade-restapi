class EmailTemplate {
    private frontEndUrl: string;
  
    constructor(frontEndUrl: string) {
      this.frontEndUrl = frontEndUrl;
    }
  
    public async generateWelcomeEmail(
      email: string,
      name: string
    ): Promise<string> {
      const html = `
          <!DOCTYPE html>
          <html lang="en">
      
          <head>
              <meta charset="UTF-8" />
              <meta http-equiv="X-UA-Compatible" content="IE=edge" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
              <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600&display=swap" rel="stylesheet" />
              <title>Welcome</title>
              <style>
                  body {
                      font-family: "Open Sans", sans-serif;
                      margin: 0;
                      padding: 0;
                      background-color: #f4f4f4;
                  }
    
                  .container {
                      width: 80%;
                      margin: auto;
                      overflow: hidden;
                  }
    
                  header {
                      background: #390535;
                      color: #ffffff;
                      padding-top: 30px;
                      min-height: 70px;
                      border-bottom: #e8491d 4px solid;
                      font-size: 2em;
                      text-align: center;
                  }
    
                  header a {
                      color: #ffffff;
                      text-decoration: none;
                      text-transform: uppercase;
                      font-size: 16px;
                  }
    
                  main {
                      padding: 20px 0;
                  }
    
                  footer {
                      background: #390535;
                      color: #ffffff;
                      text-align: center;
                      padding: 10px 0;
                  }
              </style>
          </head>
      
          <body>
              <header>
                  <div class="container">
                      <h1>Welcome to Our Service</h1>
                  </div>
              </header>
              <main>
                  <div class="container">
                      <h2>Hello ${name},</h2>
                      <p>
                          We are excited to have you on board. Click the link below to get started:
                      </p>
                      <a href="${this.frontEndUrl}/onboarding?email=${email}">Get Started</a>
                  </div>
              </main>
          </body>
      
          </html>
          `;
      return html;
    }
  }
  
  const FRONT_END_URL = process.env.FRONT_END_URL as string;
  const welcomeUserTemp = new EmailTemplate(FRONT_END_URL);
  
  export default welcomeUserTemp;
  