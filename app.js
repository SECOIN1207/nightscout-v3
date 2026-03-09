
const venues = [
  {
    name:'Grand Vin', city:'Hoboken', zip:'07030', address:'500 Grand St, Hoboken, NJ 07030', opened:2014,
    type:['lounge','restaurant','live music'], crowd:'35–55+', music:['live music','acoustic','jazz'],
    bestNights:['Tuesday','Wednesday','Thursday','Friday','Saturday'], specials:['Happy hour 5–7 PM','Draft beer + wine deals','Live music Tue–Sat'],
    beer:7, cocktail:12, tags:['40+','singles','mature crowd','happy hour','menu','photos'],
    desc:'One of the safest Hoboken picks for a grown-up crowd, especially on weeknights and early weekends.'
  },
  {name:'10th & Willow', city:'Hoboken', zip:'07030', address:'935 Willow Ave, Hoboken, NJ 07030', opened:2008,
    type:['bar','trivia','neighborhood'], crowd:'35–50+', music:['trivia','top 40'], bestNights:['Monday','Wednesday','Thursday'], specials:['Happy hour 4–7 PM','Wings Monday','Taco Tini Thursday'], beer:6, cocktail:11, tags:['30+','40+','trivia','food'], desc:'Neighborhood bar that feels more adult than the Washington Street party spots.'},
  {name:'Bar Franco', city:'Montclair', zip:'07042', address:'5 Church St, Montclair, NJ 07042', opened:2018,
    type:['lounge','cocktail bar'], crowd:'30–45+', music:['dj','house','lounge'], bestNights:['Friday','Saturday'], specials:['Half-price cocktails select weekdays','Date-night vibe'], beer:8, cocktail:14, tags:['30+','singles','lounge'], desc:'Stylish date-night lounge with a polished crowd and stronger cocktail focus.'},
  {name:'The Highlawn', city:'West Orange', zip:'07052', address:'1 Crest Dr, West Orange, NJ 07052', opened:2021,
    type:['rooftop','lounge','restaurant'], crowd:'35–60+', music:['lounge'], bestNights:['Tuesday','Wednesday','Thursday','Friday','Saturday'], specials:['Social Hour 4–6 PM'], beer:8, cocktail:16, tags:['40+','50+','rooftop','views'], desc:'Upscale lounge and bar with scenic views and a much more mature crowd.'},
  {name:'Finnegan's Pub', city:'Hoboken', zip:'07030', address:'734 Willow Ave, Hoboken, NJ 07030', opened:2001,
    type:['pub','live music'], crowd:'30–50+', music:['live music','rock'], bestNights:['Thursday','Friday','Saturday'], specials:['Live bands most weekends'], beer:7, cocktail:11, tags:['30+','rock','live music'], desc:'Classic pub energy with strong live music nights and a broader grown-up crowd.'},
  {name:'Mills Tavern', city:'Hoboken', zip:'07030', address:'125 Washington St, Hoboken, NJ 07030', opened:2019,
    type:['restaurant','cocktail bar'], crowd:'30–45+', music:['dj','top 40'], bestNights:['Thursday','Friday','Saturday'], specials:['Late-night cocktails','Dinner + bar crowd'], beer:8, cocktail:15, tags:['30+','singles','dinner'], desc:'Good crossover choice when you want a dinner spot that still feels social after dark.'},
  {name:'McGovern's Tavern', city:'Newark', zip:'07102', address:'58 New St, Newark, NJ 07102', opened:1936,
    type:['pub','irish bar'], crowd:'30–60+', music:['irish music','live music'], bestNights:['Thursday','Friday','Saturday'], specials:['Traditional pub pours','Classic Newark tavern'], beer:6, cocktail:10, tags:['30+','40+','cheap drinks'], desc:'Historic Newark tavern known for a mature crowd, traditional bar feel, and occasional live music.'},
  {name:'The Vanguard', city:'Harrison', zip:'07029', address:'1 Park Ave, Harrison, NJ 07029', opened:2022,
    type:['rooftop','restaurant','lounge'], crowd:'25–40+', music:['dj','house'], bestNights:['Friday','Saturday','Sunday'], specials:['Brunch + rooftop cocktails'], beer:8, cocktail:15, tags:['brunch','rooftop','dj'], desc:'Modern rooftop-style social spot that bridges dinner, drinks, and a more upbeat lounge crowd.'}
];

