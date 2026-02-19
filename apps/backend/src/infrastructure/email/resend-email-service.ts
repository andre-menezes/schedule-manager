import { Resend } from 'resend';
import type { EmailService, SendPasswordResetEmailInput } from '../../application/services/email-service.js';

export class ResendEmailService implements EmailService {
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor(apiKey: string, fromEmail: string = 'onboarding@resend.dev') {
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.fromEmail = fromEmail;

    if (!apiKey) {
      console.warn('[ResendEmailService] No API key provided. Emails will be logged to console.');
    } else {
      console.log('[ResendEmailService] Initialized with from:', fromEmail);
    }
  }

  async sendPasswordResetEmail(input: SendPasswordResetEmailInput): Promise<void> {
    if (!this.resend) {
      console.log('[ResendEmailService] Password reset code for', input.to, ':', input.code);
      return;
    }

    console.log('[ResendEmailService] Sending email to:', input.to);

    const result = await this.resend.emails.send({
      from: this.fromEmail,
      to: input.to,
      subject: 'Código de Recuperação de Senha',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Recuperação de Senha</h2>
          <p>Você solicitou a recuperação de sua senha. Use o código abaixo para redefinir sua senha:</p>
          <div style="background-color: #f5f5f5; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #007AFF;">${input.code}</span>
          </div>
          <p>Este código expira em <strong>15 minutos</strong>.</p>
          <p style="color: #666; font-size: 14px;">Se você não solicitou esta recuperação, ignore este e-mail.</p>
        </div>
      `,
    });

    if (result.error) {
      console.error('[ResendEmailService] Error sending email:', result.error);
      throw new Error(`Failed to send email: ${result.error.message}`);
    }

    console.log('[ResendEmailService] Email sent successfully, id:', result.data?.id);
  }
}
