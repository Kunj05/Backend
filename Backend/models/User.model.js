const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: [3, "Minimum Length Should be 3"],
        maxlength: [20, "Maximum Length Should be 20"],
      },
    email: { 
        type: String, 
        required: true, 
        unique: true,
        lowercase: true,
    },
    password: { 
        type: String, 
        required: function() {
            return !this.googleId;
        }    
    },
    googleId: { 
        type: String 
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,  
});

// Password hashing
UserSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', UserSchema);
