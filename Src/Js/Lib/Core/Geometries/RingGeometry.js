define(["THREE"], 

    function(THREE) {

        /**
         * Implementation of WebGL ring structure geometry. It's used mainly
         * for the implementation of planet rings.
         */
        function RingGeometry(innerRadius, outerRadius, thetaSegments) {
            THREE.Geometry.call(this);

            var normal  = new THREE.Vector3( 0, 0, 1 )

            for (var i = 0; i < thetaSegments; i++) {
                var angleLo = (i / thetaSegments) * Math.PI * 2;
                var angleHi = ((i + 1) / thetaSegments) * Math.PI * 2;

                var vertex1 = new THREE.Vector3(
                    innerRadius * Math.cos(angleLo), 
                    innerRadius * Math.sin(angleLo), 
                    0
                );
                var vertex2 = new THREE.Vector3(
                    outerRadius * Math.cos(angleLo), 
                    outerRadius * Math.sin(angleLo), 
                    0
                );
                var vertex3 = new THREE.Vector3(
                    innerRadius * Math.cos(angleHi), 
                    innerRadius * Math.sin(angleHi), 
                    0
                );
                var vertex4 = new THREE.Vector3(
                    outerRadius * Math.cos(angleHi), 
                    outerRadius * Math.sin(angleHi), 
                    0
                );

                this.vertices.push(vertex1);
                this.vertices.push(vertex2);
                this.vertices.push(vertex3);
                this.vertices.push(vertex4);
                
                var vertexIdx = i * 4;

                // Create the first triangle
                var face = new THREE.Face3(vertexIdx + 0, vertexIdx + 1, 
                    vertexIdx + 2, normal);
                var uvs = [];

                var uv = new THREE.Vector2(0, 0);
                uvs.push(uv);
                var uv = new THREE.Vector2(1, 0);
                uvs.push(uv);
                var uv = new THREE.Vector2(0, 1);
                uvs.push(uv);

                this.faces.push(face);
                this.faceVertexUvs[0].push(uvs);

                // Create the second triangle
                var face = new THREE.Face3(vertexIdx + 2, vertexIdx + 1, 
                    vertexIdx + 3, normal);
                var uvs = []

                var uv = new THREE.Vector2(0, 1);
                uvs.push(uv);
                var uv = new THREE.Vector2(1, 0);
                uvs.push(uv);
                var uv = new THREE.Vector2(1, 1);
                uvs.push(uv);

                this.faces.push(face);
                this.faceVertexUvs[0].push(uvs);
            }

            this.computeFaceNormals();
            this.boundingSphere = new THREE.Sphere(
                new THREE.Vector3(), outerRadius);
        }

        RingGeometry.prototype = Object.create(THREE.Geometry.prototype);

        return (RingGeometry);
    }
);
