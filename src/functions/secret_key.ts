class SecretKey {
    secret_key: string = '';

    constructor() {}

    generateSecretKey() {
        const crypto = require('crypto');
        this.secret_key = crypto.randomBytes(64).toString('hex');
    }

    getSecretKey() {
        return this.secret_key;
    }
}

let secret_key = new SecretKey();

export default secret_key;