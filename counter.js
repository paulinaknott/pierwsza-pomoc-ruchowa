const BIN_ID = '6901120b43b1c97be987ec1d';
const API_KEY = '$2a$10$9D.0VYjR95No7rtUW1p.BeZFl4zdhk23VtD0CqP6N49cJWyuI7wcG';

const BIN_URL = `https://api.jsonbin.io/v3/b/${BIN_ID}`;
const HEADERS = {
  'Content-Type': 'application/json',
  'X-Access-Key': API_KEY
};

async function fetchCounts() {
  try {
    const response = await fetch(BIN_URL, {
      method: 'GET',
      headers: HEADERS
    });
    const result = await response.json();
    return result.record;
  } catch (error) {
    console.error("Error fetching data:", error);
    return {visitors: 0, downloads: 0};
  }
}

async function updateCounts(newCounts) {
  try {
    await fetch(BIN_URL, {
      method: 'PUT',
      headers: HEADERS,
      body: JSON.stringify(newCounts)
    });
  } catch (error) {
    console.error("Error updating data:", error);
  }
}

function displayCounts(counts) {
  document.getElementById('visitorCountDisplay').textContent = counts.visitors;
  document.getElementById('downloadCountDisplay').textContent = counts.downloads;
}

async function trackVisitor() {
  const visitorKey = 'ebook_visitor_tracked';
  if (localStorage.getItem(visitorKey)) {
    const currentCounts = await fetchCounts();
    displayCounts(currentCounts);
    return;
  }

  const currentCounts = await fetchCounts();

  const newCounts = {
    ...currentCounts,
    visitors: currentCounts.visitors + 1
  };

  await updateCounts(newCounts);
  localStorage.setItem(visitorKey, 'true');

  displayCounts(newCounts);
}

async function trackDownloadClick() {
  const currentCounts = await fetchCounts();

  const newCounts = {
    ...currentCounts,
    downloads: currentCounts.downloads + 1
  };

  await updateCounts(newCounts);

  displayCounts(newCounts);
}

document.addEventListener('DOMContentLoaded', () => {
  trackVisitor();

  const button = document.querySelector('.downloadLink');
  if (button) {
    button.addEventListener('click', trackDownloadClick);
  }
});
