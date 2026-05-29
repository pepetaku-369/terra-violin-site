const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let payload;
  try {
    payload = JSON.parse(event.body);
  } catch (e) {
    return { statusCode: 400, body: 'Invalid payload' };
  }

  const { form_name, data } = payload;
  const { name, email, message, plan, category } = data || {};

  if (!email) {
    return { statusCode: 400, body: 'No email address' };
  }

  let subject, replyBody, from, replyTo;

  if (form_name === 'support-violin') {
    subject = '【TERRAviolin】サポートヴァイオリン お申し込みありがとうございます';
    from = 'TERRA <onboarding@resend.dev>';
    replyTo = 'violin.tkssbkw@gmail.com';
    replyBody = `${name || 'お客様'} 様\n\nこの度はサポートヴァイオリンにお申し込みいただき、誠にありがとうございます。\n内容を確認の上、改めてご連絡いたします。\n\nご依頼の楽曲に譜面や音源がございましたら、このメールに添付してそのままご返信ください。\n\nどうぞよろしくお願いいたします。\nTERRA`;
  } else {
    subject = '【TERRAviolin】お問い合わせを受け付けました';
    from = 'TERRA <noreply@resend.dev>';
    replyTo = null;
    replyBody = `${name || 'お客様'} 様\n\nお問い合わせいただき、誠にありがとうございます。\n内容を確認の上、改めてご連絡いたします。\n\n※このメールは自動送信です。返信はお受けできません。\n\nTERRA`;
  }

  const emailOptions = {
    from,
    to: email,
    subject,
    text: replyBody,
  };
  if (replyTo) emailOptions.reply_to = replyTo;

  try {
    await resend.emails.send(emailOptions);
    return { statusCode: 200, body: 'OK' };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: 'Failed to send email' };
  }
};
