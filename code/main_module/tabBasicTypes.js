mainMod["tab_basic_types"] = {
    name: "tab_basic_types",
    colour: ['rgb(0, 150, 130)',
     'rgb(0, 140, 110)',
     'rgb(0, 130, 100)'],

    runes: {
        value: {
            type: "any",
            properties: [],
            draw(x, y, size, ctx) {
                ctx.lineWidth /= 2
                ctx.beginPath()

                ctx.moveTo(x, y + (size*0.6));
                ctx.quadraticCurveTo(x, y - (size*0.3), x - (size*0.6), y - (size*0.6));
                ctx.lineTo(x, y + (size*0.6));
                
                ctx.quadraticCurveTo(x, y - (size*0.3), x + (size*0.6), y - (size*0.6));
                ctx.lineTo(x, y + (size*0.6));
                
                ctx.closePath()
                ctx.stroke()
                ctx.fill()
                ctx.lineWidth /= 2
            },
            toVariable (rune) {
                return null;
            }
        },
        number: {
            type: "number",
            properties: [
                {
                    name: "value",
                    type: "value",
                    default: 0,
                    input: "number"
                }
            ],
            draw(x, y, size, ctx) {
                ctx.lineWidth /= 2
                ctx.beginPath()

                ctx.moveTo(x, y + (size*0.7));
                ctx.lineTo(x, y + (size*0.1));
                ctx.moveTo(x - (size*0.3), y + (size*0.4));
                ctx.lineTo(x - (size*0.1), y + (size*0.2));


                ctx.moveTo(x - (size*0.2), y - (size*0.1));
                ctx.lineTo(x - (size*0.2), y - (size*0.7));
                ctx.moveTo(x - (size*0.4), y - (size*0.4));
                ctx.lineTo(x - (size*0.6), y - (size*0.4));
                ctx.lineTo(x - (size*0.6), y - (size*0.7));

                ctx.moveTo(x + (size*0.3), y - (size*0.1));
                ctx.quadraticCurveTo(x + (size*0.1), y - (size*0.1),
                    x + (size*0.1), y - (size*0.35));
                ctx.quadraticCurveTo(x + (size*0.1), y - (size*0.7),
                    x + (size*0.3), y - (size*0.7));
                ctx.quadraticCurveTo(x + (size*0.5), y - (size*0.7),
                    x + (size*0.5), y - (size*0.35));
                ctx.quadraticCurveTo(x + (size*0.5), y - (size*0.1), 
                    x + (size*0.3), y - (size*0.1));

                ctx.moveTo(x + (size*0.2), y - (size*0.4));
                ctx.lineTo(x + (size*0.4), y - (size*0.4));
                
                ctx.stroke()
                ctx.lineWidth *= 2
            },
            toVariable (rune) {
                return rune.properties.value;
            }
        }
    }
}