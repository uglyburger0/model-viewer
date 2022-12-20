// When we press space, toggle the header to be hidden or shown

// Get all of the classes
const orientations = document.getElementsByClassName("orientation");
const modelbutton = document.getElementById("insert-model") // <input> element
const axis = [
    "x",
    "y",
    "z"
]

// Whenever the orientation number changes
for (let i = 0; i < orientations.length; i++) {
    // Get the orientation element
    let orientationElement = document.getElementById("orientation-"+axis[i]);
    console.log(orientationElement)
    // When the element changes
    orientationElement.addEventListener("change", function(event) {
        console.log("CHANGED orientation-"+axis[i])
    });
}

// When the model button is clicked
modelbutton.addEventListener("change", function(event) {
    const target = event.target;
    const file = target.files[0];

    // If theres a file
    if (!file) {
        createNotification("No file selected", 1000);
        return;
    }

    const reader = new FileReader();

    // Get extension of file
    const extension = file.name.split('.').pop().toLowerCase();
    let objString;

    // Different reading depending on extension
    switch (extension) {
        case "stl":
            reader.readAsDataURL(file);
            break;
        case "obj":
            reader.readAsText(file); // read as text (which is base64)
            break;
        default:
            reader.readAsArrayBuffer(file);
            objString = reader.result;
            break;
    }

    // Get system path of file
    const filePath = file.name;
    console.log(file, filePath)
    
    reader.onload = () => {
        objString = reader.result;

        if (extension === "obj") {
            // Parse the OBJ file string manually
            var vertices = [];
            var normals = [];
            var uvs = [];
            var indices = [];

            // Split the OBJ file string into lines
            var lines = objString.split('\n');
            for (var i = 0; i < lines.length; i++) {
                var line = lines[i];
                var tokens = line.trim().split(' ');
                if (tokens.length === 0) continue;

                // Parse vertices
                if (tokens[0] === 'v') {
                    vertices.push(parseFloat(tokens[1]));
                    vertices.push(parseFloat(tokens[2]));
                    vertices.push(parseFloat(tokens[3]));
                }

                // Parse normals
                if (tokens[0] === 'vn') {
                    normals.push(parseFloat(tokens[1]));
                    normals.push(parseFloat(tokens[2]));
                    normals.push(parseFloat(tokens[3]));
                }

                // Parse texture coordinates
                if (tokens[0] === 'vt') {
                    uvs.push(parseFloat(tokens[1]));
                    uvs.push(parseFloat(tokens[2]));
                }

                // Parse faces
                if (tokens[0] === 'f') {
                // OBJ files use 1-based indices
                    indices.push(parseInt(tokens[1]) - 1);
                    indices.push(parseInt(tokens[2]) - 1);
                    indices.push(parseInt(tokens[3]) - 1);
                }
            }

            // Create a geometry from the parsed data
            var geometry = new THREE.BufferGeometry();
            geometry.setIndex(indices);
            geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
            geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
            geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
            // Do function
            LoadMesh(filePath, geometry);
        } else {
            LoadMesh(filePath, objString);
        }
    };
});