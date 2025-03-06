const passport = require('passport');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Debug logging
console.log('Environment variables check:');
console.log('LINKEDIN_CLIENT_ID:', process.env.LINKEDIN_CLIENT_ID);
console.log('LINKEDIN_CLIENT_SECRET:', process.env.LINKEDIN_CLIENT_SECRET ? '****' : 'not set');
console.log('LINKEDIN_CALLBACK_URL:', process.env.LINKEDIN_CALLBACK_URL);

// Serialize user for the session
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// Configure LinkedIn Strategy
passport.use(new LinkedInStrategy({
    clientID: process.env.LINKEDIN_CLIENT_ID,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    callbackURL: process.env.LINKEDIN_CALLBACK_URL,
    scope: ['r_emailaddress', 'r_liteprofile', 'w_member_social'],
    state: true
}, async (accessToken, refreshToken, profile, done) => {
    try {
        console.log('LinkedIn Profile:', JSON.stringify(profile, null, 2));
        
        const user = {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails[0].value,
            photo: profile.photos[0].value,
            accessToken: accessToken
        };

        // Store these values globally
        process.env.LINKEDIN_USER_ID = profile.id;
        process.env.LINKEDIN_ACCESS_TOKEN = accessToken;

        console.log('Stored LinkedIn User ID:', process.env.LINKEDIN_USER_ID);
        console.log('Access Token (truncated):', accessToken.substring(0, 10) + '...');

        return done(null, user);
    } catch (error) {
        console.error('LinkedIn Strategy Error:', error);
        return done(error, null);
    }
}));

module.exports = passport;