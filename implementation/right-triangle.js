export default class {

    static draw({context, Placard}) {        

        const 
            { COLORS } = Placard.Views.Line.ENUMS
            ,
            { degToRad } = Placard.Helpers.Trigonometry
            ;

        let { canvas } = context;
        return([
            Placard.Views.Line.draw({
                canvas,
                options: {
                    kind: 'vector',
                    strokeStyle: COLORS.red.value,
                    points: [ 
                        [
                            ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM )
                        ].map((each)=>each  *= context.snapToGrid),
                    ]
                }
            })
            ,
            Placard.Views.Line.draw({
                canvas,
                options: {
                    kind: 'vector', /* DEV_NOTE # can be used with `arrowTip`  */
                    /* arrowTip : {baseLength : 20, capLength : 0, width : 20}, */// 1^[PASSING]
                    strokeStyle: COLORS.green.value,
                    points: [ 
                        [
                            ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM/*  * Placard.Views.Line.RIGHTANGLE_SLOPE */ ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM/*  * Placard.Views.Line.RIGHTANGLE_SLOPE */ )
                        ].map((each)=>each  *= 1),
                    ]
                    ,
                    overrides: {
                        transform: {
                            angle: degToRad(45)
                        }
                    }
                }
            })
            ,
            Placard.Views.Line.draw({
                canvas,
                options: {
                    kind: 'vector',
                    strokeStyle: COLORS.blue.value,
                    points: [ 
                        [
                            ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM )
                        ].map((each)=>each  *= context.snapToGrid) 
                    ]
                    ,
                    overrides: {
                        transform: {
                            translation: {
                                x: context.global.options.scalingValue * stage.grid.GRIDCELL_DIM * context.snapToGrid,
                                y: context.global.options.scalingValue * stage.grid.GRIDCELL_DIM * context.snapToGrid,
                            }
                            ,
                            angle: degToRad(90)
                            /* ,
                            scale: {
                                x: 1,
                                y: -1
                            } */// # [PASSING]
                        }
                    }
                }
            })
            ,
        ])

    }

}