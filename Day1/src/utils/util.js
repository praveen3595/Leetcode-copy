const validator = require('validator');

const validate = (data) => {
    const mandatoryFields = ['firstName', 'email', 'password'];

    // Check if all mandatory fields are present
    mandatoryFields.forEach((field) => {
        if (!data[field]) {
            throw new Error(`${field} is required`);
        }
    });

    // Validate email format
    if (!validator.isEmail(data.email)) {
        throw new Error('Invalid email format');
    }

    // Validate password strength
    if (!validator.isStrongPassword(data.password, { minLength: 6 })) {
        throw new Error(
            'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol'
        );
    }
};

module.exports = validate;
