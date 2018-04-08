const CONST = {
    PI : 3.141592653
}
// init stats monitor
function initStats() {

    var stats = new Stats();
    stats.setMode(0); // 0: fps, 1: ms

    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';

    document.getElementById("Stats-output").appendChild(stats.domElement);

    return stats;
}
function gui (controls) {
    dat;
	var gui = new dat.default.GUI()
	var res = {}
	for (let c of Object.keys(controls)) {
		if(c === 'update') continue;

        if(typeof controls[c] === 'function') {
            res[c] = controls[c]
            gui.add(res,c)
        } else {
            res[c] = controls[c].value

		    gui.add(res,c,controls[c].min,controls[c].max).onChange(controls.update)
        }
	}
	return res
}
// 鼠标移动加速度 决定了主体旋转角度跟速度
var _moveXA = 0
var _moveYA = 0 
var _moveMaxSpeed = 200 // max
function _mousemoveListener (event) {
    
    if(Math.abs(event.movementX) > _moveMaxSpeed) _moveXA = _moveMaxSpeed * (event.movementX > 0 ? 1 : -1)
        else if(Math.abs(event.movementX) > Math.abs(_moveXA)) _moveXA = event.movementX
            else if(_moveXA * event.movementX < 0) _moveXA += event.movementX

    if(Math.abs(event.movementY) > _moveMaxSpeed) _moveYA = _moveMaxSpeed * (event.movementY > 0 ? 1 : -1)
        else if(Math.abs(event.movementY) > Math.abs(_moveYA)) _moveYA = event.movementY
            else if(_moveYA * event.movementY < 0) _moveYA += event.movementY
}
var scene
var meshes = new THREE.Group()
var nextMeshes = new THREE.Group()

const _process = [
    {
        geom : function () {
            return [new Box()]
        },
        position : new THREE.Vector3(10,10,0)
    },
    {
        geom : function () {
            return [new Circle()]
        },
        position : new THREE.Vector3(-10,-10,0)
    },
    {
        geom : function () {
            return [new Box({x : 20, y : 20, z : 20, position : new THREE.Vector3(10,10,0)})]
        },
        position : new THREE.Vector3(-10,-10,0)
    }
]

function init (){

	const stats = initStats()

    scene = new THREE.Scene()
    scene.background = new THREE.Color( 0x000104 );

    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)

	const webGLRenderer = new THREE.WebGLRenderer();
	webGLRenderer.setClearColor(new THREE.Color(0xeeeeee, 1.0));
	webGLRenderer.setSize(window.innerWidth, window.innerHeight);
	webGLRenderer.shadowMap.enabled = true;
    camera.position.z = 80;
    camera.position.y = 2;
    document.getElementById("main-canvas").appendChild(webGLRenderer.domElement);
    webGLRenderer.domElement.addEventListener( 'mousemove', _mousemoveListener, false )

    // add once . change meshes' attr after
    let ms = _process[0]
    //meshes.position = ms.position
    ms.geom().forEach((g) => {
        meshes.add(g)
    })
    scene.add(meshes)

    var fog
    var controls = {}
    var dust 

    var draw = function (d) {

        if (dust) {
            scene.remove(dust)
        }
    	console.log('----redraw----')
    	
        scene.add(dust = new Dust({speed : controls.dustSpeed}))
    	fog = new THREE.FogExp2(328972,5e-4)
    	if (controls.hasFog) {
    		scene.fog = fog
    	}
    	webGLRenderer.render(scene, camera)
    }
    var _slideIndex = 1
    var _slideLock = false
    controls = gui({
    	pause : {
			value : 4,
    		min : 0,
    		max : 30
    	},
    	rotation : {
			value : 0.0005,
    		min : 0,
    		max : 0.1
    	},
    	hasFog : {
    		value : true
    	},
        dustSpeed : {
            value : 0.04,
            min : 0,
            max : 0.1
        },
    	update () {
    		draw()
    	},
        slide () {
            if(_slideLock) return;
            _slideIndex = _slideIndex % (_process.length)
            let ms = _process[_slideIndex]
            nextMeshes = new THREE.Group()
            //nextMeshes.position = ms.position
            ms.geom().forEach((g) => {
                nextMeshes.add(g)
            })
            //scene.add(nextMeshes[0])
            slideTo(meshes,nextMeshes)
            _slideIndex ++ ;
        }
    })

    draw()

    loop()

    var pause = controls.pause
    const maxRotation = CONST.PI / 8 //radian
    function loop () {
        stats.update();
    	if( pause < 0 ) {
            meshes.rotation.y += controls.rotation * _moveXA / 20
            meshes.rotation.x += controls.rotation * _moveYA / 20

	    	pause = controls.pause
            _moveXA = _moveXA - controls.rotation * (_moveXA > 0 ? 1 : -1)
            _moveYA = _moveYA - controls.rotation * (_moveYA > 0 ? 1 : -1)
    	}
    	pause --;

        dust.move()

		requestAnimationFrame(loop)
		webGLRenderer.render(scene, camera)
	}
}

