// Load TA data from localStorage or initialize with sample data
let tas = JSON.parse(localStorage.getItem('tas')) || [
    { name: "Jane Smith", course: "CS101", rating: 4.5, reviews: [{ rating: 5, comment: "Amazing TA, very helpful!" }, { rating: 4, comment: "Good explanations but sometimes late." }] },
    { name: "John Doe", course: "MATH202", rating: 3.8, reviews: [{ rating: 4, comment: "Solid TA, knows the material." }, { rating: 3, comment: "Could be more engaging." }] }
  ];
  
  // Search functionality
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    searchResults.innerHTML = '';
    if (query) {
      const filteredTAs = tas.filter(ta => ta.name.toLowerCase().includes(query) || ta.course.toLowerCase().includes(query));
      filteredTAs.forEach(ta => {
        const div = document.createElement('div');
        div.className = 'bg-gray-100 p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-200';
        div.textContent = `${ta.name} - ${ta.course}`;
        div.addEventListener('click', () => showTAProfile(ta));
        searchResults.appendChild(div);
      });
    }
  });
  
  // Show TA profile
  function showTAProfile(ta) {
    const profileSection = document.getElementById('ta-profile');
    document.getElementById('ta-name').textContent = ta.name;
    document.getElementById('ta-course').textContent = ta.course;
    document.getElementById('ta-rating').textContent = `${ta.rating} / 5`;
    const reviewsContainer = document.getElementById('ta-reviews');
    reviewsContainer.innerHTML = '';
    ta.reviews.forEach(review => {
      const div = document.createElement('div');
      div.className = 'border-b pb-2';
      div.innerHTML = `<p class="text-yellow-500">${'★'.repeat(review.rating)}</p><p>${review.comment}</p>`;
      reviewsContainer.appendChild(div);
    });
    profileSection.classList.remove('hidden');
    profileSection.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Star rating functionality
  const stars = document.querySelectorAll('.star');
  stars.forEach(star => {
    star.addEventListener('click', () => {
      const rating = star.dataset.value;
      document.getElementById('review-rating').value = rating;
      stars.forEach(s => s.classList.remove('filled'));
      for (let i = 0; i < rating; i++) {
        stars[i].classList.add('filled');
      }
    });
  });
  
  // Handle review submission
  const reviewForm = document.getElementById('reviewForm');
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('review-ta-name').value;
    const course = document.getElementById('review-course').value;
    const rating = document.getElementById('review-rating').value;
    const comment = document.getElementById('review-comment').value;
  
    // Find or create TA
    let ta = tas.find(t => t.name === name && t.course === course);
    if (!ta) {
      ta = { name, course, rating: 0, reviews: [] };
      tas.push(ta);
    }
  
    // Add review
    ta.reviews.push({ rating: parseInt(rating), comment });
    ta.rating = (ta.reviews.reduce((sum, r) => sum + r.rating, 0) / ta.reviews.length).toFixed(1);
  
    // Save to localStorage
    localStorage.setItem('tas', JSON.stringify(tas));
  
    // Reset form
    reviewForm.reset();
    stars.forEach(s => s.classList.remove('filled'));
    alert('Review submitted successfully!');
  });