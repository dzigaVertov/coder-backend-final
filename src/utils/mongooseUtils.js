import mongoose from 'mongoose';

// Interactuar directamente con la base de datos
export async function insertIntoMongoDb(docToSave, collection) {
    await mongoose.connection.collection(collection).insertOne(docToSave);
    delete docToSave._id;
}

export async function fetchFromMongoDb(query, collection) {
    return mongoose.connection.collection(collection).findOne(query, { projection: { _id: 0 } });
}
