// NightScout live search upgrade
// Replace your current app.js with this file OR merge the search functions into app.js.

const API_BASE = 'https://YOUR-VERCEL-PROJECT.vercel.app';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('findVenuesBtn') || document.querySelector('button.primary');
  const input = document.getElementById('soloQuery');
  const venueList = document.getElementById('venueList');
  const resultsCount = document.getElementById('resultsCount');

  if (!btn || !input || !venueList) return;

  btn.addEventListener('click', async () => {
    const query = input.value.trim();
    if (!query) {
      venueList.innerHTML = '<div class="empty-state">Enter a NJ ZIP code, city, or address.</div>';
      return;
    }

    resultsCount.textContent = 'Searching live results...';
    venueList.innerHTML = '<div class="empty-state">Searching nearby bars and lounges...</div>';

    try {
      const url = new URL('/api/search', API_BASE);
      url.searchParams.set('query', query);
      url.searchParams.set('type', 'bar');

      const resp = await fetch(url.toString());
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || 'Search failed');

      resultsCount.textContent = `Showing ${data.count} live results near ${data.normalizedLocation}`;
      venueList.innerHTML = data.venues.length
        ? data.venues.map(renderVenueCard).join('')
        : '<div class="empty-state">No venues found for that NJ search.</div>';
    } catch (err) {
      resultsCount.textContent = 'Search failed';
      venueList.innerHTML = `<div class="empty-state">${escapeHtml(err.message)}</div>`;
    }
  });
});

function renderVenueCard(v) {
  return `
    <article class="venue-card glass">
      <div class="venue-top">
        <div>
          <h3>${escapeHtml(v.name)}</h3>
          <p>${escapeHtml(v.address || '')}</p>
        </div>
        <span class="status-pill">${escapeHtml(v.priceLabel || '—')}</span>
      </div>
      <div class="meta-grid">
        <div><strong>Type</strong><br>${escapeHtml(v.type || 'Venue')}</div>
        <div><strong>Rating</strong><br>${v.rating ? `${v.rating} ⭐ (${v.userRatingCount || 0})` : 'No rating'}</div>
        <div><strong>Distance</strong><br>${v.distanceMiles ? `${v.distanceMiles} mi` : '—'}</div>
        <div><strong>Phone</strong><br>${escapeHtml(v.phone || '—')}</div>
      </div>
      <div class="button-row">
        ${v.mapsUrl ? `<a class="primary" href="${escapeAttr(v.mapsUrl)}" target="_blank" rel="noopener noreferrer">Directions</a>` : ''}
        ${v.website ? `<a class="secondary" href="${escapeAttr(v.website)}" target="_blank" rel="noopener noreferrer">Website</a>` : ''}
      </div>
    </article>
  `;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, (m) => ({ '&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;' }[m]));
}
function escapeAttr(str) { return escapeHtml(str); }
