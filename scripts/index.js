let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 45, window.innerWidth/window.innerHeight, 0.02, 5000 );

let renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

renderer.setClearColor("#050505", 0) // Set background color (should be transparent)
renderer.render(scene, camera); // Render the scene

const controls = new THREE.OrbitControls(camera, renderer.domElement);

let material = new THREE.MeshMatcapMaterial({
    color: "#ff0"
});
// Variables for the model (these will be reused)
const clock = new THREE.Clock();
let mesh;
let box;
let boxCenter = new THREE.Vector3;
let boxSize = new THREE.Vector3;
let dist;

function createNotification(text, length) {
    length = length || 2000; // Default length is 2 seconds
    // Create class
    const notification = document.createElement("div");
    notification.classList.add("notification");
    notification.innerHTML = `<h2>${text}</h2>`;
    // Add the notification to the header
    document.getElementById("header").appendChild(notification);
    setTimeout(function() {
        notification.remove();
    }, length);
}

function animate() {
    requestAnimationFrame( animate ); // Every animation frame, it calls on "animate" again

    controls.update(); // Update the controls

    renderer.render( scene, camera );
};

function OnMeshFailed(error) {
    createNotification("Unable to parse mesh");
    console.log(error);
}

function OnMeshLoading(xhr) {
    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
}

function OnMeshLoaded(geometry) {
    createNotification("Mesh successfully loaded");
    // Load and add mesh to scene
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Load the geometry
    mesh.geometry.computeBoundingBox();

    // Calculate the dimension of the model
    box = new THREE.Box3();
    box.setFromObject(mesh);

    // Get the distance needed to fit the model
    const size = box.getSize(boxSize);
    dist = size.length() * 1.5;

    // Update camera
    controls.target = box.getCenter(boxCenter);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 15;
    camera.position.copy(new THREE.Vector3(dist, size.y/.8, dist)).setLength(dist);
    camera.updateProjectionMatrix();
}

function LoadMesh(fileName, data) {
    console.log("Function 'LoadMesh' activated")
    camera.position.set(0, 0, 20);
    // Remove any existing mesh
    if (mesh) {
        scene.remove(mesh);
    }
    //loader.load(arrayBuffer, OnMeshLoaded);
    const extension = fileName.split('.').pop().toLowerCase(); // Get the extension of the file
    try {
        console.log(data)
	    switch (extension) {
	        case 'stl':
                new THREE.STLLoader().load(data, OnMeshLoaded, OnMeshLoading, OnMeshFailed);
	            break;
            case 'obj': 
                OnMeshLoaded(data);
	            break;
	        case 'fbx':
                createNotification("FBX is not supported yet");
	            break;
	        case 'gltf':
	            break;
	        default:
	            createNotification("This file type is not supported.");
	            break;
	    }
    } catch (error) {
        // Show error
        createNotification("Could not load file.");
        console.log(error);
    }
}

animate();