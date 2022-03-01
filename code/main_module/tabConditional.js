mainMod["tab_conditional"] = {
    name: "tab_conditional",
    colour: ['rgb(200, 110, 0)',
     'rgb(170, 80, 0)',
     'rgb(1850, 95, 0)'],

    runes: {
        add: {
            properties: [
                {
                    name: "if_true",
                    type: "signal",
                },
                {
                    name: "if_false",
                    type: "signal"
                },
                {
                    name: "a",
                    type: "referencable",
                    accepted: "any",
                    default: "tea"
                },
                {
                    name: "b",
                    type: "referencable",
                    accepted: "any",
                    default: "tea"
                }
            ],
            draw(x, y, size, ctx) {
                ctx.beginPath()

                ctx.moveTo(x + (size*0.5), y + (size*0.3));
                ctx.lineTo(x - (size*0.5), y + (size*0.3));

                ctx.moveTo(x + (size*0.5), y - (size*0.3));
                ctx.lineTo(x - (size*0.5), y - (size*0.3));
                
                ctx.stroke()
                ctx.fill()
            },
            sendToFunction: [
                {
                    type: "property",
                    property: "a",
                    name: "a",
                    default: 0,
                },
                {
                    type: "property",
                    property: "b",
                    name: "b",
                    default: 0,
                },
                {
                    type: "signal",
                    property: "if_true",
                    name: "ifTrue"
                },
                {
                    type: "signal",
                    property: "if_false",
                    name: "ifFalse"
                }
            ],
            buildRune (params) {
                return `if () rune.properties.if_true`
            },
        },
    }
}