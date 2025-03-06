const express = require('express');
const axios = require('axios');
const router = express.Router();

// LinkedIn API configuration
const LINKEDIN_API_URL = 'https://api.linkedin.com/v2';

// Helper function to get user's posts
async function getLinkedInPosts(userId, accessToken) {
    try {
        console.log('Making LinkedIn API request with:');
        console.log('User ID:', userId);
        console.log('Access Token:', accessToken ? 'Present (truncated for security)' : 'Missing');

        if (!userId || !accessToken) {
            throw new Error('Missing required credentials');
        }

        const response = await axios.get(
            `${LINKEDIN_API_URL}/posts`, 
            {
                params: {
                    author: `urn:li:person:${userId}`,
                    q: 'author'
                },
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'X-Restli-Protocol-Version': '2.0.0',
                    'LinkedIn-Version': '202304'
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('LinkedIn API Error:', error.response?.data || error);
        throw error;
    }
}

// Format LinkedIn post data
function formatLinkedInPost(post) {
    return {
        id: post.id,
        text: post.commentary || post.text || '',
        created: post.created?.time || post.createdAt,
        postUrl: post.postUrl || `https://www.linkedin.com/feed/update/${post.id}`
    };
}

// Main endpoint to get LinkedIn posts
router.get('/', async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const userId = req.user.id;
        const accessToken = req.user.accessToken;

        console.log('Fetching posts for user:', userId);
        const postsData = await getLinkedInPosts(userId, accessToken);
        
        const formattedPosts = Array.isArray(postsData.elements) 
            ? postsData.elements.map(formatLinkedInPost)
            : [];
            
        res.json(formattedPosts);
    } catch (error) {
        console.error('LinkedIn API Error:', error);
        res.status(500).json({ 
            error: 'Error fetching LinkedIn posts',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

module.exports = router;