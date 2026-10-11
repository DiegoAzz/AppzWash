import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { INITIAL_ORDERS } from '@/lib/mock-data';

export async function GET() {
  try {
    const orders = await prisma.washOrder.findMany({
      include: {
        items: true,
        washer: true,
        vehicleCategory: true,
      },
      orderBy: { orderNumber: 'desc' },
    });
    return NextResponse.json({ success: true, data: orders, source: 'database' });
  } catch (error) {
    // Graceful fallback to initial mock orders for zero-config offline dev
    return NextResponse.json({
      success: true,
      data: INITIAL_ORDERS,
      source: 'offline_cache',
      notice: 'Conexión a PostgreSQL en espera. Mostrando datos iniciales locales.',
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ success: true, data: body });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
