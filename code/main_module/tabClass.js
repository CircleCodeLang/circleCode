mainMod["tab_class"] = {
    name: "tab_class",
    colour: ['rgb(0, 145, 145)',
     'rgb(0, 135, 135)',
     'rgb(0, 105, 105)'],

    runes: {
        on_creation: {
            properties: [
                {
                    name: "passedValues",
                    type: "reference",
                    accepted: ["string"],
                }
            ],
            parameters: [
                {
                    type: "reference",
                    name: "passedValues"
                }
            ],
            draw(x, y, size, ctx) {
                ctx.beginPath()
                ctx.moveTo(x - (size*0.5), y - (size*0.8));
                ctx.lineTo(x + (size*0.7), y);
                ctx.lineTo(x - (size*0.5), y + (size*0.8));
                ctx.closePath()
                ctx.stroke()
                ctx.fill()
            },
            activatorTag: "on_creation"
        },
    }
}
