"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = () => window.innerWidth;
    const H = () => window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    renderer.setSize(W(), H());
    renderer.setClearColor(0x020208, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, W() / H(), 0.1, 3000);
    camera.position.set(0, 8, 200);
    camera.lookAt(8, 0, 0);

    /* ── DEEP-SPACE NEBULA BACKGROUND ── */
    {
      const geo = new THREE.SphereGeometry(1500, 32, 32);
      const mat = new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: { uT: { value: 0 } },
        vertexShader: `
          varying vec3 vP;
          void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }
        `,
        fragmentShader: `
          varying vec3 vP;
          float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.545); }
          float sn(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1)),f.x),f.y); }
          float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<4;i++){v+=a*sn(p);p*=2.1;a*=.5;} return v; }
          void main(){
            vec3 d = normalize(vP);
            float u = atan(d.z,d.x)/6.28+.5;
            float v = asin(d.y)/3.14+.5;
            float n = fbm(vec2(u,v)*6.);
            vec3 c = vec3(0.010,0.016,0.026);
            c += vec3(0.05,0.10,0.12) * smoothstep(.45,.75,n) * .4;
            c += vec3(0.08,0.05,0.12) * smoothstep(.55,.8,fbm(vec2(u*3.,v*3.)+2.4)) * .22;
            gl_FragColor = vec4(c,1.);
          }
        `,
      });
      scene.add(new THREE.Mesh(geo, mat));
    }

    /* ── STARS ── */
    {
      const N = 4500;
      const pos = new Float32Array(N * 3);
      const col = new Float32Array(N * 3);
      const siz = new Float32Array(N);
      for (let i = 0; i < N; i++) {
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        const r = 900 + Math.random() * 400;
        pos[i*3]   = r * Math.sin(ph) * Math.cos(th);
        pos[i*3+1] = r * Math.sin(ph) * Math.sin(th);
        pos[i*3+2] = r * Math.cos(ph);
        const t = Math.random();
        let r_, g_, b_;
        if      (t < 0.70) { r_=1.0;  g_=0.98; b_=0.94; }
        else if (t < 0.85) { r_=0.75; g_=0.85; b_=1.0;  }
        else if (t < 0.95) { r_=1.0;  g_=0.82; b_=0.6;  }
        else               { r_=0.7;  g_=1.0;  b_=0.85; }
        const bright = Math.pow(Math.random(), 3) * 0.8 + 0.2;
        col[i*3]=r_*bright; col[i*3+1]=g_*bright; col[i*3+2]=b_*bright;
        siz[i] = Math.pow(Math.random(), 8) * 4 + 0.6;
      }
      const g = new THREE.BufferGeometry();
      g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      g.setAttribute("color",    new THREE.BufferAttribute(col, 3));
      g.setAttribute("aSize",    new THREE.BufferAttribute(siz, 1));
      const m = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uT: { value: 0 } },
        vertexShader: `
          attribute float aSize; varying vec3 vC; uniform float uT;
          void main(){
            vC = color;
            vec4 mv = modelViewMatrix * vec4(position,1.);
            float tw = 0.85 + 0.15*sin(uT*0.002 + position.x*0.07 + position.y*0.09);
            gl_PointSize = aSize * tw * (300.0 / -mv.z);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          varying vec3 vC;
          void main(){
            vec2 q = gl_PointCoord - 0.5;
            float d = length(q);
            float a = smoothstep(0.5, 0.0, d);
            float glow = smoothstep(0.5, 0.08, d) * 0.4;
            gl_FragColor = vec4(vC*(a+glow), a);
          }
        `,
        vertexColors: true,
      });
      scene.add(new THREE.Points(g, m));
    }

    /* ── EARTH — 3D object-space noise, no UV seam ── */
    const earthGroup = new THREE.Group();
    earthGroup.position.set(55, -4, 0);
    scene.add(earthGroup);

    const EARTH_R = 52;
    const earthMat = new THREE.ShaderMaterial({
      uniforms: {
        uT:   { value: 0 },
        uSun: { value: new THREE.Vector3(1.1, 0.5, 1.4).normalize() },
      },
      vertexShader: `
        varying vec3 vN; varying vec3 vObj; varying vec3 vViewPos;
        void main(){
          vN       = normalize(normalMatrix * normal);
          vObj     = normalize(position);
          vViewPos = (modelViewMatrix * vec4(position,1.)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
        }
      `,
      fragmentShader: `
        uniform float uT; uniform vec3 uSun;
        varying vec3 vN; varying vec3 vObj; varying vec3 vViewPos;

        float h31(vec3 p){ return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.545); }
        float sn3(vec3 p){
          vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
          float n000=h31(i),         n100=h31(i+vec3(1,0,0));
          float n010=h31(i+vec3(0,1,0)), n110=h31(i+vec3(1,1,0));
          float n001=h31(i+vec3(0,0,1)), n101=h31(i+vec3(1,0,1));
          float n011=h31(i+vec3(0,1,1)), n111=h31(i+vec3(1,1,1));
          return mix(
            mix(mix(n000,n100,f.x), mix(n010,n110,f.x), f.y),
            mix(mix(n001,n101,f.x), mix(n011,n111,f.x), f.y), f.z);
        }
        float fbm3(vec3 p){ float v=0.,a=.5; for(int i=0;i<6;i++){v+=a*sn3(p); p=p*2.07+vec3(1.3,-0.7,0.9); a*=.5;} return v; }
        float ridged3(vec3 p){ return 1.0-abs(fbm3(p)*2.0-1.0); }

        void main(){
          vec3 p = vObj;
          float cont = fbm3(p*1.8 + vec3(0.7,1.1,0.3));
          float det  = fbm3(p*5.4 + vec3(2.4,0.0,1.2))*0.5;
          float mask = cont + det*0.35;
          float land = smoothstep(0.50,0.56,mask);

          vec3 deepOcean = vec3(0.02,0.10,0.20);
          vec3 midOcean  = vec3(0.04,0.22,0.34);
          vec3 shallow   = vec3(0.12,0.44,0.48);
          float od = smoothstep(0.30,0.52,mask);
          vec3 ocean = mix(deepOcean, mix(midOcean,shallow,od), od);

          float elev = ridged3(p*8.0);
          float arid = fbm3(p*3.0 + vec3(9.0,0.0,0.0));
          vec3 forest   = vec3(0.12,0.32,0.16);
          vec3 plain    = vec3(0.28,0.38,0.18);
          vec3 desert   = vec3(0.60,0.52,0.32);
          vec3 mountain = vec3(0.48,0.42,0.34);
          vec3 landCol  = mix(forest, plain,   smoothstep(0.3,0.6,arid));
          landCol = mix(landCol, desert,   smoothstep(0.65,0.85,arid));
          landCol = mix(landCol, mountain, smoothstep(0.55,0.80,elev));

          vec3 surf = mix(ocean, landCol, land);

          // ice caps
          float lat = abs(p.y);
          float ice = smoothstep(0.78,0.95, lat + fbm3(p*4.0)*0.08);
          surf = mix(surf, vec3(0.88,0.94,0.96), ice);

          // clouds
          float cloud = fbm3(p*3.0 + vec3(uT*0.00008,0.0,0.0));
          cloud = smoothstep(0.52,0.72,cloud);
          surf = mix(surf, vec3(1.0,1.0,1.0), cloud*0.55);

          // lighting
          float diff = max(0.0, dot(vN, uSun));
          vec3 lit = surf * (diff*0.9 + 0.1);

          // specular on ocean
          vec3 h = normalize(uSun + vec3(0.0,0.0,1.0));
          float spec = pow(max(0.0,dot(vN,h)),80.0)*(1.0-land)*(1.0-cloud);
          lit += vec3(0.8,0.95,1.0)*spec*0.6;

          // atmosphere rim on day side — use real view direction
          vec3 viewDir = normalize(-vViewPos);
          float rim = pow(1.0-max(0.0,dot(vN,viewDir)),3.0);
          lit = mix(lit, vec3(0.35,0.65,0.85), rim*0.45*max(0.2,diff));

          // city lights (night)
          float night = max(0.0,-dot(vN,uSun));
          float cities = smoothstep(0.86,0.98, fbm3(p*45.0))*land*(1.0-ice);
          lit += vec3(1.0,0.85,0.4)*cities*night*0.9;
          lit += surf*night*0.05;

          gl_FragColor = vec4(lit,1.0);
        }
      `,
    });

    const earth = new THREE.Mesh(new THREE.SphereGeometry(EARTH_R, 128, 128), earthMat);
    earth.rotation.z = 0.41;
    earthGroup.add(earth);

    /* ── ATMOSPHERE — FrontSide + AdditiveBlending + real view vector ── */
    const atmoMat = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uSun: earthMat.uniforms.uSun },
      vertexShader: `
        varying vec3 vN; varying vec3 vVP;
        void main(){
          vN  = normalize(normalMatrix*normal);
          vVP = (modelViewMatrix*vec4(position,1.)).xyz;
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
        }
      `,
      fragmentShader: `
        varying vec3 vN; varying vec3 vVP; uniform vec3 uSun;
        void main(){
          vec3 viewDir = normalize(-vVP);
          float rim = 1.0 - max(0.0, dot(vN, viewDir));
          float i = pow(rim, 2.6);
          float lit = max(0.2, dot(normalize(vN), uSun));
          vec3 c = mix(vec3(0.18,0.48,0.72), vec3(0.35,0.75,0.85), lit);
          gl_FragColor = vec4(c, clamp(i,0.0,1.0)*0.50);
        }
      `,
    });
    earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(EARTH_R*1.06, 64, 64), atmoMat));

    const atmoMat2 = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec3 vN; varying vec3 vVP;
        void main(){
          vN  = normalize(normalMatrix*normal);
          vVP = (modelViewMatrix*vec4(position,1.)).xyz;
          gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.);
        }
      `,
      fragmentShader: `
        varying vec3 vN; varying vec3 vVP;
        void main(){
          vec3 viewDir = normalize(-vVP);
          float rim = 1.0 - max(0.0, dot(vN, viewDir));
          float i = pow(rim, 4.0);
          gl_FragColor = vec4(0.25,0.60,0.80, clamp(i,0.0,1.0)*0.25);
        }
      `,
    });
    earthGroup.add(new THREE.Mesh(new THREE.SphereGeometry(EARTH_R*1.15, 64, 64), atmoMat2));

    /* ── SATELLITES ── */
    const sats: { g: THREE.Group; r: number; inc: number; asc: number; spd: number; ph: number }[] = [];
    const satBody  = new THREE.MeshPhongMaterial({ color: 0xe8eef0, emissive: 0x1a2a30, shininess: 100 });
    const satPanel = new THREE.MeshPhongMaterial({ color: 0x1a3a6a, emissive: 0x0a1a2a, shininess: 90 });

    for (let i = 0; i < 18; i++) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.4, 0.4), satBody));
      const dish = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.25, 8), satBody);
      dish.rotation.x = Math.PI / 2;
      dish.position.y = -0.3;
      g.add(dish);
      const panel = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.6), satPanel);
      panel.position.x = 1.9;
      g.add(panel);
      const panel2 = panel.clone();
      panel2.position.x = -1.9;
      g.add(panel2);
      scene.add(g);
      sats.push({
        g,
        r:   EARTH_R * (1.26 + (i % 4) * 0.04),
        inc: (i / 18) * Math.PI + i * 0.21,
        asc: (i * 2.31) % (Math.PI * 2),
        spd: 0.0022 + Math.random() * 0.0018,
        ph:  (i / 18) * Math.PI * 2,
      });
    }

    /* ── GROUND POINTS (stable city positions) ── */
    const cityCoords: [number, number][] = [
      [0.15,0.38],[0.22,0.42],[0.28,0.44],
      [0.48,0.30],[0.55,0.34],[0.52,0.52],
      [0.72,0.40],[0.78,0.46],[0.85,0.56],
      [0.88,0.70],[0.07,0.68],[0.32,0.72],
      [0.60,0.38],[0.38,0.50],[0.68,0.62],
    ];
    const groundPoints = cityCoords.map(([u, v]) => {
      const theta = (u - 0.5) * Math.PI * 2;
      const phi   = (0.5 - v) * Math.PI;
      return {
        local: new THREE.Vector3(
          Math.cos(phi) * Math.cos(theta) * EARTH_R,
          Math.sin(phi) * EARTH_R,
          Math.cos(phi) * Math.sin(theta) * EARTH_R,
        ),
      };
    });

    /* ── SIGNAL ARCS ── */
    type Arc = {
      sat: typeof sats[0]; gp: { local: THREE.Vector3 };
      line: THREE.Line; mat: THREE.LineBasicMaterial;
      blip: THREE.Mesh; blipMat: THREE.MeshBasicMaterial;
      life: number; max: number;
    };
    const arcs: Arc[] = [];
    let arcTimer = 0;

    function spawnArc() {
      if (arcs.length >= 8) return;
      const sat = sats[Math.floor(Math.random() * sats.length)];
      const gp  = groundPoints[Math.floor(Math.random() * groundPoints.length)];

      const geoPts = new THREE.BufferGeometry();
      geoPts.setAttribute("position", new THREE.BufferAttribute(new Float32Array(64 * 3), 3));
      const mat = new THREE.LineBasicMaterial({
        color: 0x00EAFF, transparent: true, opacity: 0,
        blending: THREE.AdditiveBlending, depthWrite: false,
      });
      const line = new THREE.Line(geoPts, mat);
      scene.add(line);

      const blipMat = new THREE.MeshBasicMaterial({ color: 0xE8E000, transparent: true, opacity: 0 });
      const blip = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), blipMat);
      earthGroup.add(blip);
      blip.position.copy(gp.local);

      arcs.push({ sat, gp, line, mat, blip, blipMat, life: 0, max: 150 + Math.random() * 80 });
    }

    function updateArcs() {
      for (let i = arcs.length - 1; i >= 0; i--) {
        const a = arcs[i];
        a.life++;
        const gw = a.gp.local.clone().applyMatrix4(earth.matrixWorld);
        const sw = a.sat.g.position.clone();
        const mid = gw.clone().add(sw).multiplyScalar(0.5);
        const outward = mid.clone().sub(earthGroup.position).normalize();
        mid.add(outward.multiplyScalar(8));

        const arr = a.line.geometry.attributes.position.array as Float32Array;
        const NP = 32;
        for (let k = 0; k < NP; k++) {
          const t = k / (NP - 1);
          const p = new THREE.Vector3()
            .copy(gw).multiplyScalar((1-t)*(1-t))
            .addScaledVector(mid, 2*(1-t)*t)
            .addScaledVector(sw, t*t);
          arr[k*3]=p.x; arr[k*3+1]=p.y; arr[k*3+2]=p.z;
        }
        for (let k = NP; k < 64; k++) { arr[k*3]=arr[(NP-1)*3]; arr[k*3+1]=arr[(NP-1)*3+1]; arr[k*3+2]=arr[(NP-1)*3+2]; }
        a.line.geometry.setDrawRange(0, NP);
        a.line.geometry.attributes.position.needsUpdate = true;

        const fade = a.life < 20 ? a.life/20 : a.life > a.max-24 ? (a.max-a.life)/24 : 1;
        a.mat.opacity = 0.75 * fade;
        a.blip.position.copy(a.gp.local);
        const pulse = 0.6 + 0.4 * Math.sin(a.life * 0.18);
        a.blipMat.opacity = 0.9 * fade * pulse;
        a.blip.scale.setScalar(0.7 + 0.6 * pulse);

        if (a.life >= a.max) {
          scene.remove(a.line);
          a.line.geometry.dispose();
          earthGroup.remove(a.blip);
          a.blip.geometry.dispose();
          arcs.splice(i, 1);
        }
      }
    }

    /* ── ORBIT RINGS ── */
    const rMat = new THREE.LineBasicMaterial({ color: 0x9dd5b9, transparent: true, opacity: 0.10 });
    [86, 94, 102].forEach((r, idx) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 80; i++) {
        const a = (i / 80) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a)*r, 0, Math.sin(a)*r));
      }
      const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), rMat);
      ring.position.copy(earthGroup.position);
      ring.rotation.x = -0.15 + idx * 0.25;
      ring.rotation.z = idx * 0.18;
      scene.add(ring);
    });

    /* ── LIGHTS ── */
    scene.add(new THREE.AmbientLight(0x445566, 0.4));
    const sun = new THREE.DirectionalLight(0xfff4dd, 1.6);
    sun.position.set(200, 80, 220);
    scene.add(sun);

    /* ── MOUSE PARALLAX ── */
    let mx = 0, my = 0;
    const onMouseMove = (e: MouseEvent) => {
      mx = (e.clientX / W() - 0.5) * 2;
      my = (e.clientY / H() - 0.5) * 2;
    };
    const onResize = () => {
      camera.aspect = W() / H();
      camera.updateProjectionMatrix();
      renderer.setSize(W(), H());
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    let t = 0, animId: number;

    function loop() {
      animId = requestAnimationFrame(loop);
      t++;
      earthMat.uniforms.uT.value = t;
      earth.rotation.y += 0.0008;

      sats.forEach((s) => {
        s.ph += s.spd;
        const x = Math.cos(s.ph) * s.r;
        const z = Math.sin(s.ph) * s.r;
        const cosI = Math.cos(s.inc), sinI = Math.sin(s.inc);
        const y2 = z * sinI;
        const z2 = z * cosI;
        const cosA = Math.cos(s.asc), sinA = Math.sin(s.asc);
        const xr = x * cosA - z2 * sinA;
        const zr = x * sinA + z2 * cosA;
        s.g.position.set(
          earthGroup.position.x + xr,
          earthGroup.position.y + y2,
          earthGroup.position.z + zr,
        );
        s.g.lookAt(earthGroup.position);
        s.g.rotateX(Math.PI / 2);
      });

      arcTimer++;
      if (arcTimer > 26) { arcTimer = 0; spawnArc(); }
      updateArcs();

      camera.position.x += (mx * 16 - camera.position.x) * 0.02;
      camera.position.y += (8 - my * 10 - camera.position.y) * 0.02;
      camera.lookAt(8, 0, 0);
      renderer.render(scene, camera);
    }

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0 }}
    />
  );
}
