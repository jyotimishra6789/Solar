// Inject Modal CSS dynamically so we don't have to rewrite the main CSS file again
const modalStyles = `
/* Modal Styling */
.astro-modal {
    display: none; 
    position: fixed; 
    z-index: 1000; 
    left: 0;
    top: 0;
    width: 100%; 
    height: 100%; 
    background-color: rgba(65, 87, 88, 0.8); 
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    justify-content: center;
    align-items: center;
}

.astro-modal-content {
    background-color: #ffffff;
    margin: auto;
    padding: 30px;
    border-radius: 20px;
    width: 90%;
    max-width: 450px;
    position: relative;
    box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    text-align: center;
    color: #1A1A1A;
    font-family: 'Outfit', sans-serif;
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.3s ease;
}

.astro-modal.show .astro-modal-content {
    transform: translateY(0);
    opacity: 1;
}

.close-modal {
    position: absolute;
    right: 20px;
    top: 20px;
    color: #666666;
    font-size: 24px;
    cursor: pointer;
    transition: 0.3s;
}

.close-modal:hover {
    color: #196D69;
}

#modal-title {
    margin-bottom: 20px;
    font-size: 1.8rem;
    font-weight: 700;
    color: #1A1A1A;
}

.modal-body {
    font-size: 1rem;
    color: #666666;
}

.data-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}
.data-row:last-child {
    border-bottom: none;
}
.data-label {
    font-weight: 600;
    color: #196D69;
}
.data-value {
    color: #1A1A1A;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = modalStyles;
document.head.appendChild(styleSheet);


// Application Logic
document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById('astro-modal');
    const closeBtn = document.querySelector('.close-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');

    // Attach click events and cursor styles to the cards
    const btnEarth = document.getElementById('btn-earth');
    const btnPlanets = document.getElementById('btn-planets');
    const btnMeteors = document.getElementById('btn-meteors');

    [btnEarth, btnPlanets, btnMeteors].forEach(btn => {
        if(btn) {
            btn.style.cursor = 'pointer';
            btn.addEventListener('mouseover', () => btn.style.transform = 'scale(1.03)');
            btn.addEventListener('mouseout', () => btn.style.transform = 'scale(1)');
            btn.style.transition = "transform 0.3s";
        }
    });

    if(btnEarth) btnEarth.addEventListener('click', fetchISSData);
    if(btnPlanets) btnPlanets.addEventListener('click', fetchMarsRoverData);
    if(btnMeteors) btnMeteors.addEventListener('click', fetchAsteroidData);

    // Modal behavior
    closeBtn.onclick = function() { closeMod(); }
    window.onclick = function(event) { if (event.target == modal) { closeMod(); } }
    
    function closeMod() {
        modal.classList.remove('show');
        setTimeout(() => modal.style.display = "none", 300);
    }

    function openModal(title, contentHTML) {
        modalTitle.innerText = title;
        modalBody.innerHTML = contentHTML;
        modal.style.display = "flex";
        setTimeout(() => modal.classList.add('show'), 10);
    }

    // --- Top UI Controls Interactivity ---
    
    // 1. Menu
    const btnMenu = document.getElementById('btn-menu');
    if(btnMenu) {
        btnMenu.addEventListener('click', () => {
            openModal("Main Menu", `
                <div style="display:flex; flex-direction:column; gap:20px; text-align:center; padding: 20px 0;">
                    <a href="index.html" style="color:#1A1A1A; text-decoration:none; font-size:1.4rem; font-weight:700; transition:0.2s;">🏠 Home Base</a>
                    <a href="apod.html" style="color:#1A1A1A; text-decoration:none; font-size:1.4rem; font-weight:700; transition:0.2s;">🌌 NASA APOD</a>
                    <a href="news.html" style="color:#1A1A1A; text-decoration:none; font-size:1.4rem; font-weight:700; transition:0.2s;">📡 Spaceflight News</a>
                </div>
            `);
        });
    }

    // 2. Search
    const btnSearch = document.getElementById('btn-search');
    if(btnSearch) {
        btnSearch.addEventListener('click', () => {
            openModal("Deep Space Scan", `
                <div style="display:flex; flex-direction:column; gap:15px; margin-top:10px;">
                    <p style="text-align:left; font-size:0.9rem;">What are you looking for?</p>
                    <div style="display:flex; gap:10px;">
                        <input type="text" placeholder="Ex: Andromeda Galaxy..." style="flex:1; padding:12px; border-radius:10px; border:1px solid #ccc; font-family:'Outfit'; font-size:1rem; outline:none;">
                        <button style="background:#196D69; color:white; border:none; padding:0 20px; border-radius:10px; font-weight:bold; cursor:pointer;">Scan</button>
                    </div>
                </div>
            `);
        });
    }

    // 3. Play Button (ISS Live Stream)
    const btnPlay = document.getElementById('btn-play');
    if(btnPlay) {
        btnPlay.addEventListener('click', () => {
            openModal("ISS Live Tracking Feed", `
                <div style="margin-top:10px; border-radius:15px; overflow:hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
                    <!-- We use a standard NASA TV embed as a demonstration -->
                    <iframe width="100%" height="250" src="https://www.youtube.com/embed/21X5lGlDOfg?autoplay=1&mute=1" title="NASA Live Space feed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                </div>
            `);
        });
    }

    // 4. User Profile
    const btnUser = document.getElementById('btn-user');
    if(btnUser) {
        btnUser.addEventListener('click', () => {
            openModal("Cosmonaut Profile", `
                <div style="text-align:left; line-height:1.6; background:#f9f9f9; padding:20px; border-radius:15px;">
                    <div class="data-row"><span class="data-label">Callsign</span> <span class="data-value">Astro_01</span></div>
                    <div class="data-row"><span class="data-label">Role</span> <span class="data-value" style="font-weight:600;">Deep Space Recon</span></div>
                    <div class="data-row"><span class="data-label">Clearance</span> <span class="data-value">Level 5</span></div>
                    <div class="data-row"><span class="data-label">Status</span> <span class="data-value" style="color:#196D69;">🟢 Active</span></div>
                </div>
                <button style="margin-top:20px; width:100%; border:2px solid #1A1A1A; background:transparent; padding:10px; border-radius:30px; font-weight:bold; cursor:pointer;" onmouseover="this.style.background='#1A1A1A'; this.style.color='white';" onmouseout="this.style.background='transparent'; this.style.color='#1A1A1A';">Disconnect</button>
            `);
        });
    }

    // 5. Language Switcher
    const btnLang = document.getElementById('btn-lang');
    if(btnLang) {
        let currentLang = 'EN';
        btnLang.addEventListener('click', (e) => {
            currentLang = currentLang === 'EN' ? 'FR' : 'EN';
            const langTextContainer = btnLang.querySelector('.c-lang:last-child');
            if(langTextContainer) {
                langTextContainer.innerHTML = currentLang === 'EN' ? 'EN <span style="opacity:0.5">FR</span>' : '<span style="opacity:0.5">EN</span> FR';
            }
            
            // Swap some text
            const h1 = document.querySelector('.c-col-text h1');
            const p = document.querySelector('.c-col-text p');
            const discBtn = document.querySelector('.c-col-text .c-pill-outline');
            if(h1 && p) {
                if(currentLang === 'FR') {
                    h1.innerText = "Combler le fossé entre la Terre et l'humanité";
                    p.innerText = "Il propose un large éventail de contenus orientés vers le tourisme spatial, notamment des articles, des vidéos et des guides touristiques.";
                    discBtn.innerText = "Découvrir";
                } else {
                    h1.innerText = "Bridging the Gap between Earth and Humanity";
                    p.innerText = "It offers a wide range of content pointed to space tourism, including articles, videos and tour guides.";
                    discBtn.innerText = "Discover";
                }
            }
        });
        // Initial setup
        btnLang.querySelector('.c-lang:last-child').innerHTML = 'EN <span style="opacity:0.5">FR</span>';
    }

    // 6. Sidebar Image Nav
    const sidebarNavs = document.querySelectorAll('.sidebar-nav');
    const heroBg = document.querySelector('.c-hero-bg');
    if (sidebarNavs.length > 0 && heroBg) {
        const backgrounds = [
            heroBg.src, // First image is default
            "file:///C:/Users/jyoti/.gemini/antigravity/brain/d657d01e-36c0-4054-b7a5-7fcb292b7873/cosmos_jungle_1776193231508.png",
            "file:///C:/Users/jyoti/.gemini/antigravity/brain/d657d01e-36c0-4054-b7a5-7fcb292b7873/cosmos_landscape_1776193249044.png"
        ];
        // Ensure smooth transition
        heroBg.style.transition = "opacity 0.5s ease-in-out";
        
        sidebarNavs.forEach(nav => {
            nav.addEventListener('click', (e) => {
                sidebarNavs.forEach(n => n.classList.remove('active'));
                nav.classList.add('active');
                
                const index = parseInt(nav.getAttribute('data-index')) - 1;
                
                heroBg.style.opacity = 0;
                setTimeout(() => {
                    heroBg.src = backgrounds[index];
                    heroBg.style.opacity = 1;
                }, 500); // 500ms match transition
            });
            // basic hover
            nav.style.cursor = 'pointer';
            nav.addEventListener('mouseover', () => { if(!nav.classList.contains('active')) nav.style.opacity = 0.8; });
            nav.addEventListener('mouseout', () => nav.style.opacity = 1);
        });
    }

    // --- Bottom API Features ---
    
    // 1. ISS Tracker
    async function fetchISSData() {
        openModal("Live ISS Tracker", "<p>Connecting to International Space Station array...</p>");
        try {
            const res = await fetch("https://api.wheretheiss.at/v1/satellites/25544");
            const data = await res.json();
            openModal("Live ISS Tracker", `
                <div style="text-align: left; line-height: 1.5; margin-bottom: 15px;">
                    <div class="data-row"><span class="data-label">Latitude</span> <span class="data-value">${data.latitude.toFixed(4)}°</span></div>
                    <div class="data-row"><span class="data-label">Longitude</span> <span class="data-value">${data.longitude.toFixed(4)}°</span></div>
                    <div class="data-row"><span class="data-label">Altitude</span> <span class="data-value">${data.altitude.toFixed(2)} km</span></div>
                    <div class="data-row"><span class="data-label">Velocity</span> <span class="data-value">${parseFloat(data.velocity).toLocaleString()} km/h</span></div>
                </div>
                <div style="text-align:center; font-size: 2.5rem; margin-top:20px;">🌎🛰️</div>
            `);
        } catch (err) {
            openModal("Live ISS Tracker", "<p>Error loading ISS data. Please try again later.</p>");
        }
    }

    // 2. Mars Rover Photos
    async function fetchMarsRoverData() {
        openModal("Curiosity Mars Rover", "<p>Establishing connection with NASA Deep Space Network...</p>");
        try {
            const apiKey = "6y4glmP6O8heD7sb2EZzKtgnpRgf8uxVz5gxL4me";
            // Sol 1000 has great pictures
            const res = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${apiKey}`);
            const data = await res.json();
            if(data.photos && data.photos.length > 0) {
                // Select a random photo from the array
                const photo = data.photos[Math.floor(Math.random() * data.photos.length)];
                openModal("Surface of Mars", `
                    <div style="display:flex; flex-direction:column; gap: 15px;">
                        <img src="${photo.img_src}" style="width:100%; height: 200px; border-radius:15px; object-fit:cover; box-shadow: 0 5px 15px rgba(0,0,0,0.2);">
                        <div style="text-align:left;">
                            <div class="data-row"><span class="data-label">Camera</span> <span class="data-value">${photo.camera.name}</span></div>
                            <div class="data-row"><span class="data-label">Earth Date</span> <span class="data-value">${photo.earth_date}</span></div>
                        </div>
                    </div>
                `);
            } else {
                openModal("Surface of Mars", "<p>No photos received from Curiosity today.</p>");
            }
        } catch (err) {
            openModal("Surface of Mars", "<p>Error retrieving Mars data.</p>");
        }
    }

    // 3. Asteroid Tracker (NeoWs)
    async function fetchAsteroidData() {
        openModal("Asteroid Watch", "<p>Scanning local spacial sector for Near Earth Objects...</p>");
        try {
            const apiKey = "6y4glmP6O8heD7sb2EZzKtgnpRgf8uxVz5gxL4me";
            const today = new Date().toISOString().split('T')[0];
            const res = await fetch(`https://api.nasa.gov/neo/rest/v1/feed?start_date=${today}&end_date=${today}&api_key=${apiKey}`);
            const data = await res.json();
            
            const neos = data.near_earth_objects[today] || [];
            if(neos.length > 0) {
                // Find fastest or largest asteroid, or just use the first one
                const asteroid = neos[0];
                const velocityKmS = asteroid.close_approach_data[0].relative_velocity.kilometers_per_second;
                const missDistance = asteroid.close_approach_data[0].miss_distance.kilometers;
                
                openModal("Asteroid Approach", `
                    <div style="text-align: left; line-height: 1.5; margin-bottom: 15px;">
                        <div class="data-row"><span class="data-label">Name</span> <span class="data-value" style="font-weight:bold;">${asteroid.name}</span></div>
                        <div class="data-row"><span class="data-label">Max Target Size</span> <span class="data-value">${asteroid.estimated_diameter.meters.estimated_diameter_max.toFixed(0)} m</span></div>
                        <div class="data-row"><span class="data-label">Approach Velocity</span> <span class="data-value">${parseFloat(velocityKmS).toFixed(2)} km/s</span></div>
                        <div class="data-row"><span class="data-label">Miss Distance</span> <span class="data-value">${parseFloat(missDistance).toLocaleString()} km</span></div>
                    </div>
                    <div style="display:flex; justify-content:center; align-items:center; gap: 15px; margin-top:20px; font-weight:bold; font-size:1.1rem; color: ${asteroid.is_potentially_hazardous_asteroid ? '#e74c3c' : '#2ecc71'};">
                        ${asteroid.is_potentially_hazardous_asteroid ? "⚠️ HAZARDOUS" : "✅ CLEAR TRAJECTORY"} <span style="font-size:2rem;">☄️</span>
                    </div>
                `);
            } else {
                openModal("Asteroid Watch", "<p>Sector clear. No high-risk approaches detected today.</p>");
            }
        } catch (err) {
             openModal("Asteroid Watch", "<p>Network error: Unable to sweep sky.</p>");
        }
    }
});
