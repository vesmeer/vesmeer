define(
    [
        "THREE", 
        "Core/Unit"
    ],

    function(THREE, Unit) {

        /**
         * Implements ephemeris data calculations. Based on:
         * http://www.stargazing.net/kepler/ellipse.html
         */
        function Ephemeris() {}

        /**
         * The "day number" from 2000 Jan 0.0 TDT, which is the same as 1999 
         * Dec 31.0 TDT, i.e. precisely at midnight TDT at * the start of 
         * the last day of the 20th century.
         */
        Ephemeris.getDayNumberFromJD = function(julianDay) {
            return julianDay - 2451545.0;
        }

        /**
         * Returns the Modified Julian Day computed from the given Julian Day.
         */
        Ephemeris.getMJDFromJD = function(julianDay) {
            return julianDay - 2400000.5;
        }

        /**
         * Same as getDayNumberFromJD(), but computed from the given modified
         * Julian day.
         */
        Ephemeris.getDayNumberFromMJD = function(modifiedJulianDay) {
            return modifiedJulianDay - 51544.5;
        }

        Ephemeris.checkDateValidity = function(value, min, max, msg) {
            msg = msg + " field has invalid data: " + value;
            var str = value;
            for (var i = 0; i < str.length; i++) {
                var ch = str.substring(i, i + 1)
                if ((ch < "0" || "9" < ch) && ch != '.') {
                    alert(msg);
                    return false;
                }
            }
            var num = parseFloat(str)
            if (num < min || max <= num) {
                alert(msg + " not in range [" + min + ".." + max + "]");
                return false;
            }
            value = str;

            return true;
        }

        function MakeArray(size) {
            this.length = size;
            for(var i = 1; i <= size; i++) {
                this[i] = 0;
            }
            
            return this;
        }

        Ephemeris.monthLength = function(month, leap) {
            monthLengthArray = new MakeArray(12);
            monthLengthArray[1] = 32;
            monthLengthArray[2] = 29 + leap;
            monthLengthArray[3] = 32;
            monthLengthArray[4] = 31;
            monthLengthArray[5] = 32;
            monthLengthArray[6] = 31;
            monthLengthArray[7] = 32;
            monthLengthArray[8] = 32;
            monthLengthArray[9] = 31;
            monthLengthArray[10] = 32;
            monthLengthArray[11] = 31;
            monthLengthArray[12] = 32;

            return monthLengthArray[month];
        }

        /**
         * Same as getDayNumberFromJD(), but computed from the given datetime.
         * Not guaranteed to work for dates prior to 1582.
         * Source: http://quasar.as.utexas.edu/BillInfo/JulianDateCalc.html
         * Checked against: http://aa.usno.navy.mil/data/docs/JulianDate.php
         */
        Ephemeris.getJDFromDateTime = function(year, month, 
                day, hour, minute, second) {
            var leap = (
                (year % 4 == 0) ? 1 :
                (year % 4 != 0 ? 0 : 
                (year % 400 == 0 ? 1:
                (year % 100 == 0 ? 0:
                1)))
            );
            if (!this.checkDateValidity(month, 1, 13, "Month") ||
                    !this.checkDateValidity(day, 1, this.monthLength(
                        parseFloat(month), leap), "Day") ||
                    !this.checkDateValidity(year, 1,1000000, "Year")) {
                return "Invalid";
            }
            var D = eval(day);
            var M = eval(month);
            var Y = eval(year);
            if (M < 3) {
                Y--;
                M += 12;
            }
            var A = Math.floor(Y / 100);
            var B = Math.floor(A / 4);
            var C = 2 - A + B;
            var E = Math.floor(365.25 * (Y + 4716));
            var F = Math.floor(30.6001 * (M + 1));
            var julianday = C + eval(D) + E + F - 1524.5;
            julianday += (hour + (minute / 60) + (second / 3600)) / 24;

            return julianday.toFixed(6);
        }

        /**
         * Returns the degrees expressed as the equivalent angle in the 
         * range from 0 to 360 degrees. 
         */
        Ephemeris.clampTo360 = function(degrees) {
            if (degrees < 0) {
                degrees = (Math.abs(degrees) % 360) * (-1);
                degrees += 360;
            }
            if (degrees > 360) degrees = degrees % 360;

            return degrees;
        }

        /**
         * Returns the mean anomaly of the planet.
         *
         * @param n Daily motion [degrees].
         * @param d Number of days since the day of elements.
         * @param L Mean longitude [degrees].
         * @param p Longitude of perihelion [degrees].
         * @return Degrees (0-360).
         */
        Ephemeris.getMeanAnomaly = function(n, d, L, p) {
            var M = n * d + L - p;
            M = this.clampTo360(M);

            return M;
        }

        /**
         * Returns the true anomaly from the mean anomaly and eccentricity
         * of the orbiting body.
         *
         * @param M Mean anomaly [degrees].
         * @param e Eccentricity.
         * @return Degrees (0-360).
         */
        Ephemeris.getTrueAnomaly = function(M, e) {
            var v = M + 180 / Math.PI * [
                (2 * e - Math.pow(e, 3) / 4) * Math.sin(M * Math.PI / 180) 
                + 5 / 4 * Math.pow(e, 2) * Math.sin(2 * M * Math.PI / 180)
                + 13 / 12 * Math.pow(e, 3) * Math.sin(3 * M * Math.PI / 180)
            ];

            return v;
        }

        /**
         * Returns magnitude of the vector from the orbiting body to 
         * the focus of the ellipse.
         *
         * @param a Semi-major axis [AU].
         * @param e Eccentricity.
         * @param v True anomaly [degrees].
         * @return Float [AU].
         */
        Ephemeris.findRadius = function(a, e, v) {
            v *= Math.PI / 180;
            var r = a * (1 - Math.pow(e, 2)) / (1 + e * Math.cos(v));

            return r;
        }

        /**
         * Returns the mean longitude (M + w + W) in degrees.
         *
         * @param M Mean anomaly [degrees].
         * @param 0 Longitude of ascending node [degrees].
         * @param W Argument of perifocus [degrees].
         * @return Degrees.
         */
        Ephemeris.findMeanLongitude = function(M, w, W) {
            var L = M + w + W;
            L = this.clampTo360(L);

            return L;
        }

        /**
         * Returns the longitude of perihelion in degrees.
         * 
         * @param w Argument of perifocus [degrees].
         * @param W Longitude of ascending node [degrees].
         * @return Degrees.
         */
        Ephemeris.findLongitudeOfPerihelion = function(w, W) {
            var p = w + W;
            p = this.clampTo360(p);

            return p;
        }

        /**
         * Returns the heliocentric coordinates of the orbiting body.
         *
         * @param r Planet's radius vector [AU].
         * @param o Longitude of ascending node [degrees].
         * @param p Longitude of perihelion [degrees].
         * @param i Inclination of the orbital plane [degrees].
         * @return [x, y, z] coordinates.
         */
        Ephemeris.findHeliocentricPosition = function(r, o, p, v, i) {
            o *= Math.PI / 180;
            p *= Math.PI / 180;
            v *= Math.PI / 180;
            i *= Math.PI / 180;
            var X = r * [Math.cos(o) * Math.cos(v + p - o) - 
                Math.sin(o) * Math.sin(v + p - o) * Math.cos(i)];
            var Z = -1 * r * [Math.sin(o) * Math.cos(v + p - o) + 
                Math.cos(o) * Math.sin(v + p - o) * Math.cos(i)];
            var Y = r * [Math.sin(v + p - o) * Math.sin(i)];

            return [X, Y, Z];
        }

        /**
         * Returns the heliocentric position of the celestial body
         * computed from the given orbital elements and on the given day.
         *
         * @param bodyOrbitalElements Celestial body orbital elements.
         * @param dayOfPosition Date for which to compute the position.
         * @return THREE.Vector3 in units of km.
         */
        Ephemeris.getHelicentricPosition = function(bodyOrbitalElements, dateOfPosition) {
            dayOfElements = this.getDayNumberFromJD(
                this.getJDFromDateTime(
                    bodyOrbitalElements.date.year, 
                    bodyOrbitalElements.date.month, 
                    bodyOrbitalElements.date.day, 
                    0, 
                    0, 
                    0
                )
            );

            dayOfPosition = this.getDayNumberFromJD(
                this.getJDFromDateTime(
                    dateOfPosition.year,
                    dateOfPosition.month,
                    dateOfPosition.day,
                    0, 
                    0, 
                    0
                )
            );
                
            // Number of days after the day of elements.
            d = dayOfPosition - dayOfElements;

            // Mean anomaly.
            M = this.getMeanAnomaly(
                bodyOrbitalElements.n,
                d, 
                bodyOrbitalElements.L, 
                this.findLongitudeOfPerihelion(
                    bodyOrbitalElements.w,
                    bodyOrbitalElements.W
                )
            );

            // True anomaly.
            v = this.getTrueAnomaly(M, bodyOrbitalElements.e);

            // Distance from the celestial body to its orbit ellipse focus.
            r = this.findRadius(
                bodyOrbitalElements.a, 
                bodyOrbitalElements.e, 
                v
            )

            helioCentricCoords = this.findHeliocentricPosition(
                r,
                bodyOrbitalElements.W, 
                this.findLongitudeOfPerihelion(
                    bodyOrbitalElements.w,
                    bodyOrbitalElements.W
                ), 
                v, 
                bodyOrbitalElements.i
            );

            return new THREE.Vector3(
                Unit.dist(Unit.convertAUTo(
                    helioCentricCoords[0], Unit.UNIT_KM)), 
                Unit.dist(Unit.convertAUTo(
                    helioCentricCoords[1], Unit.UNIT_KM)), 
                Unit.dist(Unit.convertAUTo(
                    helioCentricCoords[2], Unit.UNIT_KM))
            );
        }

        return (Ephemeris);
    }
);
