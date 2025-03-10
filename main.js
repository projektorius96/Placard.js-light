import Placard from './src/index';
import SVGraphics from 'svgraphics';
import setViews from './implementation/index.js';
import UserSettings from './user-settings';
import package_json from './package.json' with {type: 'json'}; // DEV_NOTE (1.1, see@1.2) # web.dev highly suggests to use this line only in non-PWA case

document.addEventListener('DOMContentLoaded', ()=>{

    ///* # (@1.2) */
    document.title = package_json.name;

    const 
        { Stage, Layer } = Placard.ViewGroup
        ;

    const stage = new Stage({scale: 8*3});
    
        if ( stage ) {

            stage.add([
                new Layer({ name: 'grid', opacity: 0.25 /* , isSkewed: {sign: -1} */ })
                ,
                new Layer({ name: 'axes-helper', hidden: /* ! */false })
                ,
                new Layer({ name: 'right-triangle', opacity: 0.75 })
                ,
                Reflect.construct(
                    customElements.get(SVGraphics.Views.Circle)
                    ,
                    ArgsList({
                        options: {
                            id: `${SVGraphics.Views.Circle}-123`,
                            fill: 'yellow'
                        }
                    })
                )
            ]);
        
        }
    
    if ( setViews({stage, Placard, UserSettings}) ) {

        window.addEventListener('resize', ()=>{

            setViews({stage, Placard, UserSettings})

                    /* === SVGraphics === */
        
                        if (stage.grid){

                            const
                                circle = document.getElementById(`${SVGraphics.Views.Circle}-123`)
                                ;
                                    circle.addEventListener('mouseenter', function(){
                                        
                                            circle.setter.fill('magenta')
                                        
                                    });
                                    circle.addEventListener('mouseleave', function(){
                                            
                                            circle.setter.fill( circle.ownerSVGElement.parentElement.options.fill )
                    
                                    });

                                circle.setter.translate({
                                    x: stage.grid.SVG.X_IN_MIDDLE, 
                                    y: Number(stage.grid.SVG.Y_IN_MIDDLE)
                                });
                                circle.setter.radius({
                                    radius: Number(stage.grid.GRIDCELL_DIM / 8)
                                });
        
                        }
        
                /* === SVGraphics === */

        });

        // DEV_NOTE # to make sure arbitrary values matches with the `stage.grid` props given, whenever they are available 
        window.dispatchEvent(new Event('resize'))

    }

});