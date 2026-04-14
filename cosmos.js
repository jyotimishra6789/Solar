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

    // --- API Features ---
    
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
