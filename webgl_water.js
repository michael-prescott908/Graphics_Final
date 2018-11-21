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

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    gl.clearColor(0, 0, 0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
};
