mainMod["tab_basic"] = {
    name: "tab_basic",
    colour: ['rgb(15, 200, 245)',
     'rgb(15, 180, 235)',
     'rgb(15, 150, 205)'],

    runes: {
        log: {
            properties: [
                {
                    name: "text",
                    type: "referencable",
                    accepted: "any",
                    default: "Hello world"
                }
            ],
            sendToFunction: [
                {
                    type: "property",
                    property: "text",
                    name: "t",
                    default: "Hello world",
                    convert (str) {
                        return `"${str}"`
                    }
                }
            ],
            activeFunction () {
                return "document.getElementById(\"console\").innerHTML += (t + \"\\n\").replaceAll(\"\\n\", \"<br>\")"
            },
            draw(x, y, size, ctx) {
                ctx.beginPath()
                ctx.moveTo(x, y - (size*0.7));
                ctx.lineTo(x, y + (size*0.7));
                ctx.moveTo(x - (size*0.7), y - (size*0.7));
                ctx.lineTo(x + (size*0.7), y - (size*0.7));
                ctx.stroke()
                ctx.fill()
            },
        },
        clear: {
            properties: [
                {
                    name: "text",
                    type: "referencable",
                    accepted: "any",
                    default: "Hello world"
                }
            ],
            sendToFunction: [
                {
                    type: "property",
                    property: "text",
                    name: "t",
                    default: "Hello world",
                    convert (str) {
                        return `"${str}"`
                    }
                }
            ],
            activeFunction () {
                return "document.getElementById(\"console\").innerHTML = \"\""
            },
            draw(x, y, size, ctx) {
                ctx.beginPath()
                ctx.moveTo(x, y - (size*0.7));
                ctx.lineTo(x, y + (size*0.7));
                ctx.moveTo(x - (size*0.7), y - (size*0.7));
                ctx.lineTo(x + (size*0.7), y - (size*0.7));
                ctx.stroke()
                ctx.fill()
                ctx.beginPath()
                ctx.moveTo(x - (size*0.8), y - (size*0.4));
                ctx.lineTo(x + (size*0.8), y + (size*0.4));
                ctx.stroke()
            },
        }
    }
}