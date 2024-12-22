export default class {

    static RIGHTANGLE_SLOPE = (1 / Math.sin(Math.PI / 4));

    static ENUMS = {
        COLORS: {
            red(){},
            green(){},
            blue(){},
        }
        ,
        KIND: {
            vector(){},
            line(){},
            ring(){},
        }
    }

    static {

        Object.freeze(this.ENUMS.COLORS);
        Object.freeze(this.ENUMS.KIND);

    }

    /**
     * The `default.draw` static method takes single `Object` as its input whose properties are as follows:
     * @param {HTMLCanvasElement} canvas - a reference to `canvas` (a.k.a. Layer) instance, whose context in turn is being modified;
     * @param {Object} options - options you have passed to shape current `context` of the `canvas`
     * @returns {Object} The `options`
     */
    static draw({canvas, options}) {

        const context = canvas.getContext('2d');

        context.save()

        // DEV_NOTE # local (per-View) matrix transformation(s); this MUST go after per-Layer (shared) matrix transformation, if any !
        if (options.overrides?.transform){
            if (options.overrides.transform?.translation){
                let { x, y } = options.overrides.transform.translation;
                context.translate(x * context.global.options.responsiveValue, y * context.global.options.responsiveValue)
            }
            if (options.overrides.transform?.angle){
                context.rotate(options.overrides.transform.angle)
            }
            if (options.overrides.transform?.scale){
                let { x, y } = options.overrides.transform.scale;
                context.scale(x, y);
            }
        }

        context.beginPath();

            options.points
            .forEach((point, i)=>{

                if (i === 0){

                    switch (options.kind) {
                        case 'ring':
                            context.moveTo(
                                ( context.global.options.responsiveValue * ( point[0] ) ) - (options.lineWidth ||  context.global.options.lineWidth)
                                , 
                                ( context.global.options.responsiveValue * ( point[1] ) ) - (options.lineWidth ||  context.global.options.lineWidth)
                            );
                            break;
                        default /* === 'circle' || === 'line' */:
                            context.moveTo(
                                0
                                , 
                                0
                            );
                            break;
                    }

                }
                context.lineTo(
                    (context.global.options.responsiveValue * (point[0]))
                    , 
                    (context.global.options.responsiveValue * (point[1]))
                );
                
            });
                    
        context.closePath();

        context.kind = options.kind || 'line';
        context.lineWidth = options.lineWidth || context.global.options.lineWidth;
        context.strokeStyle = options.strokeStyle || context.global.options.strokeStyle;
        context.fillStyle = options.fillStyle || context.global.options.fillStyle;
        context.fillStroke();
        
        context.restore()

        return true;

    }

}