// 点点的texture
function dotTexture({size = 4} = {}) {

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.5, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.7, 'rgba(70,70,70,1)');
    gradient.addColorStop(1, 'rgba(0,0,0,1)');

    context.fillStyle = gradient;
    context.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;

}

function PointsColors (vertexLen) {
	let arr = []
	for (let i = 0; i < vertexLen; i ++) {
		if(Math.random() > 0.9)
			arr.push(new THREE.Color(0x99ffff))
		else if (Math.random() > 0.85 )
			arr.push(new THREE.Color(0xff99ff))
		else 
			arr.push(new THREE.Color(0xffffff))
	}
	return arr
}

function NormalPoints({ geometry , position } = {}) {
    let points = new THREE.Points( geometry, new THREE.PointsMaterial({
		size: 0.7, 
		//color: 0xffffff,
		vertexColors: THREE.VertexColors,
		map : dotTexture()
	}))
    //debugger
    //points.position = position
    return points
}
function Circle ({radius = 10,gap = 35, position = new THREE.Vector3()} = {}) {
	var geometry = new THREE.SphereGeometry( radius, gap, gap )
	geometry.colors = PointsColors(geometry.vertices.length)
	geometry.colorsNeedUpdate = true

	//debugger
	return NormalPoints({geometry , position})
}

function Box ({x = 30, y = 30, z = 30, position = new THREE.Vector3(),gap = 15} = {}) {
	var geometry = new THREE.BoxGeometry( x, y, z, gap, gap, gap)
	geometry.colors = PointsColors(geometry.vertices.length)
	geometry.colorsNeedUpdate = true

	return NormalPoints({geometry, position})
}

function Dust ({num = 500, speed = 0.05} = {}) {

    let geometry = new THREE.Geometry()
    let colors = []
    for (let i = 0; i < num; i ++ ) {
        let vertex = new THREE.Vector3();
        vertex.x = 100 * Math.random() - 50;
        vertex.y = 100 * Math.random() - 50;
        vertex.z = 100 * Math.random() - 70;
        vertex._a = Math.random() * speed - speed / 2
        vertex._b = Math.random() * speed - speed / 2

        geometry.vertices.push( vertex );
        colors[ i ] = new THREE.Color( 0xffffff );
        //colors[ i ].setHSL( ( vertex.x + 1000 ) / 2000, 1, 0.5 );
    }
    geometry.colors = colors;
    geometry.colorsNeedUpdate = true

    //this = NormalPoints({geometry})
    let reverse = false

    setInterval(() => {
        for (let i = 0; i < num; i ++ ) {
            let pos = geometry.vertices[i]
            pos._a = -pos._a
            pos._b = -pos._b
        }
    },20000)

    return Object.assign(NormalPoints({geometry}),{
        move () {
        
            for (let i = 0; i < num; i ++ ) {
                let pos = geometry.vertices[i]
                pos.x += pos._a
                pos.y += pos._b
            }
            geometry.verticesNeedUpdate = true
        }
    })
}

function slideTo (points1,points2) {

    let nextVertices = []
    points2.children.forEach((points) => {
        nextVertices = nextVertices.concat(points.geometry.vertices)
    })

    const nl = nextVertices.length
    const moveTo = function(pos,des,interval,geometry){
        //debugger
        let speedX = (pos.x - des.x) / interval
        let speedY = (pos.y - des.y) / interval
        let speedZ = (pos.z - des.z) / interval
        let cancel
        const run = function () {
            if(Math.abs(pos.x - des.x) < 0.01) {
                cancelAnimationFrame(cancel)
                return ;
            }
            pos.x -= speedX
            pos.y -= speedY
            pos.z -= speedZ
            geometry.verticesNeedUpdate = true
            requestAnimationFrame(run)
        }

        cancel = requestAnimationFrame(run)
    }
    let i = 0
    mess(nextVertices)
    let full = false
    points1.children.forEach((points) => {
        let geom = points.geometry
        let vertices = geom.vertices
        vertices.forEach((vertice) => {

            ;(function (i) {
                let delay = Math.random()
                setTimeout(() => {
                    moveTo(vertice,nextVertices[i],30,geom)
                },delay * 1000)
            })(i)

            i ++
            if(i >= nl) {i = 0; full = true;}
        })
    })

    if (!full) {
        // for(i; i < nextVertices.length; i ++){
        //     let delay = Math.random()

        //     setTimeout((i) => {
        //         points1.children[0].geometry.vertices.push(nextVertices[i])
        //     },delay * 1000)
        // }
    }

    setTimeout(()=>{
        points1.children = []
        //scene.remove(points1)
        points2.setRotationFromEuler(points1.rotation.clone())
        //scene.add(points2)
        scene.remove(meshes)
        meshes = points2
        scene.add(meshes)

 // 咋确定帧间隔时间啊？？？？
    },30 * 16.7 + 1000)
}

// mess a array
function mess (arr) {
    let newArr = []
    arr.sort(function(){ return 0.5 - Math.random()})
}
init()

