const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcryptjs = require("bcryptjs");

const UserSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
    tipo: {
        type: Number,
        defaul: 1       //0 - admin, 1 - regular
    }
});

UserSchema.method({
    //Funcion que encripta una contraseña 10 veces
    //Retorna el password encriptado

    async encryptPassword(password) {
        const passwordHash = await bcryptjs.hash(password, 10);
        return passwordHash;
    },

    async matchPassword(password) {
        return await bcryptjs.compare(password, this.password);
    }
});


module.exports = mongoose.model("User", UserSchema);