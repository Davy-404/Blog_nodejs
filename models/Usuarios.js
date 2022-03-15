const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema ({
   eAdmin:{
          type: Number,
          default: 0
   },
   nome: {
        type: String,
        required: true
   },
   email: {
        type: String,
        required: true
   },
   senha: {
        type: String,
        required: true
   } 
});

mongoose.model('usuarios', Usuario);