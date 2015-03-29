define(
    [
        "THREE", "Core/Unit"
    ],
    function(THREE, Unit) {
        SunHaloShader = {

            uniforms: {
                radius: {
                    type: "f",
                    value: 0.0
                },
            },
            
            vertexShader: [
                //switch on high precision floats
                "#ifdef GL_ES",
                "precision highp float;",
                "#endif",

                "varying vec3 vNormal;",
                "uniform float time;",

                "void main() {",
                    "vNormal = normalize(normalMatrix * normal);",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
                "}"
            ].join("\n"),

            fragmentShader: [
                //switch on high precision floats
                "#ifdef GL_ES",
                "precision highp float;",
                "#endif",

                "varying vec3 vNormal;",

                "void main() {",
                    "float intensity = pow(0.2 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.9);",
                    "gl_FragColor = vec4(1.0 * intensity, 1.0 * intensity, 0.0, 1.0 * intensity);",
                "}"
            ].join("\n")
        }

        return (SunHaloShader);
    }
);
