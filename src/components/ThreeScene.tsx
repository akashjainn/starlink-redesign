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
    const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 2000);
    camera.position.set(0, 10, 200);
    camera.lookAt(0, 0, 0);

    /* ── STARS ── */
    const sGeo = new THREE.BufferGeometry();
    const N = 4000;
    const sp = new Float32Array(N * 3);
    const sc = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 500 + Math.random() * 400;
      sp[i * 3]     = r * Math.sin(ph) * Math.cos(th);
      sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      sp[i * 3 + 2] = r * Math.cos(ph);
      // Slightly varied star colors: mostly white, some warm, some cool blue
      const t = Math.random();
      if (t < 0.15) {
        sc[i * 3] = 0.8; sc[i * 3 + 1] = 0.85; sc[i * 3 + 2] = 1.0; // blue-white
      } else if (t < 0.25) {
        sc[i * 3] = 1.0; sc[i * 3 + 1] = 0.92; sc[i * 3 + 2] = 0.78; // warm
      } else {
        sc[i * 3] = 1.0; sc[i * 3 + 1] = 1.0; sc[i * 3 + 2] = 1.0;   // white
      }
    }
    sGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    sGeo.setAttribute("color", new THREE.BufferAttribute(sc, 3));
    scene.add(
      new THREE.Points(
        sGeo,
        new THREE.PointsMaterial({
          vertexColors: true,
          size: 0.75,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.9,
        })
      )
    );

    /* ── EARTH — realistic blue planet shader ── */
    const eGeo = new THREE.SphereGeometry(60, 96, 96);
    const eMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vN; varying vec2 vUV; varying vec3 vPos;
        void main(){
          vN  = normalize(normalMatrix * normal);
          vUV = uv;
          vPos = (modelViewMatrix * vec4(position,1.)).xyz;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vN; varying vec2 vUV; varying vec3 vPos;

        float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.545); }
        float sn(vec2 p){
          vec2 i=floor(p), f=fract(p);
          f = f*f*(3.-2.*f);
          return mix(
            mix(h21(i), h21(i+vec2(1,0)), f.x),
            mix(h21(i+vec2(0,1)), h21(i+vec2(1)), f.x),
            f.y
          );
        }
        float fbm(vec2 p){
          float v=0., a=.5;
          for(int i=0;i<6;i++){ v+=a*sn(p); p*=2.07; a*=.5; }
          return v;
        }

        void main(){
          // Land/ocean mask
          float land = fbm(vUV*5.2 + vec2(1.1,.7));
          float det  = fbm(vUV*14. + vec2(2.9,1.4));
          float fine = fbm(vUV*30. + vec2(0.5,3.1));
          float isle = smoothstep(.42,.52, land);

          // Latitude
          float lat    = abs(vUV.y-.5)*2.;
          float pole   = smoothstep(.72,.97, lat);
          float tropic = 1.0 - smoothstep(0.0, 0.40, lat);

          // ── Ocean palette (deep blue, realistic) ──
          vec3 deepSea  = vec3(.01,.04,.14);
          vec3 midOcean = vec3(.03,.10,.30);
          vec3 shallow  = vec3(.05,.20,.50);
          vec3 ocean = mix(deepSea, mix(midOcean, shallow, det*0.7), smoothstep(0.,.55,land));

          // ── Land palette ──
          vec3 forest   = vec3(.06,.20,.05);
          vec3 grassland= vec3(.16,.30,.09);
          vec3 savanna  = vec3(.40,.30,.10);
          vec3 desert   = vec3(.48,.34,.12);
          vec3 tundra   = vec3(.38,.36,.26);
          vec3 snowcap  = vec3(.90,.93,.97);

          vec3 landBase = mix(forest, grassland, det);
          landBase = mix(landBase, savanna, smoothstep(.2,.5, tropic*det));
          landBase = mix(landBase, desert,  smoothstep(.45,.75, tropic) * smoothstep(.55,.80, fine));
          landBase = mix(landBase, tundra,  smoothstep(.50,.70, lat));

          vec3 col = mix(ocean, landBase, isle);
          col = mix(col, snowcap, pole);

          // ── Cloud layer ──
          vec2 cloudUV = vUV + vec2(uTime*0.00018, 0.);
          float cloud1 = fbm(cloudUV*7.5 + vec2(1.2, 0.8));
          float cloud2 = fbm(cloudUV*14. + vec2(3.1, 2.2));
          float cloudMask = smoothstep(.50,.64, cloud1) * smoothstep(.3,.7, cloud2 + .15);

          // ── Sun & lighting ──
          vec3 sun = normalize(vec3(1.6,.8,1.8));
          float diff = max(0., dot(vN, sun));
          col *= (.10 + diff*.90);

          // Specular highlight on ocean (sharp, blue-tinted)
          vec3 h = normalize(sun + vec3(0,0,1));
          float spec = pow(max(0.,dot(vN,h)), 160.);
          col += vec3(.55,.75,1.0) * spec * (1.-isle) * .55;

          // ── Atmospheric rim (blue) ──
          float rim = pow(1.-max(0.,dot(vN,vec3(0,0,1))), 3.2);
          col = mix(col, vec3(.12,.40,.95), rim * .70);

          // ── Night-side city lights ──
          float night = max(0., -dot(vN, sun));
          float cityN = fbm(vUV*16. + vec2(5.1,2.3));
          float cities = smoothstep(.52,.70, cityN) * isle * smoothstep(.48,.66, land);
          col += vec3(1.0,.80,.35) * night * cities * .55;

          // Apply clouds on top
          float cloudLit = .15 + diff*.85;
          col = mix(col, vec3(.91,.93,.96)*cloudLit, cloudMask * .60);

          gl_FragColor = vec4(col, 1.);
        }
      `,
    });

    const earth = new THREE.Mesh(eGeo, eMat);
    earth.position.set(55, -5, -10);
    scene.add(earth);

    /* ── ATMOSPHERE (blue glow) ── */
    const aGeo = new THREE.SphereGeometry(63.2, 64, 64);
    const aMat = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec3 vN;
        void main(){
          vN = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
        }
      `,
      fragmentShader: `
        varying vec3 vN;
        void main(){
          float i = pow(.62 - dot(vN, vec3(0,0,1)), 3.8);
          vec3 atmColor = vec3(.12,.42,.98);
          gl_FragColor = vec4(atmColor, 1.) * clamp(i, 0., 1.) * .60;
        }
      `,
    });
    const atm = new THREE.Mesh(aGeo, aMat);
    atm.position.copy(earth.position);
    scene.add(atm);

    /* ── OUTER ATMOSPHERE HAZE ── */
    const hazeGeo = new THREE.SphereGeometry(66, 64, 64);
    const hazeMat = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
      vertexShader: `
        varying vec3 vN;
        void main(){
          vN = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.);
        }
      `,
      fragmentShader: `
        varying vec3 vN;
        void main(){
          float i = pow(.55 - dot(vN, vec3(0,0,1)), 5.0);
          gl_FragColor = vec4(.08,.25,.85,1.) * clamp(i, 0., 1.) * .25;
        }
      `,
    });
    const haze = new THREE.Mesh(hazeGeo, hazeMat);
    haze.position.copy(earth.position);
    scene.add(haze);

    /* ── SATELLITES (Starlink-style) ── */
    const sats: { g: THREE.Group; r: number; inc: number; spd: number; ph: number }[] = [];

    // Satellite body: flat silver slab
    const bodyMat = new THREE.MeshPhongMaterial({
      color: 0xd2d8de,
      emissive: 0x0a0e14,
      shininess: 160,
      specular: new THREE.Color(0x8899aa),
    });
    // Solar panels: deep blue with reflective sheen
    const panelMat = new THREE.MeshPhongMaterial({
      color: 0x0e1e48,
      emissive: 0x04091e,
      shininess: 240,
      specular: new THREE.Color(0x3355aa),
    });
    // Panel frame: thin silver
    const frameMat = new THREE.MeshPhongMaterial({
      color: 0xaab4be,
      emissive: 0x080c10,
      shininess: 80,
    });

    for (let i = 0; i < 16; i++) {
      const g = new THREE.Group();

      // Main body — flat rectangular slab
      const body = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.28, 0.72), bodyMat);
      g.add(body);

      // Single large solar panel array (one side only, Starlink Gen2 style)
      const panel = new THREE.Mesh(new THREE.BoxGeometry(7.2, 0.055, 1.4), panelMat);
      panel.position.set(0, 0.18, 0);
      g.add(panel);

      // Panel frame outline
      const frameH = new THREE.Mesh(new THREE.BoxGeometry(7.4, 0.06, 0.06), frameMat);
      const frameH2 = frameH.clone();
      frameH.position.set(0, 0.22, 0.72);
      frameH2.position.set(0, 0.22, -0.72);
      g.add(frameH, frameH2);

      // Antenna dish (small, at one end)
      const dish = new THREE.Mesh(
        new THREE.CylinderGeometry(0.22, 0.12, 0.12, 8),
        new THREE.MeshPhongMaterial({ color: 0xc8cfd4, emissive: 0x080a0c, shininess: 60 })
      );
      dish.position.set(1.5, 0.22, 0);
      dish.rotation.z = Math.PI / 2;
      g.add(dish);

      scene.add(g);
      sats.push({
        g,
        r: 82 + (i % 6) * 6,
        inc: (i / 16) * Math.PI * 0.9 - 0.38,
        spd: 0.0020 + Math.random() * 0.0018,
        ph: (i / 16) * Math.PI * 2,
      });
    }

    /* ── BEAMS ── */
    type Beam = {
      si: number;
      gp: THREE.Vector3;
      line: THREE.Line | null;
      dot: THREE.Mesh;
      life: number;
      max: number;
    };
    const beams: Beam[] = [];
    let bTimer = 0;

    function spawnBeam() {
      if (beams.length >= 24) return;
      const si = Math.floor(Math.random() * sats.length);
      const lat = (Math.random() - 0.5) * 1.15;
      const lon = Math.random() * Math.PI * 2;
      const r = 61;
      const gp = new THREE.Vector3(
        earth.position.x + r * Math.cos(lat) * Math.cos(lon),
        earth.position.y + r * Math.sin(lat),
        earth.position.z + r * Math.cos(lat) * Math.sin(lon)
      );
      const dot = new THREE.Mesh(
        new THREE.SphereGeometry(0.45, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x4488ff, transparent: true, opacity: 0.85 })
      );
      dot.position.copy(gp);
      scene.add(dot);
      beams.push({ si, gp, line: null, dot, life: 0, max: 100 + Math.random() * 100 });
    }

    function tickBeams() {
      for (let i = beams.length - 1; i >= 0; i--) {
        const b = beams[i];
        b.life++;
        const sp = sats[b.si].g.position;
        if (b.line) {
          scene.remove(b.line);
          b.line.geometry.dispose();
        }
        const fade =
          b.life < 16 ? b.life / 16 : b.life > b.max - 16 ? (b.max - b.life) / 16 : 1;
        b.line = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints([sp.clone(), b.gp.clone()]),
          new THREE.LineBasicMaterial({ color: 0x3366ee, transparent: true, opacity: 0.30 * fade })
        );
        scene.add(b.line);
        (b.dot.material as THREE.MeshBasicMaterial).opacity =
          0.75 * fade * (0.55 + 0.45 * Math.sin(b.life * 0.24));
        b.dot.scale.setScalar(0.75 + 0.35 * Math.sin(b.life * 0.2));
        if (b.life >= b.max) {
          scene.remove(b.line);
          b.line.geometry.dispose();
          scene.remove(b.dot);
          beams.splice(i, 1);
        }
      }
    }

    /* ── ORBIT RINGS ── */
    const rMat = new THREE.LineBasicMaterial({ color: 0x2244aa, transparent: true, opacity: 0.13 });
    [84, 93, 102, 111].forEach((r, idx) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 96; i++) {
        const a = (i / 96) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), rMat);
      ring.position.copy(earth.position);
      ring.rotation.x = -0.18 + idx * 0.22;
      ring.rotation.z = idx * 0.15;
      scene.add(ring);
    });

    /* ── LIGHTS ── */
    scene.add(new THREE.AmbientLight(0x0a0f1a, 0.28));
    const sunLight = new THREE.DirectionalLight(0xfff8f0, 1.3);
    sunLight.position.set(160, 80, 180);
    scene.add(sunLight);
    // Cool fill from opposite side
    const fillLight = new THREE.DirectionalLight(0x1a3060, 0.15);
    fillLight.position.set(-160, -40, -160);
    scene.add(fillLight);

    /* ── MOUSE PARALLAX ── */
    let mx = 0;
    let my = 0;
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

    let t = 0;
    let animId: number;

    function loop() {
      animId = requestAnimationFrame(loop);
      t++;
      eMat.uniforms.uTime.value = t;
      earth.rotation.y += 0.00055;
      atm.rotation.y  += 0.00055;
      haze.rotation.y += 0.00055;

      sats.forEach((s) => {
        s.ph += s.spd;
        const x = Math.cos(s.ph) * s.r;
        const z = Math.sin(s.ph) * s.r;
        const y = Math.sin(s.ph + s.inc) * s.r * 0.28;
        s.g.position.set(earth.position.x + x, earth.position.y + y, earth.position.z + z);
        s.g.lookAt(earth.position);
        s.g.rotateX(Math.PI / 2);
      });

      bTimer++;
      if (bTimer > 28) {
        bTimer = 0;
        spawnBeam();
      }
      tickBeams();

      camera.position.x += (mx * 18 - camera.position.x) * 0.01;
      camera.position.y += (10 - my * 10 - camera.position.y) * 0.01;
      camera.lookAt(28, 0, 0);
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
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
