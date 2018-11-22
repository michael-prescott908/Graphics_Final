var vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec3 vertPosition;',
    'uniform mat4 mWorld;',
    'uniform mat4 mView;',
    'uniform mat4 mProj;',
    '',
    'void main()',
    '{',
    '   gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
    '}'
].join('\n');

var fragmentShaderText = [
    'precision mediump float;',
    '',
    'void main()',
    '{',
    '   gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
    '}'
].join('\n');

var InitApp = function() {
    console.log('App is currently running');

    var canvas = document.getElementById('water-surface');
    var gl = canvas.getContext('webgl');

    if(!gl){
        conole.log('WebGL is not supported in your browser');
        gl = canvas.getContext('experimental-webgl');
    }

    if(!gl){
        alert('Your browser does not support WebGL');
    }

    /*canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);*/
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vertexShader, vertexShaderText);
    gl.shaderSource(fragmentShader, fragmentShaderText);

    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
            console.error('ERROR compiling vertex shader!', gl.getShaderInfoLong(vertexShader));
            return;
    }

    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
            console.error('ERROR compiling vertex shader!', gl.getShaderInfoLong(fragmentShader));
            return;
    }

    var program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
        console.error('ERROR linking program!', gl.getProgramInfoLog(program));
        return;
    }

    gl.validateProgram(program);
    if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
        console.error('ERROR validating program!', gl.getProgramInfoLog(program));
    }

    /*
        Set buffer stuff
    */
    var triangleVertices = [
        //x, y, z
        0.0, 0.5, 0.0,  1.0, 1.0, 0.0,
        -0.5, -0.5, 0.0,    0.7, 0.0, 1.0,
        0.5, -0.5, 0.0,     0.1, 1.0, 0.6
    ];

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
            positionAttribLocation, //attrib location
            3, //num elements per attribute
            gl.FLOAT,
            gl.FALSE,
            6 * Float32Array.BYTES_PER_ELEMENT,
            0
    );

    gl.enableVertexAttribArray(positionAttribLocation);

    gl.useProgram(program);

    var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
    var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
    var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

    var worldMatrix = new Float32Array(16);
    var viewMatrix = new Float32Array(16);
    var projMatrix = new Float32Array(16);

    mat4.identity(worldMatrix);
    mat4.lookAt(viewMatrix, [0, 0, -5], [0, 0, 0], [0, 1, 0]);
    mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
    gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
    gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

    /*
        Main Render Loop
    */
    var identityMatrix = new Float32Array(16);
    mat4.identity(identityMatrix);
    var angle = 0;
    var loop = function () {
        angle = performance.now() / 1000 / 6 * 2 * Math.PI;
        mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
        gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

        gl.clearColor(0.75, 0.85, 0.8, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLES, 0, 3);

        requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
};
