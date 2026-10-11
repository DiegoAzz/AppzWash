import { NextResponse } from 'next/server';

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
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email y código son requeridos' }, { status: 400 });
    }

    const record = otpStore.get(email.toLowerCase().trim());

    if (!record) {
      return NextResponse.json(
        { valid: false, error: 'No hay un código activo para este correo o ya venció.' },
        { status: 400 }
      );
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(email.toLowerCase().trim());
      return NextResponse.json(
        { valid: false, error: 'El código ha expirado. Por favor solicita uno nuevo.' },
        { status: 400 }
      );
    }

    if (record.code.trim() !== code.trim()) {
      return NextResponse.json(
        { valid: false, error: 'Código incorrecto. Revisa tu correo e intenta nuevamente.' },
        { status: 400 }
      );
    }

    // Success: remove used code
    otpStore.delete(email.toLowerCase().trim());

    return NextResponse.json({
      valid: true,
      message: 'Código verificado con éxito.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Error al validar el código' },
      { status: 500 }
    );
  }
}
