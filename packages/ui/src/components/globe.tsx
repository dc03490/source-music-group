"use client";

/* Rotating wireframe dotted globe — React port of the legacy js/globe.js
   (d3-geo orthographic projection on canvas: graticule, land outlines,
   halftone dots). Pauses off-screen via IntersectionObserver and renders
   static under prefers-reduced-motion. */

import { useEffect, useRef } from "react";
import { geoBounds, geoGraticule, geoOrthographic, geoPath } from "d3-geo";
import { timer as d3timer } from "d3-timer";
import { cn } from "../lib/cn";

interface GlobeProps {
  stroke?: string;
  dot?: string;
  ocean?: string;
  strokeAlpha?: number;
  dotAlpha?: number;
  /** degrees per frame */
  speed?: number;
  /** higher = fewer dots */
  density?: number;
  interactive?: boolean;
  geoUrl?: string;
  className?: string;
}

type Ring = [number, number][];

function pointInPolygon(point: [number, number], polygon: Ring): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const pi = polygon[i]!;
    const pj = polygon[j]!;
    if (pi[1] > y !== pj[1] > y && x < ((pj[0] - pi[0]) * (y - pi[1])) / (pj[1] - pi[1]) + pi[0]) {
      inside = !inside;
    }
  }
  return inside;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function pointInFeature(point: [number, number], feature: any): boolean {
  const g = feature.geometry;
  if (g.type === "Polygon") {
    const c = g.coordinates as Ring[];
    if (!pointInPolygon(point, c[0]!)) return false;
    for (let i = 1; i < c.length; i++) if (pointInPolygon(point, c[i]!)) return false;
    return true;
  }
  if (g.type === "MultiPolygon") {
    for (const poly of g.coordinates as Ring[][]) {
      if (pointInPolygon(point, poly[0]!)) {
        let inHole = false;
        for (let h = 1; h < poly.length; h++) {
          if (pointInPolygon(point, poly[h]!)) {
            inHole = true;
            break;
          }
        }
        if (!inHole) return true;
      }
    }
  }
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function generateDots(feature: any, spacing: number): [number, number][] {
  const dots: [number, number][] = [];
  const [[minLng, minLat], [maxLng, maxLat]] = geoBounds(feature);
  const step = spacing * 0.08;
  for (let lng = minLng; lng <= maxLng; lng += step) {
    for (let lat = minLat; lat <= maxLat; lat += step) {
      if (pointInFeature([lng, lat], feature)) dots.push([lng, lat]);
    }
  }
  return dots;
}

export function Globe({
  stroke = "#e0218a",
  dot = "#1dd3b0",
  ocean = "transparent",
  strokeAlpha = 0.5,
  dotAlpha = 0.45,
  speed = 0.18,
  density = 24,
  interactive = false,
  geoUrl = "/assets/ne_110m_land.json",
  className,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let W = 1;
    let H = 1;
    let baseRadius = 1;
    const rotation: [number, number] = [0, 0];
    let autoRotate = true;
    let visible = true;
    let disposed = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let landFeatures: any = null;
    const allDots: [number, number][] = [];

    const projection = geoOrthographic().clipAngle(90);
    const path = geoPath(projection, context);

    function size() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      W = Math.max(1, rect.width);
      H = Math.max(1, rect.height);
      baseRadius = Math.min(W, H) / 2.2;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      context!.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.scale(baseRadius).translate([W / 2, H / 2]);
    }

    function render() {
      if (!context) return;
      context.clearRect(0, 0, W, H);
      const scale = projection.scale();
      const sf = scale / baseRadius;

      context.beginPath();
      context.arc(W / 2, H / 2, scale, 0, 2 * Math.PI);
      if (ocean !== "transparent") {
        context.fillStyle = ocean;
        context.fill();
      }
      context.strokeStyle = stroke;
      context.globalAlpha = strokeAlpha;
      context.lineWidth = 1.5 * sf;
      context.stroke();

      if (landFeatures) {
        context.beginPath();
        path(geoGraticule()());
        context.lineWidth = 1 * sf;
        context.globalAlpha = strokeAlpha * 0.28;
        context.stroke();

        context.beginPath();
        for (const f of landFeatures.features) path(f);
        context.globalAlpha = strokeAlpha;
        context.lineWidth = 1 * sf;
        context.stroke();

        context.fillStyle = dot;
        context.globalAlpha = dotAlpha;
        for (const d of allDots) {
          const pr = projection(d);
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

    fetch(geoUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`geojson ${r.status}`);
        return r.json();
      })
      .then((data) => {
        if (disposed) return;
        landFeatures = data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data.features.forEach((f: any) => {
          for (const pt of generateDots(f, density)) allDots.push(pt);
        });
        render();
      })
      .catch(() => {
        /* keep the bare sphere on failure */
      });

    const observer =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              visible = entries[0]?.isIntersecting ?? true;
              if (visible) render();
            },
            { threshold: 0 },
          )
        : null;
    observer?.observe(canvas);

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      autoRotate = false;
    }

    const spin = d3timer(() => {
      if (autoRotate && visible) {
        rotation[0] += speed;
        projection.rotate(rotation);
        render();
      }
    });

    let resizeT: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(resizeT);
      resizeT = setTimeout(() => {
        size();
        render();
      }, 150);
    };
    window.addEventListener("resize", onResize);

    const onMouseDown = (e: MouseEvent) => {
      if (!interactive) return;
      autoRotate = false;
      canvas.style.cursor = "grabbing";
      const sx = e.clientX;
      const sy = e.clientY;
      const sr: [number, number] = [rotation[0], rotation[1]];
      const move = (me: MouseEvent) => {
        rotation[0] = sr[0] + (me.clientX - sx) * 0.5;
        rotation[1] = Math.max(-90, Math.min(90, sr[1] - (me.clientY - sy) * 0.5));
        projection.rotate(rotation);
        render();
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        canvas.style.cursor = "grab";
        setTimeout(() => {
          autoRotate = !window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        }, 10);
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    };

    const onWheel = (e: WheelEvent) => {
      if (!interactive) return;
      e.preventDefault();
      const f = e.deltaY > 0 ? 0.9 : 1.1;
      projection.scale(Math.max(baseRadius * 0.5, Math.min(baseRadius * 3, projection.scale() * f)));
      render();
    };

    if (interactive) {
      canvas.style.cursor = "grab";
      canvas.addEventListener("mousedown", onMouseDown);
      canvas.addEventListener("wheel", onWheel, { passive: false });
    }

    return () => {
      disposed = true;
      spin.stop();
      observer?.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("wheel", onWheel);
    };
  }, [stroke, dot, ocean, strokeAlpha, dotAlpha, speed, density, interactive, geoUrl]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden={!interactive}
      className={cn("h-full w-full", interactive ? "touch-none" : "pointer-events-none", className)}
    />
  );
}
