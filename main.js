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
                Reflect.construct(
                    customElements.get(SVGraphics.Views.Circle)
                    ,
                    ArgsList({
                        options: {
                            id: `${SVGraphics.Views.Circle}-123`,
                            radius: 100,
                            fill: 'green'
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

            window.addEventListener('resize', ()=>{
                if (stage.grid){
                    // DEV_NOTE # in the future `SVGraphics` could expose pair of getter|setter to define the following listed below:..
                    document.getElementById(`${SVGraphics.Views.Circle}-123`).setAttribute(alias.get('radius'), stage.grid.GRIDCELL_DIM );
                    document.getElementById(`${SVGraphics.Views.Circle}-123`).setAttribute(alias.get('circleX'), Math.ceil( window.innerWidth / 2 ) );
                    document.getElementById(`${SVGraphics.Views.Circle}-123`).setAttribute(alias.get('circleY'), Math.ceil( window.innerHeight / 2 ) );
                }
            });

        /* === SVGraphics === */
    }

});