const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true // Contrainte d'unicité
        },
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true, // Contrainte d'unicité
            match: [/.+@.+\..+/, 'Please use a valid email address'] // Validation du format d'email
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Méthode statique pour vérifier l'authentification
UserSchema.statics.verifyLogin = async function (email, password) {
    try {
        // Recherche de l'utilisateur par email
        const user = await this.findOne({ email });
        if (!user) {
            return { success: false, message: 'User not found.' };
        }

        
        // Vérification du mot de passe
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return { success: false, message: 'Invalid credentials.' };
        }

        // Authentification réussie
        return { success: true, user };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

UserSchema.statics.checkUserExists =  async function (email, username) {
    try {
        const existingUser = await this.findOne({
            $or: [{ email: email }, { username: username }]
        });

        if (existingUser) {
            console.log("User already exists:", existingUser);
            return true; // L'utilisateur existe déjà
        } else {
            console.log("User does not exist.");
            return false; // L'utilisateur n'existe pas
        }
    } catch (error) {
        console.error("Error checking user:", error);
        throw error;
    }
}


// Modèle basé sur le schéma
const User = mongoose.model('User', UserSchema);

module.exports = User;
