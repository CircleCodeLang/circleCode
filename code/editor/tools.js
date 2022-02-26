editor["modes"] = [
    {
        name: "cursor",
        justPressed() {
            p = editor.getLine()
            if (!p) {
                p = editor.findElementIn(data.current_object)
                if (p != null && p != data.current_object) {
                    editor.propertyManager.selected = p;
                    editor.propertyManager.triggerChange()
                }
            } else {
                editor.propertyManager.selected = line;
                editor.propertyManager.triggerChange()
            }
        },
        pressed () {},
        unPressed() {},
        render () {

        },
        predraw () {

        },
        chosen() {
            try {p} catch (ignore) {p=null}
        }
    },
    {
        name: "create_circle",

        justPressed() {
            let selected = {
                centerX : (mouseX*zoom) - x,
                centerY : (mouseY*zoom) - y,
                size: 0,
                circles: [],
                runes: [],
                lines: new Map(),
                linesConnected: [],
                parent: editor.findCircleIn(data.current_object),
                optimalSize: 0,
                properties: {}
            }
            selected.optimalSize = Math.max(Math.min(200 * zoom, editor.findClosestPossibleDistance(selected, selected), isNaN(selected.parent.size) ? 200*zoom : selected.parent.size/2), 0.1)
            selected.size = selected.optimalSize
            selected.parent.circles.push(selected)
            editor.switchTool("move_edit")
            selectedTool.justPressed()

            editor.propertyManager.selected = selected;
            editor.propertyManager.triggerChange()
        },
        pressed () {

        },
        unPressed() {
            selected = null
        },
        render () {

        },
        chosen() {
            
        },
        predraw () {}
    },
    {
        name: "create_line",
        line_: null,
        a: 0,

        justPressed () {
            if (this.a == 0) {
                this.a = 1
                let v = editor.findCircleIn(data.current_object, null);
                if (null == v.parent)
                    return
                this.line_ = {
                    origin: v,
                    end: null,
                    d: 0,
                    properties: {}
                }
            } else {
                let end = editor.findCircleIn(data.current_object, null);
                let origin = this.line_.origin

                if (end == this.line_.origin || end["lines"] == null) {
                    return
                } else {
                    this.line_.end = end

                    let n = 0
                    let a = this.line_.origin.lines.get(end)
                    if (a != null) {
                        n += a.length
                        for (let i = 0 ; i < a.length ; i++) {
                            a[i].d -= 0.25
                        }
                    }
                    a = end.lines.get(this.line_.origin)
                    if (a != null) {

                        n += a.length
                        for (let i = 0 ; i < a.length ; i++) {
                            a[i].d += 0.25
                        }
                    }

                    this.line_.d += n * 0.25
                    

                    if (this.line_.origin.lines.get(end) == null) {
                        this.line_.origin.lines.set(end, [])
                        this.line_.origin.lines.get(end).push(this.line_)
                    } else {
                        this.line_.origin.lines.get(end).push(this.line_)
                    }
                    this.line_.end.linesConnected.push(this.line_)
                    editor.propertyManager.selected = this.line_;
                    editor.propertyManager.triggerChange()
                    this.a = 0
                }
            }
        },

        pressed () {

        },
        unPressed() {

        },
        render () {
            if (this.line_==null || this.a == 0)
                return;

            ctx.beginPath()

                ctx.moveTo(editor.xToCanvas(this.line_.origin.centerX), editor.yToCanvas(this.line_.origin.centerY));
                ctx.lineTo(mouseX, mouseY);

            ctx.stroke()
        },
        chosen() {
            
        },
        predraw () {},
    },
    {
        name: "create_rune",
        tab: null,

        justPressed () {
            if (sel[0] != null) {
                let s = {
                    centerX : (mouseX*zoom) - x,
                    centerY : (mouseY*zoom) - y,
                    size: 0,
                    optimalSize: 0,
                    parent: editor.findCircleIn(data.current_object),
                    rune: sel[0] + "/" + sel[1],
                    properties: {}
                }
                let a = -1
                wh: while (true) {
                    a++
                    for (let i = 0 ; i < s.parent.runes.length ; i++) {
                        if (s.parent.runes[i].properties.name == "Rune" + a) {
                            continue wh
                        }
                    }
                    s.properties.name = "Rune" + a
                    break;
                }

                s.optimalSize = Math.max(Math.min(200 * zoom, editor.findClosestPossibleDistance(s, s), isNaN(s.parent.size) ? 200*zoom : s.parent.size/1.5), 0.1)
                s.size = s.optimalSize
                s.parent.runes.push(s)

                editor.propertyManager.selected = s;
                editor.propertyManager.triggerChange()

                editor.switchTool("move_edit")
                selectedTool.justPressed()
            }
        },

        pressed () {

        },
        unPressed() {

        },
        render () {
            
        },
        chosen() {
            try {sel} catch (ignore) {
                sel = [null, null]
            }
        },
        predraw () {},
        hasUI: true,
        ui() {
            if (this.tab == null) {
                for (let i = 0 ; i < tabs.length ; i++) {
                    let x = Math.floor(h*0.08)
                    let y = Math.floor(h*(i*0.07+0.02))
                    let xs = Math.floor(h*0.18)
                    let ys = Math.floor(h*0.05)

                    if (mouseX <= x + xs && mouseX >= x && mouseY >= y && mouseY <= ys + y) {
                        if (mousePressed) {
                            ctx.fillStyle = tabs[i].colour[2] 
                        } else if (mouseJustUnpressed) {
                            this.tab = tabs[i]
                        } else {
                            ctx.fillStyle = tabs[i].colour[1]
                        }
                    } else {
                        ctx.fillStyle = tabs[i].colour[0] 
                    }
                    
                    ctx.fillRect(x, y, xs, ys)

                    let t = languages.get(tabs[i].name)
                    let ts = (h/Math.max(t.length, 10)/3)
                    ctx.textAlign = "center"
                    ctx.fillStyle = 'rgb(0, 0, 0)'
                    ctx.font = ts + 'px serif';
                    ctx.fillText(t, x+xs/2, y+ys/2+(ts/2));
                    
                }
            } else {
                let i = 0
                for (r in this.tab.runes) {
                    let x = Math.floor(h*0.08)
                    let y = Math.floor(h*(i*0.20+0.09))
                    let s = Math.floor(h*0.18)
                    
                    if (sel[1] != r) {
                        if (mouseX <= x + s && mouseX >= x && mouseY >= y && mouseY <= s + y) {
                            if (mousePressed) {
                                ctx.fillStyle = 'rgb(65, 65, 65)'
                            } else if (mouseJustUnpressed) {
                                sel[1] = r
                                sel[0] = this.tab.name
                                ctx.fillStyle = 'rgb(50, 50, 50)'
                            } else {
                                ctx.fillStyle = 'rgb(80, 80, 80)'
                            }
                        } else {
                            ctx.fillStyle = 'rgb(90, 90, 90)'
                        }
                    } else {
                        ctx.fillStyle = 'rgb(50, 50, 50)'
                    }
                    
                    ctx.fillRect(x, y, s, s)
                    ctx.fillStyle = 'rgb(255, 255, 255)'
                    ctx.strokeStyle = 'rgb(255, 255, 255)'
                    ctx.lineWidth = 8
                    this.tab.runes[r].draw(x+s/2, y+s/2, s/2.4, ctx)
                    ctx.lineWidth = 5
                    i++
                }

                let x = Math.floor(h*0.08)
                let y = Math.floor(h*0.02)
                let xs = Math.floor(h*0.18)
                let ys = Math.floor(h*0.05)

                if (mouseX <= x + xs && mouseX >= x && mouseY >= y && mouseY <= ys + y) {
                    if (mousePressed) {
                        ctx.fillStyle = 'rgb(210, 50, 50)'
                    } else if (mouseJustUnpressed) {
                        this.tab = null
                    } else {
                        ctx.fillStyle = 'rgb(230, 80, 80)'
                    }
                } else {
                    ctx.fillStyle = 'rgb(250, 100, 100)'
                }
                    
                ctx.fillRect(x, y, xs, ys)

                ctx.textAlign = "center"
                ctx.fillStyle = 'rgb(255, 255, 255)'
                ctx.font = Math.min(xs, ys)/1.5 + 'px serif';
                ctx.fillText('back', x+xs/2, y+Math.min(xs, ys)/1.5);
            }
        }
    },
    {
        name: "move_edit",

        chosen() {
            selected = null
        },

        justPressed () {
            selected = editor.findElementIn(data.current_object, null)
            
            if (selected == data.current_object) {
                selected = null
                return
            }
            toEdit = editor.elementsIn(selected)
            toEdit.push(selected)
            prvX = (mouseX*zoom) - x
            prvY = (mouseY*zoom) - y

        },

        pressed () {
            if (!selected)
                return
            
            wheelIgnore = true

            let result = editor.findClosestPossibleDistance(selected, selected)

            let ch = (wheelY / 100)*zoom + (selected.size*wheelY/2500)

            selected.optimalSize += ch

            selected.optimalSize = Math.max(1, selected.optimalSize)

            let prs = selected.size / Math.max(Math.min(selected.optimalSize, Math.abs(result)), 0.00001)


            for (let i = 0 ; i < toEdit.length ; i++) {
                toEdit[i].centerX += ((mouseX*zoom) - x) - prvX
                toEdit[i].centerY += ((mouseY*zoom) - y) - prvY
            }

            prvX = (mouseX*zoom) - x
            prvY = (mouseY*zoom) - y
            
        

            for (let i = 0 ; i < toEdit.length ; i++) {
                toEdit[i].size /= prs
                if (toEdit[i] != selected) {
                    toEdit[i].optimalSize /= prs
                    toEdit[i].centerX = (toEdit[i].centerX - selected.centerX) / prs + selected.centerX
                    toEdit[i].centerY = (toEdit[i].centerY - selected.centerY) / prs + selected.centerY
                }
            }
            
            let a = editor.findCircleIn3(data.current_object, selected, selected)

            if (selected.rune) {
                selected.parent.runes.splice(selected.parent.runes.indexOf(selected), 1)
                selected.parent = a
                a.runes.push(selected)
            } else {
                selected.parent.circles.splice(selected.parent.circles.indexOf(selected), 1)
                selected.parent = a
                a.circles.push(selected)
            }
        },
        unPressed() {
            selected = null
            toEdit = null
        },
        render () {
            
        },
        predraw () {
            let a
            if (selected == null)
                a = editor.findElementIn(data.current_object, null)
            else
                a = selected

            ctx.strokeStyle = "rgb(100, 100, 200)"
            ctx.fillStyle = "rgb(100, 100, 250, 0.2)"
            ctx.beginPath()
            ctx.arc((a.centerX + x)/zoom, (a.centerY + y)/zoom, a.size/zoom, 0, Math.PI*2, false)

            ctx.stroke()
            ctx.fill();
        }
    },
    {   
        name: "delete",
        p: false,

        justPressed () {
            this.p = true
        },

        pressed () {
            if (justPressed.includes("Enter")) {
                let s = editor.findElementIn(data.current_object, null)
                if (s == data.current_object)
                    return;
                
                sa = editor.elementsIn(s);
                sa.push(s)

                a: for (let n = 0 ; n < sa.length ; n++) {
                    if (!sa[n].linesConnected)
                        continue;

                    for (let i = 0 ; i < sa[n].linesConnected.length ; i++) {
                        sa[n].linesConnected[i].origin.lines.delete(sa[n])
                        continue a;
                    }
                }

                if (s.rune) {
                    s.parent.runes.splice(s.parent.runes.indexOf(s), 1);
                } else {
                    s.parent.circles.splice(s.parent.circles.indexOf(s), 1);
                }
            }
        },
        unPressed() {
            this.p = false
        },
        render () {
            if (this.p) {
                ctx.font = '32px serif';
                ctx.fillStyle = "rgb(200, 20, 20)"
                ctx.fillText('Press enter to delete (This change can\'t be undone)', mouseX, mouseY);
            }
        },
        predraw () {
            let a = editor.findElementIn(data.current_object, null)

            ctx.strokeStyle = "rgb(200, 100, 100)"
            ctx.fillStyle = "rgb(255, 50, 50)"
            ctx.beginPath()
            ctx.arc((a.centerX + x)/zoom, (a.centerY + y)/zoom, a.size/zoom, 0, Math.PI*2, false)

            ctx.stroke()
            ctx.fill();
        },
        chosen() {
            
        },
    },
]


editor.switchTool = function (name) {
    for (let i = 0 ; i < editor.modes.length; i++) {
        if (editor.modes[i].name == name) {
            selectedTool = editor.modes[i]
            editor.modes[i].chosen()
        }
    }
}