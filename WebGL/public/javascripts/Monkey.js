
// Using the "import/obj" node to import a duck mesh from .OBJ format
// Internally, the node uses the K3D library for parsing - http://k3d.ivank.net/

// Point SceneJS to the bundled plugins
SceneJS.setConfigs({
    pluginPath: "../api/latest/plugins"
});

// Create a scene
SceneJS.createScene({
    nodes: [

        // Mouse-orbited camera,
        // implemented by plugin at http://scenejs.org/api/latest/plugins/node/cameras/orbit.js
        {
            type: "cameras/orbit",
            yaw: -40,
            pitch: -20,
            zoom: 60,
            zoomSensitivity: 10.0,

            nodes: [

                // Blue material
                {
                    type: "material",
                    color: { r: 0.6, g: 0.6, b: 1.0 },

                    nodes: [

                        // Import the .OBJ mesh
                        //
                        // This node is implemented by plugin at:
                        // http://scenejs.org/api/latest/plugins/node/import/obj.js
                        //
                        //
                        // The OBJ file is loaded from:
                        // http://scenejs.org/examples/models/obj/duck.obj

                        {
                            type: "import/obj",
                            src: "models/obj/duck.obj"
                        }

                    ]
                }
            ]
        }
    ]
}
);