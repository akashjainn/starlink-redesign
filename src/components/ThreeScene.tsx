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
    renderer.setClearColor(0x07120a, 1);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, W() / H(), 0.1, 2000);
    camera.position.set(0, 10, 200);
    camera.lookAt(0, 0, 0);

    /* ── STARS ── */
    const sGeo = new THREE.BufferGeometry();
    const N = 3000;
    const sp = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      const r = 500 + Math.random() * 400;
      sp[i * 3] = r * Math.sin(ph) * Math.cos(th);
      sp[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      sp[i * 3 + 2] = r * Math.cos(ph);
    }
    sGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
    scene.add(
      new THREE.Points(
        sGeo,
        new THREE.PointsMaterial({
          color: 0xd0e8d8,
          size: 0.85,
          sizeAttenuation: true,
          transparent: true,
          opacity: 0.8,
        })
      )
    );

    /* ── EARTH — GLSL shader, teal+green palette ── */
    const eGeo = new THREE.SphereGeometry(60, 80, 80);
    const eMat = new THREE.ShaderMaterial({
      uniforms: { uTime: { value: 0 } },
      vertexShader: `
        varying vec3 vN; varying vec2 vUV;
        void main(){ vN=normalize(normalMatrix*normal); vUV=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vN; varying vec2 vUV;

        float h21(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.545); }
        float sn(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1,0)),f.x),mix(h21(i+vec2(0,1)),h21(i+vec2(1)),f.x),f.y); }
        float fbm(vec2 p){ float v=0.,a=.5; for(int i=0;i<5;i++){v+=a*sn(p);p*=2.07;a*=.5;} return v; }

        void main(){
          float land = fbm(vUV*5.2+vec2(1.1,.7));
          float det  = fbm(vUV*12.+vec2(2.9,1.4));
          float isle = smoothstep(.44,.54,land);

          vec3 deepSea  = vec3(.06,.28,.35);
          vec3 midOcean = vec3(.10,.46,.52);
          vec3 coast    = vec3(.18,.60,.56);
          vec3 forest   = vec3(.14,.44,.24);
          vec3 highland = vec3(.24,.58,.32);
          vec3 snowcap  = vec3(.86,.95,.90);

          float lat  = abs(vUV.y-.5)*2.;
          float pole = smoothstep(.70,.94,lat);

          vec3 ocean = mix(deepSea, mix(midOcean, coast, det), smoothstep(0.,.5,land));
          vec3 lnd   = mix(forest, highland, det);
          vec3 col   = mix(ocean, lnd, isle);
          col = mix(col, snowcap, pole);

          vec3 sun = normalize(vec3(1.5,.8,1.7));
          float diff = max(0., dot(vN, sun));
          col *= (.18 + diff*.82);

          vec3 h = normalize(sun+vec3(0,0,1));
          col += vec3(.7,1.,.85)*pow(max(0.,dot(vN,h)),50.)*(1.-isle)*.28;

          float rim = pow(1.-max(0.,dot(vN,vec3(0,0,1))),2.6);
          col = mix(col, vec3(.28,.72,.65), rim*.52);

          float night = max(0.,-dot(vN,sun));
          col += vec3(.45,.68,.32)*night*sn(vUV*24.)*isle*.15;

          gl_FragColor = vec4(col,1.);
        }
      `,
    });

    const earth = new THREE.Mesh(eGeo, eMat);
    earth.position.set(55, -5, -10);
    scene.add(earth);

    /* ── ATMOSPHERE ── */
    const aGeo = new THREE.SphereGeometry(62.5, 64, 64);
    const aMat = new THREE.ShaderMaterial({
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
      vertexShader: `varying vec3 vN; void main(){ vN=normalize(normalMatrix*normal); gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
      fragmentShader: `varying vec3 vN; void main(){ float i=pow(.68-dot(vN,vec3(0,0,1)),2.8); gl_FragColor=vec4(.22,.70,.62,1.)*clamp(i,0.,1.)*.42; }`,
    });
    const atm = new THREE.Mesh(aGeo, aMat);
    atm.position.copy(earth.position);
    scene.add(atm);

    /* ── SATELLITES ── */
    const sats: { g: THREE.Group; r: number; inc: number; spd: number; ph: number }[] = [];
    const bMat = new THREE.MeshPhongMaterial({ color: 0xc5dfc9, emissive: 0x0e2a16, shininess: 80 });
    const pMat = new THREE.MeshPhongMaterial({ color: 0x143622, emissive: 0x06180d, shininess: 100 });

    for (let i = 0; i < 14; i++) {
      const g = new THREE.Group();
      g.add(new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.44, 0.44), bMat));
      const p1 = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.09, 0.7), pMat);
      p1.position.x = 2.6;
      g.add(p1);
      const p2 = p1.clone();
      p2.position.x = -2.6;
      g.add(p2);
      scene.add(g);
      sats.push({
        g,
        r: 84 + (i % 5) * 7,
        inc: (i / 14) * Math.PI * 0.8 - 0.28,
        spd: 0.0023 + Math.random() * 0.002,
        ph: (i / 14) * Math.PI * 2,
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
      if (beams.length >= 22) return;
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
        new THREE.SphereGeometry(0.52, 8, 8),
        new THREE.MeshBasicMaterial({ color: 0x9dd5b9, transparent: true, opacity: 0.9 })
      );
      dot.position.copy(gp);
      scene.add(dot);
      beams.push({ si, gp, line: null, dot, life: 0, max: 110 + Math.random() * 90 });
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
          new THREE.LineBasicMaterial({ color: 0x6faf8f, transparent: true, opacity: 0.38 * fade })
        );
        scene.add(b.line);
        (b.dot.material as THREE.MeshBasicMaterial).opacity =
          0.75 * fade * (0.55 + 0.45 * Math.sin(b.life * 0.24));
        b.dot.scale.setScalar(0.75 + 0.38 * Math.sin(b.life * 0.2));
        if (b.life >= b.max) {
          scene.remove(b.line);
          b.line.geometry.dispose();
          scene.remove(b.dot);
          beams.splice(i, 1);
        }
      }
    }

    /* ── ORBIT RINGS ── */
    const rMat = new THREE.LineBasicMaterial({ color: 0x9dd5b9, transparent: true, opacity: 0.11 });
    [86, 94, 102].forEach((r, idx) => {
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= 80; i++) {
        const a = (i / 80) * Math.PI * 2;
        pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
      }
      const ring = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), rMat);
      ring.position.copy(earth.position);
      ring.rotation.x = -0.15 + idx * 0.25;
      ring.rotation.z = idx * 0.18;
      scene.add(ring);
    });

    /* ── LIGHTS ── */
    scene.add(new THREE.AmbientLight(0xd4eed8, 0.32));
    const sunLight = new THREE.DirectionalLight(0xf0fff4, 1.1);
    sunLight.position.set(150, 80, 190);
    scene.add(sunLight);

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
      earth.rotation.y += 0.00065;
      atm.rotation.y += 0.00065;

      sats.forEach((s) => {
        s.ph += s.spd;
        const x = Math.cos(s.ph) * s.r;
        const z = Math.sin(s.ph) * s.r;
        const y = Math.sin(s.ph + s.inc) * s.r * 0.26;
        s.g.position.set(earth.position.x + x, earth.position.y + y, earth.position.z + z);
        s.g.lookAt(earth.position);
        s.g.rotateX(Math.PI / 2);
      });

      bTimer++;
      if (bTimer > 32) {
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
