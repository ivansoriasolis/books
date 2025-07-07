import * as functions from 'firebase-functions/v1';
import * as admin from 'firebase-admin';

admin.initializeApp();

// ⚠️ Ningún console.log aquí fuera de funciones

export const saludoHttp = functions.https.onRequest((req, res) => {
  res.send("Hola desde Firebase");
});

export const notificarNuevoLibro = functions.firestore
  .document('book/{id}')
  .onCreate((snap, context) => {
    const libro = snap.data();
    console.log('Nuevo libro:', libro.titulo);
    return null;
  });


  