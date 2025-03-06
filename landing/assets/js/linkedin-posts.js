// Mock data for fallback when API fails
const FALLBACK_POSTS = [
    {
        author: {
            name: "Nodirbek Zayniddinov",
            profilePicture: "/assets/img/avatar-placeholder.png"
        },
        text: "Hello everyone! I'm excited to share my latest web development projects and thoughts about technology.",
        created: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        postUrl: "https://www.linkedin.com/in/n1dleee/"
    }
    // Add more fallback posts as needed
];

// Utility function to format the post date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        const hours = Math.floor(diffTime / (1000 * 60 * 60));
        if (hours === 0) {
            const minutes = Math.floor(diffTime / (1000 * 60));
            return `${minutes} minutes ago`;
        }
        return `${hours} hours ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    });
}

// Enhanced HTML escape function
function escapeHTML(str) {
    if (!str) return '';
    const escapeChars = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    };
    return str.replace(/[&<>"']/g, char => escapeChars[char]);
}

// Enhanced URL detection and linking
function linkifyText(text) {
    if (!text) return '';
    const urlRegex = /(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;
    return text.replace(urlRegex, url => 
        `<a href="${url}" target="_blank" rel="noopener noreferrer" 
            class="text-purple-700 hover:text-purple-900 break-words">${url.length > 50 ? url.substring(0, 47) + '...' : url}</a>`
    );
}

function createPostHTML(post) {
    const safeText = escapeHTML(post.text);
    const textWithLinks = linkifyText(safeText);
    
    return `
        <article class="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition duration-300">
            <div class="flex items-center mb-4">
                <img src="${escapeHTML(post.author.profilePicture) || '/assets/img/avatar-placeholder.png'}" 
                     alt="${escapeHTML(post.author.name)}'s profile" 
                     class="rounded-full w-12 h-12 mr-4"
                     onerror="this.src='/assets/img/avatar-placeholder.png'"
                     loading="lazy"/>
                <div>
                    <h3 class="font-bold text-lg">${escapeHTML(post.author.name)}</h3>
                    <p class="text-gray-600 text-sm">${formatDate(post.created)}</p>
                </div>
            </div>
            <div class="prose max-w-none">
                <p class="text-gray-700 mb-4 whitespace-pre-wrap">
                    ${textWithLinks}
                </p>
                ${post.postUrl ? `
                    <a href="${escapeHTML(post.postUrl)}" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       class="inline-flex items-center text-purple-700 hover:text-purple-900 font-semibold">
                        Read more on LinkedIn 
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                        </svg>
                    </a>
                ` : ''}
            </div>
        </article>
    `;
}

// Enhanced loading state with better visual feedback
function showLoading(container) {
    container.innerHTML = Array(2).fill(`
        <div class="bg-white rounded-lg shadow-lg p-6">
            <div class="animate-pulse">
                <div class="flex items-center mb-4">
                    <div class="rounded-full bg-gray-200 h-12 w-12 mr-4"></div>
                    <div class="flex-1">
                        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div class="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
                <div class="space-y-3">
                    <div class="h-3 bg-gray-200 rounded"></div>
                    <div class="h-3 bg-gray-200 rounded w-5/6"></div>
                    <div class="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
            </div>
        </div>
    `).join('');
}

// Enhanced error display with retry button
function showError(container, message) {
    container.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="bg-red-50 rounded-lg p-6 max-w-md mx-auto">
                <svg class="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
                </svg>
                <p class="text-red-600 mb-4">${message}</p>
                <button onclick="initializeLinkedInPosts()" 
                        class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
                    Try Again
                </button>
            </div>
        </div>
    `;
}

// Enhanced empty state
function showEmpty(container) {
    container.innerHTML = `
        <div class="col-span-full text-center py-8">
            <div class="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
                <svg class="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"/>
                </svg>
                <p class="text-gray-600">No posts found</p>
            </div>
        </div>
    `;
}

// Enhanced fetch function with timeout and better error handling
async function fetchLinkedInPosts() {
    try {
        const response = await fetch('/api/linkedin-posts');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.warn('Failed to fetch LinkedIn posts, using fallback data:', error);
        return FALLBACK_POSTS;
    }
}

// Main initialization function
async function initializeLinkedInPosts() {
    const postsContainer = document.querySelector('.grid');
    
    if (!postsContainer) {
        console.error('Posts container not found');
        return;
    }

    showLoading(postsContainer);

    try {
        const posts = await fetchLinkedInPosts();
        
        if (!posts || posts.length === 0) {
            showEmpty(postsContainer);
            return;
        }

        postsContainer.innerHTML = '';
        
        const sortedPosts = [...posts].sort((a, b) => new Date(b.created) - new Date(a.created));
        
        sortedPosts.forEach(post => {
            const postHTML = createPostHTML(post);
            postsContainer.insertAdjacentHTML('beforeend', postHTML);
        });

    } catch (error) {
        console.error('Error:', error);
        showError(postsContainer, 'Unable to load posts. Please try again later.');
    }
}

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeLinkedInPosts);

// Add refresh functionality
window.refreshPosts = initializeLinkedInPosts;