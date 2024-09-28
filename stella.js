var firstclick = 0;

function trig() {
    var menu = document.getElementsByClassName("menu")[0];

    if (firstclick === 0) {
        console.log("Opening menu...");
        menu.style.display = "flex";
        tl.from(".menu",{
            y:-20,
            opacity:0,
            stagger:0.3,
            duation:1,
        
        });
        firstclick = 1;
    } else {
        console.log("Closing menu...");
        menu.style.display = "none";
        firstclick = 0;
    }
}

// Initialize GSAP timeline
// Initialize GSAP timeline
const tl = gsap.timeline();

// Animation for .material-symbols-outlined and .stela
tl.from(".material-symbols-outlined", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    delay: 1
}).from(".stela", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    delay: 0.5
}, "-=0.5");

// Animation for .heading
tl.from(".heading", {
    y: -20,
    opacity: 0,
    duration: 0.5,
    delay: 1
});

// Animation to rotate the earth element from opacity 0 to rotation 30 degrees
tl.from(".earth", {
    opacity: 0,
    duration: 0.5,
    delay: 1
}).to(".earth", {
    rotation: 30,
    duration: 1,
    ease: "power2.out"
}).from(".moon", {
    opacity: 0,
    duration: 0.5,
    delay: 0.5
}).from(".sun", {
    opacity: 0,
    duration: 0.5,
    delay: 0.5
}, "-=0.5");

// Example XMLHttpRequest to fetch data from NASA APOD API
var req = new XMLHttpRequest();
var url = "https://api.nasa.gov/planetary/apod";
var api_key = "6y4glmP6O8heD7sb2EZzKtgnpRgf8uxVz5gxL4me";

req.open("GET", url + "?api_key=" + api_key);
req.send();

req.addEventListener("load", function(){
    if (req.status == 200 && req.readyState == 4) {
        var response = JSON.parse(req.responseText);
        console.log("API Response:", response); // Log the response for debugging
        document.getElementById("title").textContent = response.title;
        document.getElementById("date").textContent = response.date;
        document.getElementById("pic").src = response.hdurl;
        document.getElementById("explanation").textContent = response.explanation;
    } else {
        console.error("Error fetching APOD:", req.status, req.statusText); // Log any errors
    }
});

