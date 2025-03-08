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
            line(){},
            vector(){},
            ring(){},
        }
    }

    static {

        Object.freeze(this.ENUMS.COLORS);
        Object.freeze(this.ENUMS.KIND);

    }

    /**
     * The `default.draw` static method takes single `Object` as its input whose properties are as follows:
     * @param {HTMLCanvasElement} canvas - a reference to `canvas` (_a.k.a. Layer_) instance whose context in turn will be modified;
     * @param {Object} options - options you have passed to shape's current `context` of the `canvas`
     * @returns {Boolean} `true`
    */
    static draw({canvas, options}) {

        const context = canvas.getContext('2d');

        context.save()

        // DEV_NOTE # The following are "local" (a.k.a. per-View) matrix transformation(s); this MUST go after per-Layer (i.e. grouped, global – all are synonyms) matrix transformation, if any applied !
        if (options.overrides?.transform){
            if (options.overrides.transform?.translation){
                let { x, y } = options.overrides.transform.translation;
                context.translate(x/*  * context.global.options.responsiveValue */, y/*  * context.global.options.responsiveValue */)
            }
            if (options.overrides.transform?.angle){
                context.rotate(options.overrides.transform.angle)
                context.currentAngle = options.overrides.transform.angle;
            }
            if (options.overrides.transform?.scale){
                let { x, y } = options.overrides.transform.scale;
                context.scale(x, y);
            }
        }

        context.beginPath();

            options.points.forEach((point, i)=>{

                if (i === 0) /* 1^ */ context.moveTo(0, 0) ;
                
                if (!options.dashed){

                    context.lineTo(point[0], point[1]);

                } else {

                    const 
                        perfectBase = 6
                        ,
                        nFingers_mGaps = perfectBase * context.global.options.dashedLineDensity
                        ,
                        _mGaps = (nFingers_mGaps * context.global.options.dashedLineDensity ) - 1
                        ,
                        reminder = Math.abs( ( ( 1 / _mGaps ) - ( 1 / ( nFingers_mGaps * context.global.options.dashedLineDensity ) ) ) ) * _mGaps
                        ,
                        multiplicand = (1 - reminder) / (nFingers_mGaps )
                        ;
                    const weighedLineDistance = Math.sqrt( (point[0]*multiplicand)**2 + (point[1]*multiplicand)**2 );
                    
                    Array( nFingers_mGaps ).fill(nFingers_mGaps).forEach((_, i)=>{

                        switch (i) {
                            case 0:
                                context.moveTo(0, 0) ;
                                context.lineTo(weighedLineDistance, weighedLineDistance) ;
                                break;
                            default: 
                                if (i >= ( perfectBase / 2 ) * context.global.options.dashedLineDensity - (context.global.options.dashedLineDensity - 1) ) return;                                
                                context.moveTo(weighedLineDistance*(i*2), weighedLineDistance*(i*2)) ;
                                context.lineTo(weighedLineDistance*(i*2) + weighedLineDistance, weighedLineDistance*(i*2) + weighedLineDistance);
                                break;
                        }

                    })
                    
                }
                
            });
                    
        context.closePath();

        context.lineWidth = options.lineWidth || context.global.options.lineWidth;
        context.strokeStyle = options.strokeStyle || context.global.options.strokeStyle;
        context.fillStyle = options.fillStyle || context.global.options.fillStyle;
        options.hidden ? false : context.fillStroke();
        
        context.restore();

        options.hidden ? options.kind = `!${this.ENUMS.KIND.vector.value}` : options.kind;
        if (options.kind === this.ENUMS.KIND.vector.value) {

            options.points.forEach((point)=>{
                this.addArrowTip({
                    context,
                    options,
                    x2: point[0],
                    y2: point[1],
                    arrowTip: (options?.arrowTip || {baseLength : (context.global.options.lineWidth * 5), capLength : 0, width : (context.global.options.lineWidth * 5)})
                });
            });

        }

        Object.assign(context, { options });
        return context;

    }

    /**
     * > **NOTE** : Kudos to ChatGPT for this algorithm using `Math.atan2` !
     * 
     * ---
     * 
     * Draws a line with an arrowhead at the end of the line segment.
     * @param {number} x2 - Ending x-coordinate of the line
     * @param {number} y2 - Ending y-coordinate of the line
     * @param {number} [x1] - Starting x-coordinate of the line
     * @param {number} [y1] - Starting y-coordinate of the line
     * @param {number} [baseLength] - Base length of the arrowhead
     * @param {number} [capLength] - Cap length of the arrowhead
     * @param {number} [width] - Width of the arrowhead (distance between its two "wings")
     */
    static addArrowTip({context, options, x2, y2, x1 = 0, y1 = 0, arrowTip}){

        context.save();

            const 
                { x: offsetX, y: offsetY } = (options.overrides?.transform?.translation || {x: 0, y: 0})
                ,
                angleXY = (options.overrides?.transform?.angle || 0)
                ;
                context.translate(offsetX, offsetY)
                context.rotate(angleXY)

            // Calculate the angle of the line
            const angle = Math.atan2(y2 - y1, x2 - x1);
        
            // Arrowhead points
            const arrowAngle1 = angle + Math.atan(arrowTip.width / (2 * arrowTip.baseLength)); // First wing
            const arrowAngle2 = angle - Math.atan(arrowTip.width / (2 * arrowTip.baseLength)); // Second wing
        
            const arrowX1 = x2 - arrowTip.baseLength * Math.cos(arrowAngle1);
            const arrowY1 = y2 - arrowTip.baseLength * Math.sin(arrowAngle1);
            const arrowX2 = x2 - arrowTip.baseLength * Math.cos(arrowAngle2);
            const arrowY2 = y2 - arrowTip.baseLength * Math.sin(arrowAngle2);

            /* === */

            if (options.overrides?.transform){
                if (options.overrides.transform?.scale){
                    let { x, y } = options.overrides.transform.scale;
                    context.scale(x, y);
                }
            }

            /* === */
            
            // Draw the arrowhead
            context.beginPath();
            context.moveTo(x2 + arrowTip.capLength, y2 + arrowTip.capLength);
            context.lineTo(arrowX1, arrowY1);
            context.lineTo(arrowX2, arrowY2);
            context.closePath();

            context.strokeStyle = options.strokeStyle;
            context.fillStyle = options.fillStyle || context.strokeStyle;
            context.fillStroke();

        context.restore();

        return true;

    }

}