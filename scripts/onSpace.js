// When we press space, toggle the header to be hidden or shown

// Get the header element
var header = document.getElementById("header");

// When we press space
document.addEventListener("keydown", function(event) {
    // If the key is space
    if (event.code === "Space") {
        console.log("SPACE")
        // Toggle the header
        header.style.display = header.style.display === "none" ? "flex" : "none";
    }
});