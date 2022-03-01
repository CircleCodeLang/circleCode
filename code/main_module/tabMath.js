mainMod["tab_math"] = {
    name: "tab_math",
    colour: ['rgb(150, 150, 150)',
     'rgb(110, 110, 110)',
     'rgb(130, 130, 130)'],

    runes: {
        add: {
            properties: [
                {
                    name: "toChange",
                    type: "reference",
                    accepted: ["number"],
                },
                {
                    name: "a",
                    type: "referencable",
                    accepted: ["number"],
                    default: 0
                },
                {
                    name: "b",
                    type: "referencable",
                    accepted: ["number"],
                    default: 0
                }
            ],
            draw(x, y, size, ctx) {
                ctx.beginPath()

                ctx.moveTo(x, y + (size*0.6));
                ctx.lineTo(x, y - (size*0.6));

                ctx.moveTo(x + (size*0.6), y);
                ctx.lineTo(x - (size*0.6), y);
                
                ctx.stroke()
                ctx.fill()
            },
            sendToFunction: [
                {
                    type: "property",
                    property: "a",
                    name: "a",
                    default: 0,
                    convert (str) {
                        return str
                    }
                },
                {
                    type: "property",
                    property: "b",
                    name: "b",
                    default: 0,
                    convert (str) {
                        return str
                    }
                },
                {
                    type: "reference",
                    property: "toChange",
                    name: "num",
                    default: 0,
                    convert (str) {
                        return str
                    }
                }
            ],
            activeFunction () {
                return "num[0][num[1]] = a + b"
            },
        },
        multiply: {
            properties: [
                {
                    name: "toChange",
                    type: "reference",
                    accepted: ["number"],
                },
                {
                    name: "a",
                    type: "referencable",
                    accepted: ["number"],
                    default: 0
                },
                {
                    name: "b",
                    type: "referencable",
                    accepted: ["number"],
                    default: 0
                }
            ],
            draw(x, y, size, ctx) {
                ctx.beginPath()

                ctx.moveTo(x + (size*0.4), y + (size*0.4));
                ctx.lineTo(x - (size*0.4), y - (size*0.4));

                ctx.moveTo(x + (size*0.4), y - (size*0.4));
                ctx.lineTo(x - (size*0.4), y + (size*0.4));

                ctx.moveTo(x, y + (size*0.6));
                ctx.lineTo(x, y - (size*0.6));

                ctx.moveTo(x + (size*0.6), y);
                ctx.lineTo(x - (size*0.6), y);


                
                ctx.stroke()
                ctx.fill()
            },
            sendToFunction: [
                {
                    type: "property",
                    property: "a",
                    name: "a",
                    default: 0,
                    convert (str) {
                        return str
                    }
                },
                {
                    type: "property",
                    property: "b",
                    name: "b",
                    default: 0,
                    convert (str) {
                        return str
                    }
                },
                {
                    type: "reference",
                    property: "toChange",
                    name: "num"
                }
            ],
            activeFunction () {
                return "num[0][num[1]] = a * b"
            },
        }
    }
}