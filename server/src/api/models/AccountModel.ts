import * as mongoose from 'mongoose';

const AccountSchema = new mongoose.Schema(
    {username: String,
        email: String,
        password: String},
    {collection: 'ACCOUNTS'},
);

module.exports = mongoose.model('accountModel', AccountSchema);
