import mongoose from "mongoose";
import config from "../config.js"

export const URI = config.mongoDB_URL;

export const init = async ()=>{
  try {
    await mongoose.connect(URI)
    console.log('Base de datos conectado');
  } catch (error) {
    console.log('Ocurrio un error al intentar conectar la base de datos', error.message);
  }
}