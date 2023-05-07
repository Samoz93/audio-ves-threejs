
#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif

varying vec4 v_position;
varying vec4 v_normal;
varying vec2 v_texcoord;
varying vec4 v_color;
varying vec2 v_uv;

uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewMatrix;
uniform mat4 u_normalMatrix;
uniform vec2 u_resolution;
uniform float u_time;

#if defined(VERTEX)

// attribute vec4 a_position; // myfolder/myfile.obj
attribute vec4 a_position;
attribute vec4 a_normal;
attribute vec2 a_texcoord;
attribute vec4 a_color;
attribute vec2 uv;

void main(void) {
    vec4 pos = a_position;
    
	v_position = u_projectionMatrix * u_modelViewMatrix * pos;
	v_normal = u_normalMatrix * a_normal;
	v_texcoord = a_texcoord;
	v_color = a_color;
    v_uv = uv;
	gl_Position = v_position;
}

#else // fragment shader

uniform vec2 u_mouse;
uniform vec2 u_pos;

void main() {

	gl_FragColor = vec4(v_uv,0.0,1);
}

#endif
