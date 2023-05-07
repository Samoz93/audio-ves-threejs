precision mediump float;
varying vec3 vPos;
varying vec2 vUv;
uniform float uTime;
uniform mediump float uBassRange;

 void main(void)
  {
        float bColor = max(.2,uBassRange);
      gl_FragColor = vec4(0,0,bColor, 1.0);
  }