const editor = {

    mouseStatus(n) {
        mouseOnCanvas = n;
    },

    getLine() {
        let crs = []
        let obj = data.current_object
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

        for (circle of crs) {
            for (line of circle.linesConnected) {
                let toA = Math.atan2(line.origin.centerX - line.end.centerX, line.origin.centerY - line.end.centerY)
                let fromA = Math.atan2(line.end.centerX-line.origin.centerX, line.end.centerY-line.origin.centerY)

                let fa = 1
                let ta = 1
                let d = line.d
                

                if (Math.hypot(line.end.centerX - line.origin.centerX, line.end.centerY - line.origin.centerY) < Math.max(line.origin.size, line.end.size)) {
                    if (line.origin.size < line.end.size) {
                        fromA += Math.PI
                    } else {
                        toA += Math.PI
                        d *= -1
                    }

                    fa = -1
                }

                if (line.origin.size > line.end.size) {
                    fa *= line.origin.size / line.end.size
                } else {
                    ta *= line.end.size / line.origin.size
                }

                fromA += d / fa
                toA -= d / ta

                let ln = [[this.xToCanvas(Math.sin(fromA)*line.origin.size + line.origin.centerX),
                    this.yToCanvas(Math.cos(fromA)*line.origin.size + line.origin.centerY)],
                    [this.xToCanvas(Math.sin(toA)*line.end.size + line.end.centerX),
                    this.yToCanvas(Math.cos(toA)*line.end.size + line.end.centerY)]]

                let dist = this.distanceFromLine(ln,
                    [mouseX, mouseY]
                )

                if (dist < 30 && 
                    mouseX > Math.min(ln[0][0], ln[1][0]) - 25 &&
                    mouseX < Math.max(ln[0][0], ln[1][0]) + 25 &&
                    mouseY > Math.min(ln[0][1], ln[1][1]) - 25 &&
                    mouseY < Math.max(ln[0][1], ln[1][1]) + 25) {
                    return line
                }

            }
        }

    },

    //line: [[startX, startY], [endX, endY]]
    //point: [X, Y]
    distanceFromLine (line, point) {
        return (Math.abs((line[1][0]-line[0][0])*(line[0][1]-point[1])-(line[0][0]-point[0])*(line[1][1]-line[0][1])))
        /
        Math.sqrt(Math.pow(line[1][0]-line[0][0], 2) + Math.pow(line[1][1]-line[0][1], 2))
    },

    getRune(path) {
        let a = path.split("/")
        return tabsMapped[a[0]].runes[a[1]]
    },

    getTrueMousePosition() {
        return {
            x: (mouseX*zoom) - x,
            y: (mouseY*zoom) - y
        }
    },

    findCircleIn(circle) {
        let pos = this.getTrueMousePosition()
        let found = true
        while (found) {
            let circles = circle.circles

            if (circles == null) {
                return circle;
            }

            found = false;
            for (let i = 0 ; i < circles.length ; i++) {
                if (Math.hypot(pos.x - circles[i].centerX, pos.y - circles[i].centerY) < circles[i].size) {
                    circle = circles[i]
                    found = true
                    break;
                }
            }

        }

        return circle
    },

    findCircleIn(circle, ignore) {
        let pos = this.getTrueMousePosition()
        let found = true
        while (found) {
            let circles = circle.circles

            if (circles == null) {
                return circle;
            }

            found = false;
            for (let i = 0 ; i < circles.length ; i++) {
                if (circles[i] != ignore && Math.hypot(pos.x - circles[i].centerX, pos.y - circles[i].centerY) < circles[i].size) {
                    circle = circles[i]
                    found = true
                    break;
                }
            }

        }

        return circle
    },

    findCircleIn3(circle, ignore, circl) {
        let pos = {x: circl.centerX, y: circl.centerY}
        let found = true
        while (found) {
            let circles = circle.circles

            if (circles == null) {
                return circle;
            }

            found = false;
            for (let i = 0 ; i < circles.length ; i++) {
                if (circles[i] != ignore && Math.hypot(pos.x - circles[i].centerX, pos.y - circles[i].centerY) < circles[i].size) {
                    circle = circles[i]
                    found = true
                    break;
                }
            }

        }

        return circle
    },

    findElementIn(circle, ignore) {
        let pos = this.getTrueMousePosition()
        let found = true
        while (found) {
            let circles = circle.circles

            if (circles == null) {
                return circle;
            }

            if (circle.runes) {
                for (let i = 0 ; i < circle.runes.length ; i++) {
                    if (circle.runes[i] != ignore && Math.hypot(pos.x - circle.runes[i].centerX, pos.y - circle.runes[i].centerY) < circle.runes[i].size) {
                        return circle.runes[i];
                    }
                }
            }   

            found = false;
            for (let i = 0 ; i < circles.length ; i++) {
                if (circles[i] != ignore && Math.hypot(pos.x - circles[i].centerX, pos.y - circles[i].centerY) < circles[i].size) {
                    circle = circles[i]
                    found = true
                    break;
                }
            }

        }
        return circle
    },

    elementsIn(circle) {
        if (circle.rune)
            return []

        let ctd = circle.circles;
        let all = []
        Array.prototype.push.apply(all, circle.runes)
        if (ctd == null) {
            return []
        }
        while (true) {
            let ntd = []
            for (let i = 0 ; i < ctd.length ; i++) {
                Array.prototype.push.apply(ntd, ctd[i].circles)
                Array.prototype.push.apply(all, ctd[i].runes)
            }

            Array.prototype.push.apply(all, ctd)
            ctd = ntd
            if (ctd.length == 0) {
                break
            }
        }

        return all;
    },

    findClosestPossibleDistance(circle, ignored) {
        let closest = circle.parent.size-Math.hypot(circle.centerX - circle.parent.centerX, circle.centerY - circle.parent.centerY);
        if (isNaN(closest)) {
            if (circle.parent.circles.size > 0) {
                closest = Math.hypot(circle.centerX - crs[i].centerX, circle.centerY - crs[i].centerY) - crs[i].size;
            } else {
                closest = 9007199254740991;
            }
        }

        let crs = circle.parent.circles
        for (let i = 0 ; i < crs.length ; i++) {
            let dist = Math.hypot(circle.centerX - crs[i].centerX, circle.centerY - crs[i].centerY) - crs[i].size;
            if (dist < closest && crs[i] != ignored)
                closest = dist
        }

        // if (circle.parent && circle.parent.runes) {
        //     crs = circle.parent.runes
        //     for (let i = 0 ; i < crs.length ; i++) {
        //         let dist = Math.hypot(circle.centerX - crs[i].centerX, circle.centerY - crs[i].centerY) - crs[i].size;
        //         if (dist < closest && crs[i] != ignored)
        //             closest = dist
        //     }
        // }

        return closest;
    },

    start() {
        mouseOnCanvas = false
        componentTab = "basic"
        canvas = document.getElementById('editc');
        ctx = canvas.getContext('2d');

        mouseX = 0
        mouseY = 0
        wheelY = 0
        wheelX = 0

        x = 0;
        y = 0;
        zoom = 1000000;
        wheelIgnore = false

        canvas.addEventListener('contextmenu', event => event.preventDefault());

        canvas.addEventListener("mousemove", function(event) {
            event.preventDefault();
            var rect = canvas.getBoundingClientRect();
            mouseX = event.pageX - rect.left;
            mouseY = event.pageY - rect.top;
        }, false);


        keys = {}
        justPressed = []

        document.addEventListener('keydown', (event) => {
            keys[event.key] = true
            justPressed.push(event.key)
        }, false);

        document.addEventListener('keyup', (event) => {
            keys[event.key] = false
        }, false);


        this.modes[0].img = new Image()
        this.modes[0].img.src = "/icons/cursorl.png"
        this.modes[1].img = new Image()
        this.modes[1].img.src = "/icons/circleTool.png"
        this.modes[2].img = new Image()
        this.modes[2].img.src = "/icons/lineTool.png"
        this.modes[3].img = new Image()
        this.modes[3].img.src = "/icons/runeTool.png"
        this.modes[4].img = new Image()
        this.modes[4].img.src = "/icons/move.png"
        this.modes[5].img = new Image()
        this.modes[5].img.src = "/icons/delete.png"

        

        canvas.addEventListener("wheel", function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            wheelY += event.deltaY
            wheelX += event.deltaX

        })



        selectedTool = this.modes[0]
    },

