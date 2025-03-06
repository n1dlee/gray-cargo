function downloadResume() {
    const link = document.createElement('a');
    link.href = '/resume/resume.pdf';
    link.download = 'Nodirbek_Zayniddinov_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const resumeLink = document.querySelector('a[href="#resume"]');
    
    if (resumeLink) {
      resumeLink.addEventListener('click', function(event) {
        event.preventDefault();
        downloadResume();
      });
    }
  });