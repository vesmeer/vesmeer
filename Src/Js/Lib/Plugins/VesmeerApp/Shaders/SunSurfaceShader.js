define(
    [
        "THREE", "Core/Unit"
    ],
    function(THREE, Unit) {

        SunSurfaceShader = {

            uniforms: {
                radius: {
                    type: "f",
                    value: 0.0
                },
                surfaceTexture: {
                    type: "t", 
                    value: THREE.ImageUtils.loadTexture(
                        'Assets/VesmeerApp/Textures/2-stereoreache.jpg')
                },
                time: {
                    type: "f", 
                    value: 0.0 
                }
            },
            
            vertexShader: [
                //switch on high precision floats
                "#ifdef GL_ES",
                "precision highp float;",
                "#endif",

                "varying vec2 vUv;",
                "uniform float time;",

                "void main() {",
                    "vUv = uv;",
                    "gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);",
                "}"
            ].join("\n"),

            fragmentShader: [
                //switch on high precision floats
                "#ifdef GL_ES",
                "precision highp float;",
                "#endif",

                "varying vec2 vUv;",
                "uniform sampler2D surfaceTexture;",

                "void main() {",
                    "vec4 texel = texture2D(surfaceTexture, vUv);",
                    "vec3 color = vec3(texel[0], texel[1], texel[2]);",
                    "float alpha = texel[3];",
                    "gl_FragColor = vec4(color, alpha);",
                "}"
            ].join("\n")
        }

        return (SunSurfaceShader);
    }
);