const days = ['Tonight','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const crowds = ['All crowds','20s','30+','40+','50+','Singles','Mature crowd'];
const venueTypes = ['All types','Bar','Lounge','Club','Restaurant + dancing','Rooftop','Steakhouse nightlife','Brunch'];
const musicTypes = ['Any music','Live music','DJ','Rock','Country','Hip-hop','House','Reggaeton','Trivia'];
const specials = ['Any specials','Happy hour','Dollar draft','$3 beers','$5 beers','$10 cocktails','Bottomless brunch'];
const beerOptions = ['Any','$1','$3','$5','$7','$10'];
const cocktailOptions = ['Any','$8','$10','$12','$15','$20'];

let filters = { day:'Tonight', crowd:'All crowds', venue:'All types', music:'Any music', special:'Any specials', beer:'Any', cocktail:'Any' };

function renderChips(id, items, stateKey){
 const wrap=document.getElementById(id);
 wrap.innerHTML='';
 items.forEach(item=>{
  const b=document.createElement('button');
  b.className='chip'+(filters[stateKey]===item?' selected':'');
  b.textContent=item;
  b.onclick=()=>{filters[stateKey]=item;renderAll();};
  wrap.appendChild(b);
 })
}

function setupSelect(id, items, key){
 const sel=document.getElementById(id); sel.innerHTML='';
 items.forEach(i=>{ const o=document.createElement('option'); o.value=i; o.textContent=i; sel.appendChild(o); });
 sel.value=filters[key]; sel.onchange=()=>{filters[key]=sel.value; renderAll();};
}

function visibleVenues(){
 return venues.filter(v=>{
  if(filters.day!=='Tonight' && !v.bestNights.includes(filters.day)) return false;
  if(filters.crowd==='30+' && !v.tags.includes('30+')) return false;
  if(filters.crowd==='40+' && !v.tags.includes('40+')) return false;
  if(filters.crowd==='50+' && !v.tags.includes('50+')) return false;
  if(filters.crowd==='Singles' && !v.tags.includes('singles')) return false;
  if(filters.crowd==='Mature crowd' && !v.tags.includes('mature crowd')) return false;
  if(filters.venue!=='All types'){
    const low=filters.venue.toLowerCase();
    if(low==='restaurant + dancing' && !v.type.some(t=>['restaurant','lounge'].includes(t))) return false;
    else if(low==='brunch' && !v.tags.includes('brunch')) return false;
    else if(!v.type.join(' ').includes(low.split(' ')[0])) return false;
  }
  if(filters.music!=='Any music'){
    const low=filters.music.toLowerCase();
    if(!v.music.join(' ').includes(low) && !v.type.join(' ').includes(low)) return false;
  }
  if(filters.special!=='Any specials'){
    const low=filters.special.toLowerCase();
    const text=(v.specials.join(' ')+' '+v.tags.join(' ')).toLowerCase();
    if(!text.includes(low.replace('$',''))) {
      if(!(filters.special==='$5 beers' && v.beer<=5)) return false;
      if(!(filters.special==='$10 cocktails' && v.cocktail<=10)) return false;
    }
  }
  if(filters.beer!=='Any' && v.beer>Number(filters.beer.replace('$',''))) return false;
  if(filters.cocktail!=='Any' && v.cocktail>Number(filters.cocktail.replace('$',''))) return false;
  return true;
 })
}

function venueCard(v){
  return `<article class="venue-card">
    <div class="venue-top"><div><h3 class="venue-title">${v.name}</h3><div class="address">${v.city} • ${v.address}</div></div><div class="status">Open</div></div>
    <div class="info-grid">
      <div class="info"><div class="label">Best nights</div><div class="value">${v.bestNights.join(', ')}</div></div>
      <div class="info"><div class="label">Crowd age</div><div class="value">${v.crowd}</div></div>
      <div class="info"><div class="label">Specials</div><div class="value">${v.specials.join(' • ')}</div></div>
      <div class="info"><div class="label">Music</div><div class="value">${v.music.join(', ')}</div></div>
      <div class="info"><div class="label">Typical prices</div><div class="value">Beer $${v.beer} • Cocktails $${v.cocktail}</div></div>
      <div class="info"><div class="label">What it’s known for</div><div class="value">Opened ${v.opened} • ${v.type.join(', ')}</div></div>
    </div>
    <div class="description">${v.desc}</div>
    <div class="action-row">
      <button class="call">Directions</button>
      <button>Menu</button>
      <button>Photos</button>
      <button>Share</button>
    </div>
  </article>`;
}

function plannerText(txt){
 document.getElementById('plannerResult').textContent=txt;
}

function runMiddle(){
 const a=document.getElementById('midA').value || 'Newark NJ';
 const b=document.getElementById('midB').value || 'Fairview NJ';
 plannerText(`Best meetup zone between ${a} and ${b}: Hackensack / Ridgefield Park. NightScout would now filter venues near that center by crowd, drinks, music, brunch, or singles vibe.`)
}
function runGroup(){
 const lines=(document.getElementById('groupList').value || 'Newark NJ
Fairview NJ
Hoboken NJ').split(/
+/).filter(Boolean).slice(0,10);
 plannerText(`Group triangulation for ${lines.length} people points to an equalized meetup zone near Secaucus / Jersey City edge. Best for mixed travel times, 30+ social spots, and easier parking.`)
}
function runAI(){
 const q=document.getElementById('aiPrompt').value || 'Find a 40+ crowd with $5 beers and live music.';
 plannerText(`AI Scout heard: “${q}”. Suggested outcome: 1) McGovern's Tavern for cheaper drinks, 2) Finnegan's Pub for live music, 3) Grand Vin for a polished 35–55 crowd.`)
}
async function runSolo() {
  const q = document.getElementById('soloQuery').value.trim();
  if (!q) {
    plannerText('Enter a city, state, ZIP, or "near me".');
    return;
  }

  plannerText(`Searching live venues near "${q}"...`);

  try {
    const geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: q }, (results, status) => {
      if (status !== 'OK' || !results[0]) {
        plannerText(`Could not locate "${q}".`);
        return;
      }

      const location = results[0].geometry.location;
      const map = new google.maps.Map(document.createElement('div'));
      const service = new google.maps.places.PlacesService(map);

      service.nearbySearch(
        {
          location,
          radius: 4000,
          keyword: 'bar lounge pub cocktail nightlife',
          type: 'bar'
        },
        (places, placesStatus) => {
          if (
            placesStatus !== google.maps.places.PlacesServiceStatus.OK ||
            !places ||
            !places.length
          ) {
            plannerText(`No live venues found near "${q}".`);
            return;
          }

          const liveVenues = places.map((p) => ({
            name: p.name || 'Unknown',
            city: q,
            zip: '',
            address: p.vicinity || p.formatted_address || 'Live Google result',
            opened: 2025,
            type: ['bar'],
            crowd: 'Mixed',
            music: ['varies'],
            bestNights: ['Tonight'],
            specials: ['Check venue'],
            beer: 6,
            cocktail: 12,
            tags: ['live result'],
            desc: p.vicinity || p.formatted_address || 'Live Google result'
          }));

          document.getElementById('resultsCount').textContent =
            `${liveVenues.length} live venue matches`;

          document.getElementById('venueList').innerHTML =
            liveVenues.map(venueCard).join('');

          plannerText(`Live venue search completed for "${q}".`);
        }
      );
    });
  } catch (err) {
    console.error(err);
    plannerText('Live search failed. Check API setup.');
  }
}
function renderAll(){
 renderChips('dayFilters', days, 'day');
 renderChips('crowdFilters', crowds, 'crowd');
 renderChips('venueFilters', venueTypes, 'venue');
 renderChips('musicFilters', musicTypes, 'music');
 renderChips('specialFilters', specials, 'special');
 setupSelect('beerBudget', beerOptions, 'beer');
 setupSelect('cocktailBudget', cocktailOptions, 'cocktail');
 const list=visibleVenues();
 document.getElementById('resultsCount').textContent=`${list.length} venue matches`;
 document.getElementById('venueList').innerHTML=list.map(venueCard).join('');
}

