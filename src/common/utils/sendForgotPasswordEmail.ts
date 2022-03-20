import * as sg from '@sendgrid/mail';

type Params = {
  to: string;
  userName: string;
  code: string;
}


export async function sendForgotPasswordEmail({ code, to, userName }: Params) {
  sg.setApiKey(process.env.SENDGRID_API_KEY);

  await sg.send({
    from: 'joselucas.gaspar@gmail.com',
    to,
    subject: 'Your recovery password code is here',
    html: `
      <p>Hello ${userName}! Your recovery password code is here: <strong>${code}</strong></p>
    `
  });

  return true;
}