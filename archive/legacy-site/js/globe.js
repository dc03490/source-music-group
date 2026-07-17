/* Rotating wireframe dotted globe — vanilla D3 + Canvas.
   Ported from a React/shadcn component to plain JS so it drops into this
   no-build static site. Requires d3 v7 (loaded via CDN before this file).

   Usage: add <canvas data-globe></canvas> and this script. Options come from
   data-* attributes:
     data-stroke        outline/graticule color   (default #ffffff)
     data-dot           halftone dot color        (default #999999)
     data-ocean         globe fill                (default transparent)
     data-stroke-alpha  0..1 outline opacity      (default 0.9)
     data-dot-alpha     0..1 dot opacity          (default 0.9)
     data-speed         degrees per frame         (default 0.3)
     data-density       dot spacing (higher = fewer dots, default 20)
     data-interactive   present = drag to rotate + scroll to zoom
*/
(function () {
  "use strict";
  if (typeof d3 === "undefined") return; // d3 CDN failed — skip silently

  var GEO_URL = "assets/ne_110m_land.json";
  var landPromise = null;
  function loadLand() {
    if (!landPromise) landPromise = fetch(GEO_URL).then(function (r) {
      if (!r.ok) throw new Error("geojson " + r.status);
      return r.json();
    });
    return landPromise;
  }

  function pointInPolygon(point, polygon) {
    var x = point[0], y = point[1], inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      var xi = polygon[i][0], yi = polygon[i][1];
      var xj = polygon[j][0], yj = polygon[j][1];
      if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
    }
    return inside;
  }

  function pointInFeature(point, feature) {
    var g = feature.geometry;
    if (g.type === "Polygon") {
      var c = g.coordinates;
      if (!pointInPolygon(point, c[0])) return false;
      for (var i = 1; i < c.length; i++) if (pointInPolygon(point, c[i])) return false;
      return true;
    } else if (g.type === "MultiPolygon") {
      for (var p = 0; p < g.coordinates.length; p++) {
        var poly = g.coordinates[p];
        if (pointInPolygon(point, poly[0])) {
          var inHole = false;
          for (var h = 1; h < poly.length; h++) { if (pointInPolygon(point, poly[h])) { inHole = true; break; } }
          if (!inHole) return true;
        }
      }
      return false;
    }
    return false;
  }

  function generateDots(feature, spacing) {
    var dots = [];
    var bounds = d3.geoBounds(feature);
    var minLng = bounds[0][0], minLat = bounds[0][1], maxLng = bounds[1][0], maxLat = bounds[1][1];
    var step = spacing * 0.08;
    for (var lng = minLng; lng <= maxLng; lng += step) {
      for (var lat = minLat; lat <= maxLat; lat += step) {
        if (pointInFeature([lng, lat], feature)) dots.push([lng, lat]);
      }
    }
    return dots;
  }

  function num(v, d) { var n = parseFloat(v); return isNaN(n) ? d : n; }

  function initGlobe(canvas) {
    var ds = canvas.dataset;
    var opts = {
      stroke: ds.stroke || "#ffffff",
      dot: ds.dot || "#999999",
      ocean: ds.ocean || "transparent",
      strokeAlpha: num(ds.strokeAlpha, 0.9),
      dotAlpha: num(ds.dotAlpha, 0.9),
      speed: num(ds.speed, 0.3),
      density: num(ds.density, 20),
      interactive: canvas.hasAttribute("data-interactive")
    };

    var context = canvas.getContext("2d");
    if (!context) return;

    var W, H, radius, projection, path, baseRadius;
    var rotation = [0, 0];
    var autoRotate = true;
    var landFeatures = null;
    var allDots = [];

    function size() {
      var rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      radius = Math.min(W, H) / 2.2;
      baseRadius = radius;
      var dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!projection) {
        projection = d3.geoOrthographic().clipAngle(90);
        path = d3.geoPath().projection(projection).context(context);
      }
      projection.scale(radius).translate([W / 2, H / 2]);
    }

    function render() {
      context.clearRect(0, 0, W, H);
      var scale = projection.scale();
      var sf = scale / baseRadius;

      // Ocean disk
      context.beginPath();
      context.arc(W / 2, H / 2, scale, 0, 2 * Math.PI);
      if (opts.ocean !== "transparent") { context.fillStyle = opts.ocean; context.fill(); }
      context.strokeStyle = opts.stroke;
      context.globalAlpha = opts.strokeAlpha;
      context.lineWidth = 1.5 * sf;
      context.stroke();

      if (landFeatures) {
        // Graticule
        context.beginPath();
        path(d3.geoGraticule()());
        context.lineWidth = 1 * sf;
        context.globalAlpha = opts.strokeAlpha * 0.28;
        context.stroke();

        // Land outlines
        context.beginPath();
        for (var i = 0; i < landFeatures.features.length; i++) path(landFeatures.features[i]);
        context.globalAlpha = opts.strokeAlpha;
        context.lineWidth = 1 * sf;
        context.stroke();

        // Halftone dots
        context.fillStyle = opts.dot;
        context.globalAlpha = opts.dotAlpha;
        for (var d = 0; d < allDots.length; d++) {
          var pr = projection(allDots[d]);
          if (pr && pr[0] >= 0 && pr[0] <= W && pr[1] >= 0 && pr[1] <= H) {
            context.beginPath();
            context.arc(pr[0], pr[1], 1.2 * sf, 0, 2 * Math.PI);
            context.fill();
          }
        }
      }
      context.globalAlpha = 1;
    }

    size();
    render();

    loadLand().then(function (data) {
      landFeatures = data;
      data.features.forEach(function (f) {
        generateDots(f, opts.density).forEach(function (pt) { allDots.push(pt); });
      });
      render();
    }).catch(function () { /* leave the bare sphere on failure */ });

    // Only spin/redraw while on-screen — saves CPU/battery when scrolled away
    // and keeps two globes on one page cheap.
    var visible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) render();
      }, { threshold: 0 }).observe(canvas);
    }
    // Respect reduced-motion: render a static globe, no auto-spin (drag still works).
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      autoRotate = false;
    }

    d3.timer(function () {
      if (autoRotate && visible) {
        rotation[0] += opts.speed;
        projection.rotate(rotation);
        render();
      }
    });

    var resizeT;
    window.addEventListener("resize", function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { size(); render(); }, 150);
    });

    if (opts.interactive) {
      canvas.style.cursor = "grab";
      canvas.addEventListener("mousedown", function (e) {
        autoRotate = false;
        canvas.style.cursor = "grabbing";
        var sx = e.clientX, sy = e.clientY, sr = rotation.slice();
        function move(me) {
          rotation[0] = sr[0] + (me.clientX - sx) * 0.5;
          rotation[1] = Math.max(-90, Math.min(90, sr[1] - (me.clientY - sy) * 0.5));
          projection.rotate(rotation);
          render();
        }
        function up() {
          document.removeEventListener("mousemove", move);
          document.removeEventListener("mouseup", up);
          canvas.style.cursor = "grab";
          setTimeout(function () { autoRotate = true; }, 10);
        }
        document.addEventListener("mousemove", move);
        document.addEventListener("mouseup", up);
      });
      canvas.addEventListener("wheel", function (e) {
        e.preventDefault();
        var f = e.deltaY > 0 ? 0.9 : 1.1;
        projection.scale(Math.max(baseRadius * 0.5, Math.min(baseRadius * 3, projection.scale() * f)));
        render();
      }, { passive: false });
    }
  }

  function boot() {
    var nodes = document.querySelectorAll("canvas[data-globe]");
    for (var i = 0; i < nodes.length; i++) initGlobe(nodes[i]);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
