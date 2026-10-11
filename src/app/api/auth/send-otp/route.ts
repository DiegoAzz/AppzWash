import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory OTP storage for validation (in production can use Redis)
// Map of email -> { code: string, expiresAt: number }
declare global {
  // eslint-disable-next-line no-var
  var __OTP_STORE__: Map<string, { code: string; expiresAt: number }> | undefined;
}

if (!global.__OTP_STORE__) {
  global.__OTP_STORE__ = new Map();
}

const otpStore = global.__OTP_STORE__;

export async function POST(request: Request) {
  try {
    const { email, businessName } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'El correo electrónico es requerido' }, { status: 400 });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes expiry

    // Save code
    otpStore.set(email.toLowerCase().trim(), { code, expiresAt });

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (smtpUser && smtpPass) {
      // Create Nodemailer Gmail transport
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      const mailOptions = {
        from: `"APPZ WASH - Seguridad" <${smtpUser}>`,
        to: email,
        subject: `Tu código de verificación de APPZ WASH: ${code}`,
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #0f172a; padding: 40px 20px; color: #f8fafc;">
            <div style="max-width: 500px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; padding: 32px; border: 1px solid #334155; text-align: center;">
              <h1 style="color: #38bdf8; font-size: 24px; margin-bottom: 8px;">APPZ WASH</h1>
              <p style="color: #94a3b8; font-size: 14px; margin-bottom: 24px;">Activación de Empresa para <strong>${businessName || 'tu Lavadero'}</strong></p>
              
              <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; margin-bottom: 24px; border: 1px solid #475569;">
                <p style="color: #cbd5e1; font-size: 13px; margin-bottom: 8px;">Tu código de seguridad de 6 dígitos es:</p>
                <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #38bdf8; font-family: monospace;">
                  ${code}
                </div>
                <p style="color: #64748b; font-size: 12px; margin-top: 8px;">Este código vence en 10 minutos.</p>
              </div>

              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5;">
                Si tú no solicitaste este registro, puedes ignorar este mensaje de forma segura.
              </p>
              
              <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
              <p style="color: #64748b; font-size: 11px;">
                Desarrollado y respaldado por <strong>APPZ PLAY</strong> • Plataforma SaaS
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);
      console.log(`[EMAIL SENT] Real email dispatched to ${email}`);
    } else {
      console.warn('[EMAIL WARNING] SMTP_USER or SMTP_PASS not set in environment. Code generated:', code);
    }

    return NextResponse.json({
      success: true,
      message: 'Código de verificación enviado al correo exitosamente.',
    });
  } catch (error: any) {
    console.error('Error sending email OTP:', error);
    return NextResponse.json(
      { error: error?.message || 'Error al enviar el correo' },
      { status: 500 }
    );
  }
}
