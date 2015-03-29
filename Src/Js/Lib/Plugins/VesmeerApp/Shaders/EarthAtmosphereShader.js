define(
    [
        "THREE", "Core/Unit"
    ],
    function(THREE, Unit) {
        EarthAtmosphereShader = {

            uniforms: {
                planetRadius: {
                    type: "f",
                    value: Unit.dist(6378.0)
                },
                glowColor: {
                    type: "c", 
                    value: new THREE.Color(0x69A0FF)
                },
                viewVector: { 
                    type: "v3", 
                    value: new THREE.Vector3(0, 0, 0) 
                },
                lightVector: {
                    type: "v3",
                    value: new THREE.Vector3(0, 0, 0)
                }
            },
            
            vertexShader: [
                //switch on high precision floats
                "#ifdef GL_ES",
                "precision highp float;",
                "#endif",

                "uniform float planetRadius;",
                "uniform vec3 viewVector;",
                "uniform vec3 lightVector;",
                "uniform vec3 planetVector;",
                "varying float intensity;",

                "void main() {",
                    "float PI = 3.14159265358979323846264;",
                    "vec3 vNormal = normalize(normalMatrix * normal);",
                    "vec3 vView = normalize(normalMatrix * viewVector);",
                    "vec3 vLight = normalize(normalMatrix * lightVector);",
                    "float viewDistrib = dot(vNormal, vView);",
                    "float lightDistrib = dot(vNormal, vLight);",
                    "float viewPlanetDistance = length(viewVector);",
                    "intensity = pow(1.0 - viewDistrib, viewPlanetDistance / planetRadius / 1.5);",
                    // On the dark side, show the atmosphere halo only near
                    // the horizon bordering with the lit side.
                    "if (lightDistrib < 0.0) {",
                        "intensity = max(intensity + lightDistrib, 0.0);",
                    "}",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
                "}"
            ].join("\n"),

            fragmentShader: [
                //switch on high precision floats
                "#ifdef GL_ES",
                "precision highp float;",
                "#endif",

                "uniform vec3 glowColor;",
                "varying float intensity;",
                "void main() {",
                    "gl_FragColor = vec4(glowColor, intensity);",
                "}"
            ].join("\n")
        }

        return (EarthAtmosphereShader);
    }
);