document.querySelectorAll('.mode').forEach(btn=>btn.onclick=()=>{
 document.querySelectorAll('.mode').forEach(b=>b.classList.remove('active'));
 document.querySelectorAll('.mode-panel').forEach(p=>p.classList.remove('active'));
 btn.classList.add('active');
 document.getElementById(btn.dataset.mode+'-mode').classList.add('active');
});

const runMiddleBtn = document.getElementById('runMiddle');
if (runMiddleBtn) runMiddleBtn.onclick = runMiddle;

const runGroupBtn = document.getElementById('runGroup');
if (runGroupBtn) runGroupBtn.onclick = runGroup;

const runAiBtn = document.getElementById('runAi');
if (runAiBtn) runAiBtn.onclick = runAI;

const runSoloBtn = document.getElementById('runSolo');
if (runSoloBtn) {
  runSoloBtn.onclick = () => {
    alert('runSolo button clicked');
    runSolo();
  };
}

const loadNjBtn = document.getElementById('loadNj');
if (loadNjBtn) {
  loadNjBtn.onclick = () =>
    plannerText('Exploring all New Jersey: NightScout will search statewide for rooftops, brunch, live music, singles events, cheap drinks, and mature crowds.');
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js').catch(() => {})
  );
}

renderAll();
plannerText('Use Solo search, Meet in the middle, Group plan, or AI Scout to reveal the upgraded layers.');
