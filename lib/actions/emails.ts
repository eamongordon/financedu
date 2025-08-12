import { createTransport } from "nodemailer";

const transport = createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT as string),
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD
  }
})

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;

export async function sendChildParentInviteEmail({ childEmail, parentName, inviteId }: { childEmail: string, parentName: string, inviteId: string }) {
  const url = `https://www.financedu.org/parentinvite/${inviteId}`;
  const result = await transport.sendMail({
    to: childEmail,
    from: process.env.EMAIL_FROM,
    subject: `Request to add parent access to your account`,
    text: `${parentName} is requesting parent access to your Financedu account.\nGrant them access:${url}\n\n`,
    html: parentChildEmailHtml(url, parentName),
  });
  return await result;
}

const parentChildEmailHtml = (url: string, parentName: string): string => {
  const color = {
    background: "#f9f9f9",
    text: "#444",
    textDark: "#fff",
    mainBackground: "#fff",
    mainBackgroundDark: "#000",
    buttonBackground: "#3bde2c",
    buttonBorder: "#3bde2c",
    buttonText: "#fff"
  }
  const logo = `https://www.financedu.org/_next/image?url=%2Ffinancedu_icon.png&w=128&q=75`;
  return `
    <html lang="en" style="color-scheme: light dark;">
      <body style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark;">
        <table width="100%" border="0" cellspacing="20" cellpadding="0"
          style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark; max-width: 600px; margin: auto; border-radius: 10px;">
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 22px;">
              <img src=${logo} width="55" height="55" alt="Financedu Logo">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark});">
              <strong>${parentName}</strong> is requesting parent access to your Financedu account.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark})">
              Grant them access by clicking the button below.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
                    <a href="${url}" target="_blank"
                      style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                      Grant Access
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark})">
              Don't recognize this request? Please ignore this email.
            </td>
          </tr>
        </table>
      </body>
    </html>
    `
};

export async function sendClassTeacherInviteEmail({ teacherEmail, className, inviteId }: { teacherEmail: string, className: string, inviteId: string }) {
  const url = `${baseUrl}/teacherinvite/${inviteId}`;
  const result = await transport.sendMail({
    to: teacherEmail,
    from: process.env.EMAIL_FROM,
    subject: `Invitation to join class ${className} as a teacher`,
    text: `You have been invited to join the class ${className} as a teacher.\nAccept the invitation: ${url}\n\n`,
    html: classTeacherInviteEmailHtml(url, className)
  });
  return await result;
}

export async function sendForgotPasswordEmail({ email, url }: { email: string, url: string }) {
  const result = await transport.sendMail({
    to: email,
    from: process.env.EMAIL_FROM,
    subject: `Reset your password`,
    text: `Click the link to reset your password: ${url}`,
    html: resetPasswordEmailHtml(url)
  });
  return await result;
}

const resetPasswordEmailHtml = (url: string): string => {
  const color = {
    background: "#f9f9f9",
    text: "#444",
    textDark: "#fff",
    mainBackground: "#fff",
    mainBackgroundDark: "#000",
    buttonBackground: "#3bde2c",
    buttonBorder: "#3bde2c",
    buttonText: "#fff"
  }
  const logo = `https://www.financedu.org/_next/image?url=%2Ffinancedu_icon.png&w=128&q=75`;
  return `
    <html lang="en" style="color-scheme: light dark;">
      <body style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark;">
        <table width="100%" border="0" cellspacing="20" cellpadding="0"
          style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark; max-width: 600px; margin: auto; border-radius: 10px;">
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 22px;">
              <img src=${logo} width="55" height="55" alt="Financedu Logo">       
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark});">
              You have requested to reset your password.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark})">
              Click the button below to reset your password.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr> 
                  <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
                    <a href="${url}" target="_blank"
                      style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>  
            <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark})">
              Don't recognize this request? Please ignore this email.
            </td>
          </tr>
        </table>
      </body>
    </html>
    `
};

const classTeacherInviteEmailHtml = (url: string, className: string): string => {
  const color = {
    background: "#f9f9f9",
    text: "#444",
    textDark: "#fff",
    mainBackground: "#fff",
    mainBackgroundDark: "#000",
    buttonBackground: "#3bde2c",
    buttonBorder: "#3bde2c",
    buttonText: "#fff"
  }
  const logo = `https://www.financedu.org/_next/image?url=%2Ffinancedu_icon.png&w=128&q=75`;
  return `
    <html lang="en" style="color-scheme: light dark;">
      <body style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark;">
        <table width="100%" border="0" cellspacing="20" cellpadding="0"
          style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark; max-width: 600px; margin: auto; border-radius: 10px;">
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 22px;">
              <img src=${logo} width="55" height="55" alt="Financedu Logo">
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark});">
              You have been invited to join the class <strong>${className}</strong> as a teacher.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 16px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark})">
              Accept the invitation by clicking the button below.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 20px 0;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="border-radius: 5px;" bgcolor="${color.buttonBackground}">
                    <a href="${url}" target="_blank"
                      style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;">
                      Accept Invitation
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: light-dark(${color.text}, ${color.textDark})">
              Don't recognize this request? Please ignore this email.
            </td>
          </tr>
        </table>
      </body>
    </html>
    `
};