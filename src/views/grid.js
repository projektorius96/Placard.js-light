import { degToRad } from "../trigonometry";

export default class {

    /**
     * The `default.draw` static method takes single `Object` as its input whose properties are as follows:
     * @param {HTMLCanvasElement} canvas - a reference to `canvas` (_a.k.a. Layer_) instance whose context in turn will be modified;
     * @param {Object} options - options you have passed to shape's current `context` of the `canvas`
     * @returns {Boolean} `true`
    */
    static draw({canvas, options}){

        let 
            gridcellDim = stage.grid.GRIDCELL_DIM
            ,
            gridcellMatrix = setInterval(0, gridcellDim, canvas.width)
            ;

        const context = canvas.getContext('2d');
        
        /**
         * @algorithm 3Din2D (part 1)
         */
        if (canvas.isSkewed){

        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

        let sign = canvas?.isSkewed.sign || -1;
        let { a, b, c, d, e, f } = context.getTransform();
            let commonDivisor = 2;
            c = sign * 1  * devicePixelRatio;
            e = -1 * context.canvas.width/commonDivisor * devicePixelRatio
            Object.assign(canvas?.isSkewed, {
                y: Math.sin( degToRad( (90 / commonDivisor) ) )
            })
        context.setTransform(a, b, c, d, e, f);

        /**
         * @algorithm 3Din2D (part 2)
         * @mediaqueries
         */
        if (context.canvas.width <= context.canvas.height && sign > 0) context.translate(-1 * context.canvas.width/4, 0) ;
        if (context.canvas.width <= context.canvas.height && sign < 0) context.translate(+1 * context.canvas.width/4, 0) ;

       /*  context.save() */

        if (options.overrides?.transform){
            if (options.overrides.transform?.translation){
                let { x, y } = options.overrides.transform.translation;
                context.translate(x, y)
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

        } else {

            /**
             * @default
             */
            context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);

        }
        
        
        /** {@link https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations} */
        function drawGrid(x, y, xLen = gridcellDim, yLen = gridcellDim) {

            context.beginPath();
            
            if (!canvas.isSkewed) {
                context.rect(x, y, xLen, yLen)
            } else {
                context.rect(x, y * canvas.isSkewed.y, xLen, yLen * canvas.isSkewed.y)
            }
            context.kind = options?.kind || 'grid';
            context.lineWidth = options?.lineWidth || context.global.options.lineWidth;
            context.strokeStyle = options?.strokeStyle || context.global.options.strokeStyle;
            options.hidden ? false : context.stroke();

            /* context.restore() */

        }

        let
            divisorX = Math.ceil( stage.clientWidth / gridcellDim )
            ,
            divisorY = Math.ceil( stage.clientHeight / gridcellDim )
        ;
        ;[...new Array(divisorY)].map((v, row)=>{

            return v = 1+row;

        }).forEach((row)=>{

            gridcellMatrix.forEach((_, col)=>{

                if(row === 1/* if it's very 1st row, see cont'd... */){

                    drawGrid(gridcellDim * col, 0); /* [cont'd] ...fill the row */

                }

                drawGrid(gridcellDim * col, gridcellDim*row);
            
            })
        

        });

        Object.assign(context, { options });
        return context;
    
    }

}

/**
 * @param {Number} start              - range lower bound
 * @param {Number} step               - range step
 * @param {Number} end                - range upper bound
 * @param {Boolean} [isIncluded=true] - `isIncluded === true ? [start:end] : [start:end)`, where `[]` denotes "closed", and `()` "open" interval a.k.a. range
 * @param {Array} [skip=Array]        - let's say you need dashed polygon
 * @returns {Array}                     one-dimensional array (range)
 */
function setInterval(start, step, end, isIncluded=true, skip = []){
    
    const range = [];
    
    loop1: for (start; start < end + isIncluded; start += step) {

        loop2: for (let items of skip) {

            if (items == start) {

                continue loop1;

            }

        }

        range.push(start)

    }

    return range;

}