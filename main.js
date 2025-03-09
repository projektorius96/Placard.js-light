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
                            fill: 'red'
                        }
                    })
                )
            ]);
        
        }
    
    if ( setViews({stage, Placard, UserSettings}) ) {

        window.addEventListener('resize', setViews.bind(null, {stage, Placard, UserSettings}));

        /* === SVGraphics === */
        
            const alias = new Map([
                ['radius', 'r'],
                ['circleX', 'cx'],
                ['circleY', 'cy'],
            ]);

            const circle = document.getElementById(`${SVGraphics.Views.Circle}-123`);
            const computedCSS = getComputedStyle(circle.parentElement);

                circle.addEventListener('mouseenter', function(){
                    
                        this?.setAttribute('fill', 'green');
                    
                })

                circle.addEventListener('mouseleave', function(){

                    this?.setAttribute('fill', computedCSS.fill);

                })

            window.addEventListener('resize', ()=>{
                if (stage.grid){
                    // DEV_NOTE # in the future `SVGraphics` could expose pair of getter|setter to define the following listed below:..
                    circle?.setAttribute(alias.get('radius'), stage.grid.GRIDCELL_DIM / 4 );
                    circle?.setAttribute(alias.get('circleX'), Math.floor( window.innerWidth / 2 ) );
                    circle?.setAttribute(alias.get('circleY'), Math.floor( window.innerHeight / 2 ) );
                }
            });

        /* === SVGraphics === */
    }

});