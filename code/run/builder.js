const builder = {
    get getCode () {
        return code
    },
    run () {
        console.log(code)
        document.getElementById("console").innerHTML = ""
        try {
            let F = new Function(code); 
            F()
        } catch (e) {
            console.log(e)
        }
    },
    build () {
        

        code = `console.log("Running project made with CircleScript ${CirclesVersion}");
        let firstToExec;let lastToExec;let lengthToExec = 0;
        function exec(circle) {
            if (lengthToExec==0) {let a = [circle, null]; lengthToExec=1; firstToExec = a; lastToExec = a} 
            else {let a = [circle, firstToExec]; lengthToExec+=1; firstToExec = a}
        };
        function execNext() {
            let c = firstToExec[0]
            firstToExec = firstToExec[1];
            c.run();
            lengthToExec -= 1;
        };`

        let runesUsed = new Set()

        for (name in data.objects) {
            code += "class " + "obj_" + name + " {constructor() {"

            let activators = {}

            let crs = []
            for (cir in data.objects) {
                let obj = data.objects[name]
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

            for (let i = 0 ; i < crs.length ; i++) {
                code += "this.c" + i + "= {p:null,"

                code += "run () {\n"

                for (rune of crs[i].runes) {
                    let r2 = editor.getRune(rune.rune)

                    if (r2.activeFunction) {
                        code += rune.rune.replaceAll("/", "$_") + "(";
                        let f = true
                        for (send of r2.sendToFunction) {
                            runesUsed.add(rune.rune)
                            if (send.type == "property") {
                                let v = rune.properties[send.property];
                                if (typeof v !== "boolean" && !v) {
                                    v = send.default
                                }
                                if (v.startsWith && v.startsWith("ref:")) {
                                    v = "this.r_" + v.replaceAll("ref:", "")
                                } else {
                                    v = send.convert(v)
                                }

                                if (f) {
                                    f = false
                                } else {
                                    code += ", "
                                }

                                code += v;
                            } else if (send.type == "reference") {
                                let v = rune.properties[send.property];
                                if (typeof v !== "boolean" && !v) {
                                    v = send.default
                                }
                                if (v.startsWith && v.startsWith("ref:")) {
                                    v = `[this, "s_${v.replaceAll("ref:", "")}"]`
                                } else {
                                    v = send.convert(v)
                                }

                                if (f) {
                                    f = false
                                } else {
                                    code += ", "
                                }

                                code += v;
                            }
                        }
                        code += ")\n"
                    }
                }

                let additionalSignals = {}
                let variableChanges = {}

                for (let [key, lines] of crs[i].lines) {
                    for (line of lines) {
                        if ((typeof line.properties.activating !== "boolean" || line.properties.activating)) {
                            if ((!line.properties.signal || line.properties.signal == "finished")) {
                                code += "exec(this.p.c" + crs.indexOf(key) + ");"
                            } else {
                                if (additionalSignals[line.property.signal]) {
                                    additionalSignals[line.property.signal].push(key)
                                } else {
                                    additionalSignals[line.property.signal] = [key]
                                }
                            }
                        } else {
                            if (variableChanges[line.properties.from.replaceAll("ref:", "")]) {
                                variableChanges[line.properties.from.replaceAll("ref:", "")].push(line)
                            } else {
                                variableChanges[line.properties.from.replaceAll("ref:", "")] = [line]
                            }
                        }
                    }
                }
                code += "},"

                for (let n in additionalSignals) {
                    code += `s${n}(){`
                    for (let key of additionalSignals[n]) {
                        code += "exec(this.p.c" + crs.indexOf(key) + ");"
                    }
                    code += "},"
                }

                let things = "";

                for (let rune of crs[i].runes) {
                    let r2 = editor.getRune(rune.rune)

                    if (r2.type) {
                        code += "r_" + rune.properties.name + ":" + r2.toVariable(rune) + ",\n";
                        code += `set s_${rune.properties.name} (value) {this.r_${rune.properties.name}=value;`
                        if (variableChanges[rune.properties.name])
                            for (let line of variableChanges[rune.properties.name]) {
                                code += `this.p.c${crs.indexOf(line.end)}.s_${line.properties.to.replaceAll("ref:", "")}=value;`
                            }
                        code += "},"
                    } else if (r2.constructorCode) {
                        code += r2.constructorCode(rune)
                    }

                    if (r2.activatorTag) {
                        if (activators[r2.activatorTag]) {
                            let l = ["this.c" + i]

                            for (let param of r2.parameters) {
                                if (param.type == "reference") {
                                    l.push(`[this.c${i}, "s_${rune.properties[param.name].replaceAll("ref:", "")}"]`)
                                }
                            }

                            activators[r2.activatorTag].push(l)
                        } else {
                            let l = ["this.c" + i]

                            for (let param of r2.parameters) {
                                if (param.type == "reference") {
                                    l.push(`[this.c${i}, "s_${rune.properties[param.name].replaceAll("ref:", "")}"]`)
                                }
                            }

                            activators[r2.activatorTag] = [l]
                        }
                    }

                }

                code += "};\n"

                code += `this.c${i}.p = this;`
            }
            
            code += "this.activators = {"
            for (n in activators) {
                code += n + ": ["
                for (os of activators[n]) {
                    code += "["
                    for (let o of os) {
                        code += o + ","
                    }
                    code += "]"
                }
                code += "]"
            }

            code += "}}};\n"

        }


        for (rune of runesUsed.values()) {
            let r = editor.getRune(rune)
            if (r.sendToFunction) {
                code += "function " + rune.replaceAll("/", "$_") + "("
                let f = true
                for (send of r.sendToFunction) {
                    if (f) {
                        f = false
                    } else {
                        code += ", "
                    }
                    code += send.name
                }
                code += ") {" + r.activeFunction() + "};"
            }
        }

        code += "let o;"
        for (start of data.initial_objects) {
            code += `o = new obj_${start}(); if (o.activators.on_creation) {for (let a of o.activators.on_creation) {if(a[1]){a[1][0][a[1][1]]="${CirclesVersion}"};exec(a[0]);}};`
        }

        code += "while (lengthToExec > 0) {execNext()};"

    }
}