export default class {

    static draw({context, Placard}){

        const 
            { COLORS } = Placard.Views.Line.ENUMS
            ,
            { degToRad } = Placard.Helpers.Trigonometry
            ;

        let { canvas } = context;

        return([
            ...[
                Placard.Views.Line.draw({
                    canvas,
                    options: {
                        hidden: false,
                        label: 'west',
                        kind: 'vector', /* DEV_NOTE # can be used with `arrowTip`  */
                        /* arrowTip : {baseLength : 20, capLength : 0, width : 20}, */// 1^[PASSING]
                        strokeStyle: 'black',
                        lineWidth: context.global.options.lineWidth,
                        points: [ 
                            [
                                ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM )
                            ].map((each)=>each *= context.snapToGrid),
                        ]
                        ,
                        overrides: {
                            transform: {
                                angle: degToRad(-180-45),
                                scale: {
                                    x: 1,
                                    y: 1
                                }
                            }
                        }
                    }
                })
                ,
                Placard.Views.Line.draw({
                    canvas,
                    options: {
                        hidden: false,
                        label: 'east',
                        kind: 'vector', /* DEV_NOTE # can be used with `arrowTip`  */
                        /* arrowTip : {baseLength : 20, capLength : 0, width : 20}, */// 1^[PASSING]
                        strokeStyle: 'black',
                        lineWidth: context.global.options.lineWidth,
                        points: [ 
                            [
                                ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM )
                            ].map((each)=>each *= context.snapToGrid),
                        ]
                        ,
                        overrides: {
                            transform: {
                                angle: degToRad(-45)
                            }
                        }
                    }
                })
            ]
            ,
            ...[
                Placard.Views.Line.draw({
                    canvas,
                    options: {
                        hidden: false,
                        label: 'south',
                        kind: 'vector', /* DEV_NOTE # can be used with `arrowTip`  */
                        /* arrowTip : {baseLength : 20, capLength : 0, width : 20}, */// 1^[PASSING]
                        strokeStyle: 'black',
                        lineWidth: context.global.options.lineWidth,
                        points: [ 
                            [
                                ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM )
                            ].map((each)=>each *= context.snapToGrid),
                        ]
                        ,
                        overrides: {
                            transform: {
                                angle: degToRad(45),
                            },
                        }
                    }
                })
                ,
                Placard.Views.Line.draw({
                    canvas,
                    options: {
                        hidden: false,
                        label: 'north',
                        kind: 'vector', /* DEV_NOTE # can be used with `arrowTip`  */
                        /* arrowTip : {baseLength : 20, capLength : 0, width : 20}, */// 1^[PASSING]
                        strokeStyle: 'black',
                        lineWidth: context.global.options.lineWidth,
                        points: [ 
                            [
                                ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM )
                            ].map((each)=>each *= context.snapToGrid),
                        ]
                        ,
                        overrides: {
                            kind: 'vector',
                            transform: {
                                angle: degToRad(180-45),
                                scale: {
                                    x: -1,
                                    y: 1
                                }
                            }
                        }
                    }
                })
                ,
            ]
        ])

    }

}