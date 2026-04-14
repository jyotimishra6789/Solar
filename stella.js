// Global Menu Toggle
function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.classList.toggle('active');
}

// Home Page Animations
function initHomeAnimations() {
    if (!document.querySelector('.hero-section')) return;

    const tl = gsap.timeline();

    // Fade in Header
    tl.from("header", {
        y: -30,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    });

    // Fade in Hero Content
    tl.from(".hero-content *", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power2.out"
    }, "-=0.4");

    // Float planets in
    tl.from(".planet-wrapper", {
        y: 60,
        opacity: 0,
        scale: 0.8,
        duration: 1.2,
        stagger: 0.2,
        ease: "elastic.out(1, 0.7)"
    }, "-=0.6");

    // Continuous floating animation
    gsap.to(".planet-wrapper.earth", { y: -20, duration: 4, yoyo: true, repeat: -1, ease: "sine.inOut" });
    gsap.to(".planet-wrapper.sun", { y: -15, duration: 5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 1 });
    gsap.to(".planet-wrapper.moon", { y: -25, duration: 3.5, yoyo: true, repeat: -1, ease: "sine.inOut", delay: 0.5 });
    
    // Slow earth rotation
    gsap.to(".earth-img", { rotation: 360, duration: 120, repeat: -1, ease: "linear" });
}

// APOD Page Logic
function fetchAPOD() {
    const apiKey = "6y4glmP6O8heD7sb2EZzKtgnpRgf8uxVz5gxL4me";
    const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loader').style.display = 'none';
            document.getElementById('apod-content').style.display = 'flex';

            document.getElementById('title').textContent = data.title;
            document.getElementById('date').textContent = data.date;
            document.getElementById('explanation').textContent = data.explanation;

            const mediaContainer = document.getElementById('media-container');
            const bgImage = document.getElementById('apod-bg');

            if (data.media_type === "image") {
                mediaContainer.innerHTML = `<img id="pic" class="apod-media" src="${data.hdurl || data.url}" alt="NASA APOD">`;
                bgImage.src = data.hdurl || data.url;
                bgImage.style.opacity = 0.3;
            } else if (data.media_type === "video") {
                mediaContainer.innerHTML = `<iframe class="apod-media" src="${data.url}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`;
            }

            // Animate card in
            gsap.to("#apod-card", {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: "power3.out"
            });
        })
        .catch(err => {
            document.getElementById('loader').innerHTML = `<p style="color:red;">Failed to retrieve APOD. Please try again later.</p>`;
            console.error("APOD Error:", err);
        });
}

// News Page Logic
function fetchNews() {
    const backupUrl = "https://api.spaceflightnewsapi.net/v4/articles/?limit=9";

    fetch(backupUrl)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loader').style.display = 'none';
            const container = document.getElementById('news-container');
            container.style.display = 'grid';

            data.results.forEach((article, index) => {
                const dateObj = new Date(article.published_at);
                const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                
                const card = document.createElement('a');
                card.href = article.url;
                card.target = "_blank";
                card.className = "news-card";
                card.style.opacity = 0;
                card.style.transform = "translateY(30px)";

                card.innerHTML = `
                    <img src="${article.image_url || 'bg1 (1).jpg'}" alt="News Image" class="news-image" onerror="this.src='sky.png'">
                    <div class="news-content">
                        <span class="news-source">${article.news_site}</span>
                        <h2 class="news-title">${article.title}</h2>
                        <p class="news-summary">${article.summary}</p>
                        <div class="news-footer">
                            <span>${formattedDate}</span>
                            <span class="read-more">Read More →</span>
                        </div>
                    </div>
                `;
                container.appendChild(card);
                
                // Animate Staggered Cards In
                gsap.to(card, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.1 * index,
                    ease: "power2.out"
                });
            });
        })
        .catch(err => {
            document.getElementById('loader').innerHTML = `<p style="color:red;">Failed to load Space News.</p>`;
            console.error("News Error:", err);
        });
}

// Init Home animations on load if we are on the homepage
if (document.querySelector('.hero-section')) {
    window.addEventListener('load', initHomeAnimations);
}
