// Function to check if element exists before accessing it
function safeQuerySelector(selector) {
    return document.querySelector(selector);
  }
  
  // Add random shapes to container
  function addRandomShapes() {
    const container = safeQuerySelector('.random-shapes');
    if (!container) return; // Skip if container doesn't exist
  
    // Your existing random shapes code here
    const numShapes = 5;
    const shapes = ['circle', 'square', 'triangle'];
    const colors = ['#3d155f', '#b3d175', '#4a90e2'];
  
    for (let i = 0; i < numShapes; i++) {
      const shape = document.createElement('div');
      const randomShape = shapes[Math.floor(Math.random() * shapes.length)];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      
      shape.classList.add('shape', randomShape);
      shape.style.backgroundColor = randomColor;
      shape.style.left = `${Math.random() * 100}%`;
      shape.style.top = `${Math.random() * 100}%`;
      shape.style.animationDelay = `${Math.random() * 5}s`;
      
      container.appendChild(shape);
    }
  }
  
  // Fetch and display GitHub projects
  async function fetchGithubProjects() {
    const projectsGrid = safeQuerySelector('.grid');
    if (!projectsGrid) return; // Skip if not on work page
  
    const username = 'n1dlee'; // Your GitHub username
    try {
      // Show loading state
      projectsGrid.innerHTML = '<div class="col-span-full text-center">Loading projects...</div>';
  
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=12`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      
      const projects = await response.json();
      
      // Clear loading state
      projectsGrid.innerHTML = '';
      
      projects.forEach(project => {
        const projectCard = `
          <article class="bg-white rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition duration-300">
            <div class="p-8">
              <div class="h-12 mb-6 flex items-center">
                <i class="fab fa-github text-4xl" style="color: #3d155f"></i>
              </div>
              <h3 class="text-2xl font-bold mb-2" style="color: #3d155f">${project.name}</h3>
              <p class="text-gray-600 mb-4">${project.description || 'No description available'}</p>
              <div class="flex justify-between items-center">
                <a href="${project.html_url}" 
                   class="text-purple-600 hover:text-purple-800 transition duration-300" 
                   target="_blank">
                  View on GitHub
                </a>
                ${project.homepage ? `
                  <a href="${project.homepage}" 
                     class="text-green-600 hover:text-green-800 transition duration-300" 
                     target="_blank">
                    Live Demo
                  </a>
                ` : ''}
              </div>
            </div>
          </article>
        `;
        projectsGrid.innerHTML += projectCard;
      });
    } catch (error) {
      console.error('Error fetching GitHub projects:', error);
      projectsGrid.innerHTML = `
        <div class="col-span-full text-center text-red-600">
          Failed to load projects. Please try again later.
        </div>
      `;
    }
  }
  
  // Initialize page
  function init() {
    addRandomShapes();
    // Only fetch projects if we're on the work page
    if (window.location.pathname.includes('work')) {
      fetchGithubProjects();
    }
  }
  
  // Run initialization when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);