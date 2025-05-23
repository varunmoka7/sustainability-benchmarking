document.addEventListener('DOMContentLoaded', () => {
  const scraperForm = document.getElementById('scraper-form');
  const urlInput = document.getElementById('url-input');
  const fileInput = document.getElementById('file-input');
  const resultsDiv = document.getElementById('results');

  if (scraperForm) {
    scraperForm.addEventListener('submit', (event) => {
      event.preventDefault(); // Prevent default form submission

      const url = urlInput.value.trim();
      const file = fileInput.files[0]; // Get the first file if any

      if (!url && !file) {
        alert('Please enter a URL or upload a PDF file.');
        return; // Stop execution if no input is provided
      }

      // Display loading message
      resultsDiv.innerHTML = '<p>Loading and extracting data...</p>';
      resultsDiv.style.color = 'var(--medium-gray)'; // Using a variable from your CSS

      // Simulate scraping process with a delay
      setTimeout(() => {
        resultsDiv.innerHTML = `
          <h3>Simulated Scraped Data:</h3>
          <p>Data extraction would happen here based on the provided ${url ? 'URL' : 'PDF file'}.</p>
          <p>For a real application, this data would come from the backend after parsing the source.</p>
          <h4>Example Extracted Information:</h4>
          <p><strong>Total Carbon Emissions:</strong> 5,500 tCO₂e (Simulated)</p>
          <p><strong>Renewable Energy Usage:</strong> 65% (Simulated)</p>
          <p><strong>Water Withdrawal:</strong> 1,200 cubic meters (Simulated)</p>
        `;
        resultsDiv.style.color = 'initial'; // Reset color
      }, 2000); // Simulate a 2-second delay
    });
  }
});