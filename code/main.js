const CirclesVersion = "V0.1.0"

let data = {
    objects: {
        main: {
            circles:[],
            runes:[]
        }
    },
    current_object: null,
    initial_objects: null
}

data.current_object = data.objects.main
data.initial_objects = ["main"]

const modules = []
const tabs = []

const tabsMapped = {}

let selectedDIV = editor
let delta = 0
let timeSinceLastFrameStart = 0

let mousePressed = true;
let mouseJustPressed = 0;
let mouseJustUnpressed = 0;

function start() {
    for (tab of tabs) {
        tabsMapped[tab.name] = tab
    }

    editor.start()
}


document.addEventListener("mousedown", function() { 
    if (event.button == 0) {
        mousePressed=true;
        mouseJustPressed = 1;
    }
})
document.addEventListener("mouseup", function() {
    if (event.button == 0) {
        mousePressed=false;
        mouseJustUnpressed = 1;
    }
})

// yoinked from https://stackoverflow.com/questions/3665115/how-to-create-a-file-in-memory-for-user-to-download-but-not-through-server
function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
}

function downloadBuild() {
    download("build.js", builder.getCode)
}



setInterval(function(){ 
    delta = (Date.now() - timeSinceLastFrameStart)/1000;
    timeSinceLastFrameStart = Date.now()

    if (selectedDIV.update) {
        selectedDIV.update()
    }

    mouseJustPressed = 0
    mouseJustUnpressed = 0
}, 10);


function save () {
    download("save.csp", JSON.stringify(JSON.decycle(data)))
    console.log(data)
}

function load() {
    var fr=new FileReader();
        fr.onload=function(){

            let a = JSON.parse(fr.result)
            
            data = JSON.retrocycle(a)

            let crs = []
            for (n in data.objects) {
                let obj = data.objects[n]
                let ctd = obj.circles;
                Array.prototype.push.apply(crs, ctd)
                while (true) {
                    let ntd = []

                    for (let i = 0 ; i < ctd.length ; i++) {
                        Array.prototype.push.apply(crs, ctd[i].circles)
                        Array.prototype.push.apply(ntd, ctd[i].circles)
                    }

                    ctd = ntd
                    if (ctd.length == 0) {
                        break
                    }
                }
            }

            for (circle of crs) {
                if (!(circle.lines instanceof Map)) {
                    circle.lines = new Map()
                }
                for (line of circle.linesConnected) {
                    if (!(line.origin.lines instanceof Map)) {
                        line.origin.lines = new Map()
                    }
                    if (line.origin.lines.get(line.end) == null) {
                        line.origin.lines.set(line.end, [])
                        line.origin.lines.get(line.end).push(line)
                    } else {
                        line.origin.lines.get(line.end).push(line)
                    }
                }
            }

            if (data.initial_objects == null) {
                data.initial_objects = ["main"]
            }
            console.log(data.initial_objects)

        }
    
    fr.readAsText(document.getElementById("fileload").files[0])
}

function switchEditor() {
    selectedDIV = editor
    document.getElementById('editor').style.display = "block";
    document.getElementById('run').style.display = "none";
}

function switchRun() {
    selectedDIV = builder
    document.getElementById('run').style.display = "block";
    document.getElementById('editor').style.display = "none";
}



console.log("Started, please work")