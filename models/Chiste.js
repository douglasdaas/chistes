const mongoose = require('mongoose');

const chisteSchema = new mongoose.Schema({
    numero: {
        type: Number,
        unique: true,
    },
    texto: {
        type: String,
        required: true,
    },
});

chisteSchema.statics.obtenerPrimerNumeroDisponible = async function () {
    const ChisteModel = mongoose.model('Chiste', chisteSchema);
    const chiste = await ChisteModel.findOne({}, 'numero').sort({ numero: 1 });

    if (!chiste) {
        // No hay chistes en la base de datos, el primer número disponible es 1
        return 1;
    }

    // El primer número disponible es el siguiente después del número más alto existente
    return chiste.numero + 1;
};

chisteSchema.statics.guardarChiste = async function (texto) {
    const primerNumeroDisponible = await this.obtenerPrimerNumeroDisponible();
    const nuevoChiste = new this({ numero: primerNumeroDisponible, texto });
    return await nuevoChiste.save();
};

module.exports = mongoose.model('Chiste', chisteSchema);
