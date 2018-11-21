var vertexShaderText = [
    'precision mediump float;',
    '',
    'attribute vec2 vertPosition;',
    '',
    'void main()',
    '{',
    '   gl_Position = vec4(vertPosition, 0.0, 1.0);',
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
        //x, y
        0.0, 0.5,
        -0.5, -0.5,
        0.5, -0.5,
    ];

    var triangleVertexBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);

    var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
    gl.vertexAttribPointer(
            positionAttribLocation, //attrib location
            2, //num elements per attribute
            gl.FLOAT,
            gl.FALSE,
            2 * Float32Array.BYTES_PER_ELEMENT,
            0
    );

    gl.enableVertexAttribArray(positionAttribLocation);

    /*
        Main Render Loop
    */
    gl.useProgram(program);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
};
