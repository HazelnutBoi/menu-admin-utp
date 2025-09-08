// Archivo: api/cron/route.js

import { NextResponse } from 'next/server';
import admin from 'firebase-admin';

// Las variables de entorno son privadas y solo Vercel las puede ver.
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Evita que la app se reinicie en cada llamada.
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://menu-cafeteria-crpo-default-rtdb.firebaseio.com"
  });
}

const db = admin.database();

export async function GET(req) {
  // Paso 3: Evita el acceso no autorizado
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // La lógica para borrar el menú
    await db.ref("menuHoy").remove();
    console.log("Menú borrado exitosamente.");
    return NextResponse.json({ message: "Menú borrado." }, { status: 200 });
  } catch (error) {
    console.error("Error al borrar el menú:", error);
    return NextResponse.json({ message: "Error al borrar el menú." }, { status: 500 });
  }
}