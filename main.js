import Placard from './src/index';
import UserSettings from './user-settings';
import package_json from './package.json' with {type: 'json'}; // DEV_NOTE # web.dev suggest to use this line onLY in non-PWA case

const { COLORS } = Placard.Views.Line.ENUMS;
const { setRange } = Placard.Helpers.Misc;
const { degToRad, setAngle } = Placard.Helpers.Trigonometry;

document.addEventListener('DOMContentLoaded', ()=>{

    document.title = package_json.name;

    const stage = new Placard.ViewGroup.Stage({/* container: document.body */});
        if (stage){

            // EXAMPLE # Here is where you instantiate Canvas "layer(s)" dynamically, rather than declaratively as writing <canvas> within index.html
            stage.add([
                new Placard.ViewGroup.Layer({name: 'grid', opacity: 0.25, hidden: !true})
                ,
                new Placard.ViewGroup.Layer({name: 'wireframe', hidden: true})
                ,
                new Placard.ViewGroup.Layer({name: 'polygon', hidden: true})
                ,
                new Placard.ViewGroup.Layer({name: 'circle', hidden: !true})
                ,
            ]);
        
            if ( setViews(stage) ) window.addEventListener('resize', setViews.bind(null, stage)) ;

        }

});

function setViews(stage) {

    Placard
    .init({stage, stageScale: 25 /* <=== # thumb of rule is between 15-20 (in relative units) */})
    .on((context)=>{

        if ( UserSettings.init({context})  ) {

            let canvas = context.canvas;
            switch (canvas.name) {

                case 'grid':
                    Placard.Views.Grid.draw({
                        canvas: stage.layers.grid, 
                        options: {
                            lineWidth: 2,
                        }}
                    );
                break;

                case 'polygon':
                    // DEV_NOTE # The line below control grouped (Layer-level) matrix transformation...
                    context.setTransform(...setAngle(0), stage.grid.X_IN_MIDDLE, stage.grid.Y_IN_MIDDLE);

                    canvas.stack = [
                        Placard.Views.Line.draw({
                            canvas,
                            options: {
                                strokeStyle: COLORS.red.value,
                                points: [ 
                                    [( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM/*  * Placard.Views.Line.DEFAULT_SIN_ANGLE */ )],
                                ]
                            }
                        })
                        ,
                        Placard.Views.Line.draw({
                            canvas,
                            options: {
                                strokeStyle: COLORS.green.value,
                                points: [ 
                                    [( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM * Placard.Views.Line.RIGHTANGLE_SLOPE ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM * Placard.Views.Line.RIGHTANGLE_SLOPE )],
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
                                strokeStyle: COLORS.blue.value,
                                points: [ 
                                    [( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM ) , ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM )] 
                                ]
                                ,
                                overrides: {
                                    transform: {
                                        translation: {
                                            x: context.global.options.scalingValue * stage.grid.GRIDCELL_DIM,
                                            y: context.global.options.scalingValue * stage.grid.GRIDCELL_DIM,
                                        }
                                        ,
                                        angle: degToRad(0)
                                        ,
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
                break;

                case 'wireframe':
                    const { ident, reversed_ident } = Placard.Views.Wireframe.ENUMS.TYPE
                    canvas.stack = [
                        Placard.Views.Wireframe.draw({
                            canvas,
                            options: {
                                type: ident.value
                            }
                        })
                        ,
                        Placard.Views.Wireframe.draw({
                            canvas,
                            options: {
                                type: reversed_ident.value,
                                strokeStyle: COLORS.red.value
                            }
                        })
                        ,
                    ];
                break;

                case stage.layers.circle.id:
                    context.setTransform(...setAngle(0), stage.grid.X_IN_MIDDLE, stage.grid.Y_IN_MIDDLE);      
                    canvas.stack = [
                        setRange(0, 0.1 /* <=== cheap 'anti-aliasing' */, 720, false)
                        .forEach((point)=>{
                            let scalar = ( context.global.options.scalingValue * stage.grid.GRIDCELL_DIM );
                            Placard.Views.Line.draw({
                                canvas,
                                options: {
                                    kind: !true ? 'circle' : 'ring',
                                    strokeStyle: COLORS.green.value,
                                    points: [ 
                                        [scalar * Math.cos(point) , scalar * Math.sin(point)],
                                    ],
                                    overrides: {
                                        transform: {
                                            // DEV_NOTE # without this, the 'ring' would look more like an oval, rather a circle, thus we have to rotate it 45 degrees
                                            angle: (point >= 360 ? 45 : 0)
                                        }
                                    }
                                }
                            })
                        })
                        ,
                    ]
                break;

            endswitch:;}

        endif:;}
        
    endon:;});

    return true;
    
}