// coordinate shenanigans

    xToCanvas(_x) {
        return (_x + x)/zoom
    },
    yToCanvas(_y) {
        return (_y + y)/zoom
    },

// update =========================================================================================================
// update =  == ==================================================================================================
// update =  ==  ==================================================================================================
// update =  ==  ==================================================================================================
// update =  ==  ==================================================================================================
// update =  ==  ==================================================================================================
// update ==    ==================================================================================================
// update =========================================================================================================

    update() {

        canvas.width = canvas.offsetWidth
        canvas.height = canvas.offsetHeight
        w = canvas.width
        h = canvas.height

        ctx.clearRect(0, 0, w, h)


        if (mouseX > h*0.27 && mouseOnCanvas) {
            if (mouseJustPressed)
                selectedTool.justPressed()
            else if (mousePressed)
                selectedTool.pressed()
            else if (mouseJustUnpressed) 
                selectedTool.unPressed()
        }

        selectedTool.predraw()

        ctx.strokeStyle = "rgb(255, 255, 255)"
        let ctd = data.current_object.circles;
        while (true) {
            let ntd = []
            for (let i = 0 ; i < ctd.length ; i++) {
                ctx.lineWidth = 5
                ctx.beginPath()
                ctx.arc((ctd[i].centerX + x)/zoom, (ctd[i].centerY + y)/zoom, ctd[i].size/zoom, 0, Math.PI*2, false)
                
                ctx.stroke()

                Array.prototype.push.apply(ntd, ctd[i].circles)

                let runes = ctd[i].runes;

                if (runes) {
                    for (let r = 0 ; r < runes.length ; r++) {
                        ctx.fillStyle = 'rgb(255, 255, 255)'
                        ctx.strokeStyle = 'rgb(255, 255, 255)'
                        let s = runes[r].size/zoom;
                        ctx.lineWidth = 12*(s/100)
                        this.getRune(runes[r].rune).draw((runes[r].centerX + x)/zoom, (runes[r].centerY + y)/zoom, s, ctx)
                    }
                }

                ctx.lineWidth = 4

                if (ctd[i].lines != null) {

                    for (let [l2, li] of ctd[i].lines) {
                        
                        for (let l = 0 ; l < li.length ; l++) {
                            let line = li[l]

                            let toA = Math.atan2(line.origin.centerX - line.end.centerX, line.origin.centerY - line.end.centerY)
                            let fromA = Math.atan2(line.end.centerX-line.origin.centerX, line.end.centerY-line.origin.centerY)

                            let fa = 1
                            let ta = 1
                            let d = line.d
                            

                            if (Math.hypot(line.end.centerX - line.origin.centerX, line.end.centerY - line.origin.centerY) < Math.max(line.origin.size, line.end.size)) {
                                if (line.origin.size < line.end.size) {
                                    fromA += Math.PI
                                } else {
                                    toA += Math.PI
                                    d *= -1
                                }

                                fa = -1
                            }

                            if (line.origin.size > line.end.size) {
                                fa *= line.origin.size / line.end.size
                            } else {
                                ta *= line.end.size / line.origin.size
                            }

                            fromA += d / fa
                            toA -= d / ta
                            
                            ctx.beginPath()

                            ctx.moveTo(
                                this.xToCanvas(Math.sin(fromA+(0.15/fa))*line.origin.size + line.origin.centerX),
                                this.yToCanvas(Math.cos(fromA+(0.15/fa))*line.origin.size + line.origin.centerY)
                            );
                            ctx.lineTo(
                                this.xToCanvas(Math.sin(toA-(0.15/ta))*line.end.size + line.end.centerX),
                                this.yToCanvas(Math.cos(toA-(0.15/ta))*line.end.size + line.end.centerY)
                            );

                            ctx.moveTo(
                                this.xToCanvas(Math.sin(fromA-(0.15/fa))*line.origin.size + line.origin.centerX),
                                this.yToCanvas(Math.cos(fromA-(0.15/fa))*line.origin.size + line.origin.centerY)
                            );
                            ctx.lineTo(
                                this.xToCanvas(Math.sin(toA+(0.15/ta))*line.end.size + line.end.centerX),
                                this.yToCanvas(Math.cos(toA+(0.15/ta))*line.end.size + line.end.centerY)
                            );

                            let c =
                            Math.hypot(
                                (Math.sin(toA-(0.15/ta))*line.end.size + line.end.centerX) - (Math.sin(toA+(0.15/ta))*line.end.size + line.end.centerX),
                                (Math.cos(toA-(0.15/ta))*line.end.size + line.end.centerY) - (Math.cos(toA+(0.15/ta))*line.end.size + line.end.centerY)
                            )/Math.hypot(
                                (Math.sin(fromA)*line.origin.size + line.origin.centerX)-(Math.sin(toA)*line.end.size + line.end.centerX),
                                (Math.cos(fromA)*line.origin.size + line.origin.centerY)-(Math.cos(toA)*line.end.size + line.end.centerY)
                            ) / 1.6

                            ctx.moveTo(
                                this.xToCanvas(((Math.sin(fromA-(0.1/fa))*line.origin.size + line.origin.centerX)*(1+c)+(Math.sin(toA+(0.1/ta))*line.end.size + line.end.centerX)*(1-c))/2),
                                this.yToCanvas(((Math.cos(fromA-(0.1/fa))*line.origin.size + line.origin.centerY)*(1+c)+(Math.cos(toA+(0.1/ta))*line.end.size + line.end.centerY)*(1-c))/2)
                            );

                            ctx.lineTo(
                                this.xToCanvas(((Math.sin(fromA)*line.origin.size + line.origin.centerX)*(1-c)+(Math.sin(toA)*line.end.size + line.end.centerX)*(1+c))/2),
                                this.yToCanvas(((Math.cos(fromA)*line.origin.size + line.origin.centerY)*(1-c)+(Math.cos(toA)*line.end.size + line.end.centerY)*(1+c))/2)
                            );

                            ctx.lineTo(
                                this.xToCanvas(((Math.sin(fromA+(0.1/fa))*line.origin.size + line.origin.centerX)*(1+c)+(Math.sin(toA-(0.1/ta))*line.end.size + line.end.centerX)*(1-c))/2),
                                this.yToCanvas(((Math.cos(fromA+(0.1/fa))*line.origin.size + line.origin.centerY)*(1+c)+(Math.cos(toA-(0.1/ta))*line.end.size + line.end.centerY)*(1-c))/2)
                            );

                            ctx.stroke()

                        }
                    }
                }

            }

            ctd = ntd
            if (ctd.length == 0) {
                break
            }
        }

        selectedTool.render()

        ctx.fillStyle = 'rgb(40, 40, 40)'
        ctx.fillRect(h*0.07, 0, h*0.2, h)
        ctx.fillStyle = 'rgb(20, 20, 20)'
        ctx.fillRect(0, 0, h*0.07, h)

        for (let i = 0 ; i < this.modes.length ; i++) {
            let x = Math.floor(h*0.01)
            let y = Math.floor(h*(i*0.06+0.01))
            let g = Math.floor(h*0.05)

            if (selectedTool == this.modes[i]) {
                ctx.fillStyle = 'rgb(20, 20, 20)'
            }
            else if (mouseX <= x + g && mouseX >= x && mouseY >= y && mouseY <= g + y) {
                if (mousePressed) {
                    ctx.fillStyle = 'rgb(30, 30, 30)'
                } else if (mouseJustUnpressed) {
                    selectedTool = this.modes[i]
                    this.modes[i].chosen()
                    ctx.fillStyle = 'rgb(20, 20, 20)'
                } else {
                    ctx.fillStyle = 'rgb(35, 35, 35)'
                }
            } else {
                ctx.fillStyle = 'rgb(40, 40, 40)'
            }
            
            ctx.fillRect(x, y, g, g)
            let df = g*0.1
            ctx.drawImage(this.modes[i].img, x + df, y + df, g-df*2, g-df*2)
        }

        if (selectedTool.hasUI){
            selectedTool.ui()
        }

        if (!wheelIgnore) {
            if (keys["Control"] || keys["Meta"]) {
                let change = wheelY * zoom / 5000
                zoom = Math.max(zoom + change, 0.01)
                if (zoom > 0.01) {
                    x += change * mouseX
                    y += change * mouseY
                }
            }
            else {
                x -= wheelX * zoom / 2
                y -= wheelY * zoom / 2
            }
        }

        wheelX = 0;
        wheelY = 0;
        wheelIgnore = false
        justPressed = []
    },

}
