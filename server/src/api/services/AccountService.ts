/* eslint-disable max-len */
import {injectable} from 'inversify';
import mongoose from 'mongoose';
require('dotenv').config();

@injectable()
/** Class in charge of the logic behind logins */
export class AccountService {
    // private DB_NAME = 'COLOR_IMAGE';
    // private DB_URL = 'mongodb://127.0.0.1:27017/' + this.DB_NAME;

    /** Create the AccountService object */
    public constructor() {}

    /** Validates new account info, sends info to DB and returns a response code.
     *
     * @param {String} newUsername - The username for the new account.
     *
     * @param {String} newEmail - The email for the new account.
     *
     * @param {String} newPassword - The password for the new account.
     *
     * @return {number} code - The code that indicates if the account was created or not.
     *
    */
    public async createAccount(newUsername: String, newEmail: String, newPassword: String): Promise<number> {
        console.log('New account request from : ' + newUsername);
        // For local testing
        // mongoose.connect(this.DB_URL);
        mongoose.connect(process.env.DB_URL);
        const emailExists = await this.getUserWithEmail(newEmail);
        const usernameExists = await this.getUserWithUsername(newUsername);
        if ((emailExists && emailExists.length == 0) && (usernameExists && usernameExists.length == 0)) {
            return await this.insertAccount(newUsername, newEmail, newPassword);
        } else if (emailExists && emailExists.length != 0) {
            console.log('Account email : ' + newEmail + ' already exists.');
            return 600; // Email already exists
        } else if (usernameExists && usernameExists.length != 0) {
            console.log('Account username : ' + newUsername + ' already exists.');
            return 601; // Username already exists
        } else return 602; // DB error
    }

    /** Check if email exists in DB
     *
     * @param {String} newEmail - The email for the new account.
    */
    public async getUserWithEmail(newEmail: String): Promise<any> {
        const accountModel = require('../models/AccountModel');
        try {
            const data = await accountModel.find({email: newEmail});
            return data;
        } catch (err) {
            console.log('DB ERROR');
            return null;
        }
    }

    /** Check if username exists in DB
     *
     * @param {String} newUsername - The username for the new account.
    */
    public async getUserWithUsername(newUsername: String): Promise<any> {
        const accountModel = require('../models/AccountModel');
        try {
            const data = await accountModel.find({username: newUsername});
            return data;
        } catch (err) {
            console.log('DB ERROR');
            return null;
        }
    }

    /** Insert new account info in DB
     *
     * @param {String} newUsername - The username for the new account.
     *
     * @param {String} newEmail - The email for the new account.
     *
     * @param {String} newPassword - The password for the new account.
     *
     * @return {number} - The code that indicates if the account was created or not.
    */
    public async insertAccount(newUsername: String, newEmail: String, newPassword: String): Promise<number> {
        const accountModel = require('../models/AccountModel');
        try {
            accountModel.create({username: newUsername, email: newEmail, password: newPassword});
            console.log('Account created for : ' + newUsername);
            return 200; // Success
        } catch (err) {
            console.log('DB ERROR');
            return 602; // DB error
        }
    }

    /** Checks credentials and returns response code.
     *
     * @param {String} givenUsername - The username for the new account.
     *
     * @param {String} givenPassword - The password for the new account.
     *
     * @return {number} code - The code that indicates if the account was created or not.
     *
    */
    public async login(givenUsername: String, givenPassword: String): Promise<number> {
        console.log('New login request from : ' + givenUsername);
        mongoose.connect(process.env.DB_URL);
        const usernameExists = await this.getUserWithUsername(givenUsername);
        if (usernameExists && usernameExists.length == 1) {
            return await this.checkPassword(givenUsername, givenPassword); // Success, Wrong password or DB error
        } else if (usernameExists && usernameExists.length == 0) {
            console.log('Username : ' + givenUsername + ' does not exist.');
            return 603; // Username doesn't exist
        } else {
            console.log('DB ERROR');
            return 602; // DB error
        }
    }

    /** Logout the given account and return code.
     *
     * @param {String} givenUsername - The username to logout.
     *
     * @return {number} code - The code that indicates if the account was created or not.
     *
    */
    public async logout(givenUsername: String): Promise<number> {
        console.log('Logging out : ' + givenUsername);
        const global = require('../../global');
        const index = global.userList.indexOf(givenUsername);
        if (index > -1) global.userList.splice(index, 1);
        return 200;
    }

    /** Checks if a password matches the given username
     *
     * @param {String} givenUsername - The username for the new account.
     *
     * @param {String} givenPassword - The password for the new account.
     *
     * @return {number} - The code that indicates if the account was created or not.
    */
    public async checkPassword(givenUsername: String, givenPassword: String): Promise<number> {
        const accountModel = require('../models/AccountModel');
        try {
            const matchingCreds = await accountModel.find({username: givenUsername, password: givenPassword});
            if (matchingCreds && matchingCreds.length > 0) {
                const global = require('../../global');
                if (global.userList.includes(givenUsername)) {
                    console.log('User : ' + givenUsername + ' is already logged in.');
                    return 605;
                } else global.userList.push(givenUsername);
                console.log('Logging in : ' + givenUsername);
                return 200; // Success
            } else return 604; // Wrong password
        } catch (err) {
            console.log('DB ERROR');
            return 602; // DB error
        }
    }
}
