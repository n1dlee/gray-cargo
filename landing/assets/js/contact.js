document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('#contact-form');
    const submitButton = form.querySelector('button[type="submit"]');
    const statusMessage = document.createElement('p');
    statusMessage.style.marginTop = '1rem';
    form.appendChild(statusMessage);

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        statusMessage.textContent = '';

        const formData = new FormData(form);
        
        fetch('https://formspree.io/f/mpwzalvw', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => {
            if (response.ok) {
                statusMessage.textContent = 'Thanks for your message! I\'ll get back to you soon.';
                form.reset();
            } else {
                throw new Error('Oops! There was a problem submitting your form');
            }
        }).catch(error => {
            statusMessage.textContent = error.message;
        }).finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = 'SHOOT';
        });
    });
});