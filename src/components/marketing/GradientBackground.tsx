"use client";

import { useEffect, useRef } from "react";

const vertexSrc = `#version 300 es
in vec2 position;
void main(){gl_Position=vec4(position,0.0,1.0);}
`;

const fragmentSrc = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform int uBlendMode;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),
                  dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),
               mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),
                  dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);
  return 0.5+0.5*n;
}
vec3 blendMode(vec3 base, vec3 blend, int mode){
  if(mode==1) return base * blend;
  if(mode==2) return 1.0 - (1.0-base)*(1.0-blend);
  if(mode==3){
    vec3 lt = 2.0*base*blend;
    vec3 gt = 1.0 - 2.0*(1.0-base)*(1.0-blend);
    return mix(lt, gt, step(0.5, base));
  }
  return blend;
}
void mainImage(out vec4 o, vec2 C){
  float t = iTime * uTimeSpeed;
  vec2 uv = C / iResolution.xy;
  float ratio = iResolution.x / iResolution.y;
  vec2 tuv = uv - 0.5 + uCenterOffset;
  tuv /= max(uZoom, 0.001);
  float degree = noise(vec2(t * 0.1, tuv.x * tuv.y) * uNoiseScale);
  tuv.y *= 1.0 / ratio;
  tuv *= Rot(radians((degree - 0.5) * uRotationAmount + 180.0));
  tuv.y *= ratio;
  float frequency = uWarpFrequency;
  float ws = max(uWarpStrength, 0.001);
  float amplitude = uWarpAmplitude / ws;
  float warpTime = t * uWarpSpeed;
  tuv.x += sin(tuv.y * frequency + warpTime) / max(amplitude, 0.001);
  tuv.y += sin(tuv.x * (frequency * 1.5) + warpTime) / max(amplitude * 0.5, 0.001);
  vec3 col1 = uColor1, col2 = uColor2, col3 = uColor3;
  float bal = uColorBalance;
  float soft = max(uBlendSoftness, 0.0);
  mat2 blendRot = Rot(radians(uBlendAngle));
  float blendCoord = (tuv * blendRot).x;
  float edge0 = -0.3 - bal - soft;
  float edge1 = 0.2 - bal + soft;
  float v0 = 0.5 - bal + soft;
  float v1 = -0.3 - bal - soft;
  vec3 layer1 = mix(col3, col2, S(edge0, edge1, blendCoord));
  vec3 layer2 = mix(col2, col1, S(edge0, edge1, blendCoord));
  float blendWeight = S(v0, v1, tuv.y);
  vec3 finalCol = blendMode(layer1, layer2, uBlendMode);
  finalCol = mix(layer1, finalCol, blendWeight);
  vec2 grainUv = uv * max(uGrainScale, 0.001);
  if(uGrainAnimated > 0.5) grainUv += vec2(iTime * 0.05);
  float grainNoise = fract(sin(dot(grainUv, vec2(12.9898, 78.233))) * 43758.5453);
  finalCol += (grainNoise - 0.5) * uGrainAmount;
  finalCol = (finalCol - 0.5) * uContrast + 0.5;
  float luma = dot(finalCol, vec3(0.2126, 0.7152, 0.0722));
  finalCol = mix(vec3(luma), finalCol, uSaturation);
  finalCol = pow(max(finalCol, 0.0), vec3(1.0 / max(uGamma, 0.001)));
  o = vec4(clamp(finalCol, 0.0, 1.0), 1.0);
}
void main(){ vec4 o=vec4(0.0); mainImage(o, gl_FragCoord.xy); fragColor=o; }
`;

export default function GradientBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const el = containerRef.current;
    const canvas = canvasRef.current;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: true,
      powerPreference: "high-performance"
    });
    if (!gl) return;

    const compile = (type: number, src: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, vertexSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSrc);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    gl.bindVertexArray(null);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    const u = {
      iTime: gl.getUniformLocation(prog, "iTime"),
      iResolution: gl.getUniformLocation(prog, "iResolution"),
      uTimeSpeed: gl.getUniformLocation(prog, "uTimeSpeed"),
      uColorBalance: gl.getUniformLocation(prog, "uColorBalance"),
      uWarpStrength: gl.getUniformLocation(prog, "uWarpStrength"),
      uWarpFrequency: gl.getUniformLocation(prog, "uWarpFrequency"),
      uWarpSpeed: gl.getUniformLocation(prog, "uWarpSpeed"),
      uWarpAmplitude: gl.getUniformLocation(prog, "uWarpAmplitude"),
      uBlendAngle: gl.getUniformLocation(prog, "uBlendAngle"),
      uBlendSoftness: gl.getUniformLocation(prog, "uBlendSoftness"),
      uBlendMode: gl.getUniformLocation(prog, "uBlendMode"),
      uRotationAmount: gl.getUniformLocation(prog, "uRotationAmount"),
      uNoiseScale: gl.getUniformLocation(prog, "uNoiseScale"),
      uGrainAmount: gl.getUniformLocation(prog, "uGrainAmount"),
      uGrainScale: gl.getUniformLocation(prog, "uGrainScale"),
      uGrainAnimated: gl.getUniformLocation(prog, "uGrainAnimated"),
      uContrast: gl.getUniformLocation(prog, "uContrast"),
      uGamma: gl.getUniformLocation(prog, "uGamma"),
      uSaturation: gl.getUniformLocation(prog, "uSaturation"),
      uCenterOffset: gl.getUniformLocation(prog, "uCenterOffset"),
      uZoom: gl.getUniformLocation(prog, "uZoom"),
      uColor1: gl.getUniformLocation(prog, "uColor1"),
      uColor2: gl.getUniformLocation(prog, "uColor2"),
      uColor3: gl.getUniformLocation(prog, "uColor3"),
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = el.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(prog);
      gl.uniform2f(u.iResolution, canvas.width, canvas.height);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    // Ultra-Dark "Midnight Onyx" (Maximum contrast for white UI)
    gl.useProgram(prog);
    gl.uniform1f(u.uTimeSpeed, 0.1); 
    gl.uniform1f(u.uColorBalance, -0.4); 
    gl.uniform1f(u.uWarpStrength, 0.8);
    gl.uniform1f(u.uWarpFrequency, 3.0);
    gl.uniform1f(u.uWarpSpeed, 1.0);
    gl.uniform1f(u.uWarpAmplitude, 30.0);
    gl.uniform1f(u.uBlendAngle, 0.0);
    gl.uniform1f(u.uBlendSoftness, 0.15);
    gl.uniform1i(u.uBlendMode, 0);
    gl.uniform1f(u.uRotationAmount, 300.0);
    gl.uniform1f(u.uNoiseScale, 1.5);
    gl.uniform1f(u.uGrainAmount, 0.05);
    gl.uniform1f(u.uGrainScale, 1.2);
    gl.uniform1f(u.uGrainAnimated, 1.0);
    gl.uniform1f(u.uContrast, 1.05);
    gl.uniform1f(u.uGamma, 0.8);
    gl.uniform1f(u.uSaturation, 0.4); 
    gl.uniform2f(u.uCenterOffset, 0.0, 0.0);
    gl.uniform1f(u.uZoom, 1.1);
    gl.uniform3f(u.uColor1, 0.02, 0.02, 0.02); // Black
    gl.uniform3f(u.uColor2, 0.08, 0.07, 0.04); // Deepest gold tint
    gl.uniform3f(u.uColor3, 0.0, 0.0, 0.0);    // Absolute Black

    const start = performance.now();
    let rafId: number;
    const loop = (now: number) => {
      const t = (now - start) * 0.001;
      gl.useProgram(prog);
      gl.uniform1f(u.iTime, t);
      gl.bindVertexArray(vao);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.bindVertexArray(null);
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      try { gl.deleteProgram(prog); } catch (_) {}
      try { gl.deleteVertexArray(vao); } catch (_) {}
      try { gl.deleteBuffer(buf); } catch (_) {}
    };
  }, []);

  return (
    <div ref={containerRef} className="gradientpro-bg absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(120%_80%_at_50%_35%,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.05)_55%,rgba(0,0,0,0.75)_100%),linear-gradient(to_bottom,rgba(0,0,0,0.55)_0%,rgba(0,0,0,0.15)_40%,rgba(0,0,0,0.55)_100%)] mix-blend-multiply opacity-90" />
      <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('data:image/svg+xml,%3Csvg_viewBox=%270_0_200_200%27_xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter_id=%27n%27%3E%3CfeTurbulence_type=%27fractalNoise%27_baseFrequency=%270.9%27_numOctaves=%273%27_stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect_width=%27100%25%27_height=%27100%25%27_filter=%27url(%23n)%27/%3E%3C/svg%3E')]" />
    </div>
  );
}
