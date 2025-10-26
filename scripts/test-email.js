// Тестовый скрипт для проверки отправки email
// Запуск: node scripts/test-email.js

const { Resend } = require('resend');

const resend = new Resend('re_2iSZ6gm4_JgP2f36tN9NzNiFSzJSUDSQA');

async function testEmail() {
  try {
    console.log('📧 Отправка тестового письма...');
    
    const data = await resend.emails.send({
      from: 'Qora NFT <onboarding@resend.dev>',
      to: 'zilolatashievaz@gmail.com',
      subject: '🌟 Тест Email верификации - Qora NFT',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0a;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 16px; overflow: hidden; border: 1px solid rgba(139, 92, 246, 0.2);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 30px; text-align: center; background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%);">
                        <h1 style="margin: 0; color: #8b5cf6; font-size: 32px; font-weight: 700; text-shadow: 0 0 20px rgba(139, 92, 246, 0.5);">
                          🌟 Qora NFT
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #ffffff; font-size: 24px; font-weight: 600;">
                          ✅ Тестовое письмо
                        </h2>
                        <p style="margin: 0 0 30px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                          Это тестовое письмо для проверки работы email верификации в Qora NFT. Если вы получили это письмо, значит интеграция с Resend работает отлично! 🎉
                        </p>
                        
                        <div style="background: rgba(139, 92, 246, 0.1); border-left: 4px solid #8b5cf6; padding: 20px; margin: 30px 0; border-radius: 8px;">
                          <p style="margin: 0; color: #ffffff; font-size: 14px; line-height: 1.6;">
                            <strong>API ключ:</strong> работает ✓<br>
                            <strong>Email доставка:</strong> работает ✓<br>
                            <strong>HTML шаблон:</strong> работает ✓
                          </p>
                        </div>
                        
                        <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                          Следующий шаг - зарегистрируйте нового пользователя на платформе и проверьте реальную верификацию email.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background-color: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <p style="margin: 0; color: #666666; font-size: 13px;">
                          © 2025 Qora NFT. Все права защищены.
                        </p>
                        <p style="margin: 10px 0 0; color: #666666; font-size: 12px;">
                          🔗 <a href="https://ora-app-token-production.up.railway.app" style="color: #8b5cf6; text-decoration: none;">ora-app-token-production.up.railway.app</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    console.log('✅ Письмо успешно отправлено!');
    console.log('📊 Результат:', data);
    console.log('');
    console.log('📬 Проверьте почту: zilolatashievaz@gmail.com');
    console.log('📊 Или посмотрите в Resend Dashboard: https://resend.com/emails');
    
  } catch (error) {
    console.error('❌ Ошибка отправки:', error);
    process.exit(1);
  }
}

testEmail();
