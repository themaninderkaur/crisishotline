// Initialize TA data
let tas = [];

// Load TA data from tas.json and localStorage
async function loadTAData() {
  try {
    // Fetch base data from tas.json
    const response = await fetch('/tas.json');
    const jsonData = await response.json();
    tas = jsonData;

    // Merge with localStorage data (user-submitted reviews)
    const localData = JSON.parse(localStorage.getItem('tas')) || [];
    localData.forEach(localTA => {
      const existingTA = tas.find(t => t.name === localTA.name && t.course === localTA.course);
      if (existingTA) {
        // Merge reviews and recalculate rating
        existingTA.reviews = [...existingTA.reviews, ...localTA.reviews];
        existingTA.rating = (existingTA.reviews.reduce((sum, r) => sum + r.rating, 0) / existingTA.reviews.length).toFixed(1);
      } else {
        tas.push(localTA);
      }
    });
  } catch (error) {
    console.error('Error loading TA data:', error);
    // Fallback to empty array if fetch fails
    tas = JSON.parse(localStorage.getItem('tas')) || [];
  }
}

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

// Load data on page load
loadTAData();