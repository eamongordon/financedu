import { createTransport } from "nodemailer";

const transport = createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: parseInt(process.env.EMAIL_SERVER_PORT as string),
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
    }
})

export async function sendChildParentInviteEmail({ childEmail, parentName, parentId }: { childEmail: string, parentName: string, parentId: string }) {
    const url = `https://financedu.vercel.app/account/parentinvite/${parentId}`;
    const result = await transport.sendMail({
        to: childEmail,
        from: process.env.EMAIL_FROM,
        subject: `Request to add parent access to your account`,
        text: `${parentName} is requesting parent access to your Financedu account.\nGrant them access:${url}\n\n`,
        html: parentChildEmailHtml(url, parentName)
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
    const logo = `https://www.prospectorminerals.com/_next/image?url=%2FPM-Favicon-New-Square.png&w=128&q=75`;
    return `
    <html lang="en" style="color-scheme: light dark;">
      <body style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark;">
        <table width="100%" border="0" cellspacing="20" cellpadding="0"
          style="background: light-dark(${color.mainBackground}, ${color.mainBackgroundDark}); color-scheme: light dark; max-width: 600px; margin: auto; border-radius: 10px;">
          <tr>
            <td align="center" style="padding: 10px 0px; font-size: 22px;">
              <img src=${logo} width="55" height="55" alt="Prospector Minerals Logo">
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