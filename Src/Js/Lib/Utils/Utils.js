define(
    [
        "Core/Scene",
    ],
    
    function(Scene) {

        function Utils() {}

        /**
         * Returns a clone (deep copy) of the obj object.
         */
        Utils.deepCopy = function(obj) {
            return jQuery.extend(true, {}, obj);
        }

        /**
         * Creates and adds to the HTML header a <link/> element tag linking 
         * to the given CSS file and assigns it the given id, which must be
         * unique.
         */
        Utils.addCssFileToHtmlHeader = function(id, url) {
            var link = document.createElement("link");
            link.id = id; 
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        }

        /**
         * Returns true if the two Vector3 vectors's components differ 
         * by amount lower or equal to the maxDiff value.
         */
        Utils.vectorsDiffLessThan = function(vec3a, vec3b, maxDiff) {
            return (Math.abs(vec3a.x - vec3b.x) <= maxDiff) &&
                    (Math.abs(vec3a.y - vec3b.y) <= maxDiff) &&
                    (Math.abs(vec3a.z - vec3b.z) <= maxDiff);
        }

        return (Utils);
    }
);
