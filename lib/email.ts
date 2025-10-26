import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * Генерация токена подтверждения email
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Получение URL для подтверждения email
 */
export function getVerificationUrl(token: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  return `${baseUrl}/api/auth/verify-email?token=${token}`
}

/**
 * Отправка email с подтверждением
 */
export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = getVerificationUrl(token)
  
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Qora NFT <onboarding@resend.dev>',
      to: email,
      subject: 'Подтвердите ваш email - Qora NFT',
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
                          Подтвердите ваш email
                        </h2>
                        <p style="margin: 0 0 30px; color: #a0a0a0; font-size: 16px; line-height: 1.6;">
                          Спасибо за регистрацию в Qora NFT! Для завершения регистрации и активации вашего аккаунта, пожалуйста, подтвердите ваш email адрес, нажав на кнопку ниже.
                        </p>
                        
                        <!-- Button -->
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td align="center" style="padding: 20px 0;">
                              <a href="${verificationUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%); color: #ffffff; text-decoration: none; font-size: 16px; font-weight: 600; border-radius: 12px; box-shadow: 0 4px 20px rgba(139, 92, 246, 0.4);">
                                ✅ Подтвердить email
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 30px 0 0; color: #666666; font-size: 14px; line-height: 1.6;">
                          Если кнопка не работает, скопируйте и вставьте эту ссылку в браузер:
                        </p>
                        <p style="margin: 10px 0 0; color: #8b5cf6; font-size: 14px; word-break: break-all;">
                          ${verificationUrl}
                        </p>
                        
                        <div style="margin-top: 40px; padding-top: 30px; border-top: 1px solid rgba(255, 255, 255, 0.1);">
                          <p style="margin: 0; color: #666666; font-size: 13px; line-height: 1.6;">
                            ⚠️ Ссылка действительна в течение 24 часов.
                          </p>
                          <p style="margin: 10px 0 0; color: #666666; font-size: 13px; line-height: 1.6;">
                            Если вы не регистрировались на Qora NFT, просто проигнорируйте это письмо.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; text-align: center; background-color: rgba(0, 0, 0, 0.3); border-top: 1px solid rgba(255, 255, 255, 0.1);">
                        <p style="margin: 0; color: #666666; font-size: 13px;">
                          © 2025 Qora NFT. Все права защищены.
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
    })
    
    console.log(`✅ Verification email sent to ${email}`)
    return { success: true, message: 'Verification email sent' }
  } catch (error) {
    console.error('❌ Failed to send verification email:', error)
    throw new Error('Failed to send verification email')
  }
}

/**
 * Проверка истечения токена (24 часа)
 */
export function isTokenExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate
}
