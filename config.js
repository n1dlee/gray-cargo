require('dotenv').config();

const config = {
    linkedin: {
        clientId: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: process.env.LINKEDIN_CALLBACK_URL,
        scope: ['r_liteprofile', 'r_emailaddress', 'w_member_social']
    }
};

module.exports = config;