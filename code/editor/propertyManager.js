editor["propertyManager"] = {
    selected: null,
    current: null,

    nameTest (rune, after) {
        for (child of rune.parent.runes) {
            if (child.properties.name == after) {
                return rune.properties.name
            }
        }
        if (this.validId(after)) {
            return after
        }


        return rune.properties.name;
    },
    validId(name) {
        return /^[a-zA-Z0-9_]+$/.test(name)
    },

    triggerChange () {
        if (this.selected == null)
            this.selected = data.current_object

        if (this.selected.rune) {

            let d = [
                {
                    type: "title",
                    text: "rune"
                }
            ]

            let r = this.selected
            let r2 = editor.getRune(this.selected.rune)

        
            d.push({
                type: "input",
                text: "name",
                inputType: "text",
                value: r.properties.name,
                name: "name",
                allowedTest: this.nameTest,
                rune: r
            })

            for (val of r2.properties) {
                let e = {}

                if (val.type == "value") {
                    let v = r.properties[val.name]
                    if (!v) {
                        v = null
                    }
                    e = {
                        name: val.name,
                        text: val.name,
                        inputType: val.input,
                        type: "input",
                        value: v,
                        rune: r
                    }

                    if (val.allowedTest) {
                        e.allowedTest = val.allowedTest
                    } else {
                        e.allowedTest = function (r, a) {
                            return a
                        }
                    }

                } else if (val.type == "reference") {
                    let v = r.properties[val.name]
                    if (!v) {
                        v = val.default
                    }
                    e = {
                        name: val.name,
                        text: val.name,
                        type: "reference",
                        value: v,
                        parent: r.parent,
                        allowed: val.accepted,
                        rune: r
                    }
                    if (val.allowedTest) {
                        e.allowedTest = val.allowedTest
                    } else {
                        e.allowedTest = function (r, a) {
                            return a
                        }
                    }
                } else if (val.type == "referencable") {
                    let v = r.properties[val.name]
                    if (!v) {
                        v = val.default
                    }
                    e = {
                        name: val.name,
                        text: val.name,
                        type: "referencable",
                        value: v,
                        parent: r.parent,
                        allowed: val.accepted,
                        rune: r
                    }
                    if (val.allowedTest) {
                        e.allowedTest = val.allowedTest
                    } else {
                        e.allowedTest = function (r, a) {
                            return a
                        }
                    }
                }

                d.push(e)
            }

            this.draw(d)

        } else if (this.selected.origin) {
            let r = this.selected
            let v = r.properties["from"]
            let v2 = r.properties["to"]

            let v3 = r.properties["activating"]
            let v4 = r.properties["signal"]
            if (v3 == null)
                v3 = true
            if (v4 == null)
                v4 = "finished"

            let d = [
                {
                    type: "title",
                    text: "line"
                },
                {
                    name: "activating",
                    text: "activating",
                    type: "checkbox",
                    checked: v3
                }
            ]

            if (!v3) {
                d.push({
                    name: "from",
                    text: "from",
                    type: "reference",
                    value: v,
                    parent: r.origin,
                    allowed: "any"
                }, {
                    name: "to",
                    text: "to",
                    type: "reference",
                    value: v2,
                    parent: r.end,
                    allowed: "any"
                })
            } else {
                d.push({
                    name: "signal",
                    text: "signal",
                    inputType: "text",
                    type: "input",
                    value: v4,
                    rune: r,
                    allowedTest: function (r, a) {
                        return editor.propertyManager.validId(a) ? a : r.properties.name
                    }
                })
            }

            this.draw(d)
        } else {
            let d = [
                {
                    type: "title",
                    text: "circle"
                }
            ]
            this.draw(d)
        }
        
    },

    draw (toDraw) {
        let e = document.getElementById("eproperties")
        e.innerHTML = ""
        if (this.selected.properties)
        for (d of toDraw) {
            if (d.type == "input") {
                var t = document.createElement("div");
                var name = document.createElement("p");
                var input = document.createElement("input");
                t.id = "eprop"
                input.id = "einp"
                input.propid = d.name
                name.id = "ept"
                input.toChange = this.selected.properties
                input.onchange = editor.propertyManager.change
                input.type = d.inputType
                input.value = d.value
                input.allowedTest = d.allowedTest
                input.rune = d.rune
                name.innerHTML = languages.get(d.text) + " : "
                t.appendChild(name)
                name.appendChild(input)

                e.appendChild(t)
            } else if (d.type == "title") {
                var t = document.createElement("div");
                var name = document.createElement("p");
                t.id = "eprop"
                name.id = "ept"
                name.innerHTML = languages.get(d.text)
                t.appendChild(name)

                e.appendChild(t)
            } else if (d.type == "reference") {
                var t = document.createElement("div");
                var name = document.createElement("p");
                var input = document.createElement("select");
                t.id = "eprop"
                input.id = "einp"
                input.propid = d.name

                input.allowedTest = d.allowedTest
                input.rune = d.rune

                name.id = "ept"
                input.toChange = this.selected.properties
                input.onchange = editor.propertyManager.change

                for (ru of d.parent.runes) {
                    let rune = editor.getRune(ru.rune)
                    if (rune.type) {
                        if (d.allowed == "any" || rune.type == "any" || d.allowed.includes(rune.type)) {
                            let el = document.createElement("option");
                            el.value = "ref:" + ru.properties.name
                            el.innerHTML = ru.properties.name
                            input.appendChild(el)
                        }
                    }
                }
                
                let el = document.createElement("option");
                el.value = null
                el.innerHTML = "none"
                input.appendChild(el)

                if (!d.value) {
                    d.value = el.value
                }

                input.value = d.value

                this.selected.properties[d.name] = input.value




                name.innerHTML = languages.get(d.text) + " : "

                t.appendChild(name)
                name.appendChild(input)
                e.appendChild(t)
            } else if (d.type == "referencable") {
                var t = document.createElement("div");
                var name = document.createElement("p");
                var input = document.createElement("input");
                var dl = document.createElement("dataList");
                dl.id = "dataList"
                t.id = "eprop"
                input.id = "einp"
                input.propid = d.name

                input.allowedTest = d.allowedTest
                input.rune = d.rune

                name.id = "ept"
                input.toChange = this.selected.properties
                input.onchange = editor.propertyManager.change

                input.setAttribute('list', dl.id);


                for (ru of d.parent.runes) {
                    let rune = editor.getRune(ru.rune)
                    if (rune.type) {
                        if (d.allowed == "any" || rune.type == "any" || d.allowed.includes(rune.type)) {
                            var el = document.createElement("option");
                            el.value = "ref:" + ru.properties.name
                            el.innerHTML = ru.properties.name
                            dl.appendChild(el)
                        }
                    }
                }

                input.value = d.value

                this.selected.properties[d.name] = input.value




                name.innerHTML = languages.get(d.text) + " : "

                t.appendChild(name)
                name.appendChild(input)
                name.appendChild(dl)
                e.appendChild(t)
            } else if (d.type == "checkbox") {
                var t = document.createElement("div");
                var name = document.createElement("p");
                var input = document.createElement("input");
                t.id = "eprop"
                input.id = "einp"
                input.propid = d.name
                name.id = "ept"
                input.toChange = this.selected.properties
                input.onchange = editor.propertyManager.change
                input.type = "checkbox"

                if (d.checked) {
                    input.setAttribute("checked", "")
                }

                this.selected.properties[d.name] = input.checked
                
                name.innerHTML = languages.get(d.text) + " : "
                t.appendChild(name)
                name.appendChild(input)
                e.appendChild(t)
            }
        }
    },

    change (a) {
        if (a.target.type == "checkbox") {
            a.target.toChange[a.target.propid] = a.target.checked
        } else if (a.target.rune) {
            a.target.toChange[a.target.propid] = a.target.allowedTest(a.target.rune, a.target.value)
        } else {
            a.target.toChange[a.target.propid] = a.target.value
        }

        editor.propertyManager.triggerChange()
    },

}