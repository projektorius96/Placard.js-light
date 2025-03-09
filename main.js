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
                            radius: 20,
                            translateX: window.innerWidth/2,
                            translateY: window.innerHeight/2,
                            fill: 'red'
                        }
                    })
                )
            ]);
        
        }
    
    if ( setViews({stage, Placard, UserSettings}) ) {

        window.addEventListener('resize', ()=>{

            setViews({stage, Placard, UserSettings})

                    /* === SVGraphics === */
        
                    /* window.addEventListener('resize', ()=>{ */
                        if (stage.grid){
                            document.querySelector(SVGraphics.Views.Circle).replaceWith(
                                Reflect.construct(
                                    customElements.get(SVGraphics.Views.Circle)
                                    ,
                                    ArgsList({
                                        options: {
                                            id: `${SVGraphics.Views.Circle}-123`,
                                            radius: stage.grid.GRIDCELL_DIM / 4,
                                            translateX: stage.grid.X_IN_MIDDLE / devicePixelRatio,
                                            translateY: stage.grid.Y_IN_MIDDLE / devicePixelRatio,
                                            fill: 'coral'
                                        }
                                    })
                                )
                            )
        
                            const circle = document.getElementById(`${SVGraphics.Views.Circle}-123`);
                                circle.addEventListener('mouseenter', function(){
                                    
                                        this?.setAttribute('fill', 'magenta');
                                    
                                });
                                circle.addEventListener('mouseleave', function(){
                
                                    this?.setAttribute('fill', getComputedStyle(this.parentElement).fill);
                
                                });
        
                        }
                    /* }); */
        
                /* === SVGraphics === */

        });

        window.dispatchEvent(new Event('resize'))

    }

});