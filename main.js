import Placard from './src/index';
import setViews, { Notifier as isObserved } from './implementation/index';
import Observer from './src/observer';
import UserSettings, { GUI } from './user-settings';
import package_json from './package.json' with {type: 'json'}; // DEV_NOTE (1.1, see@1.2) # web.dev highly suggests to use this line only in non-PWA case

document.addEventListener('DOMContentLoaded', ()=>{

    ///* # (@1.2) */
    document.title = package_json.name;

    const sliderInput = Observer(
        'slider-input'
        ,
        new Map([
            ['angle', 0],
            ['sense', -1],
        ])
        ,
        {
            isObserved
        }
    );
    if (sliderInput){
        document.body.appendChild(
            sliderInput
        )
    }

    const 
        { Stage, Layer } = Placard.ViewGroup
        ,
        { Trigonometry } = Placard.Helpers

    const stage = new Stage({scale: 20});
        if ( stage ) {
            stage.add([
                new Layer({ name: 'grid', opacity: 0.25 })
                ,
                new Layer({name: 'wireframe', hidden: true})
                ,
                /* new Layer({name: 'ring', hidden: true})
                , *//* <=== DEV_NOTE (!) # if this is instantiated, session-level (tab) `console.log` may halt the CPU, due to anti-aliasing part in `setRange(0, 0.1 , 720, false)` call, thus commented out */
                new Layer({ name: 'sector' })
                ,
            ]);
        }

    /* === GUI === */

        const slider = GUI.getInput({name: 'slider'});
            if (slider){

                slider
                .on('input', (e)=>{

                    const [ANTI_CLOCKWISE, CLOCKWISE] = [-1, 1];
                        // DEV_NOTE # (un-)comment "ANTI_" suffix and observe how arc's non-linear vector direction (a.k.a. sense) matches with rotation sense itself
                        sliderInput.sense = /* ANTI_ */CLOCKWISE;

                    const current = { angle: sliderInput.sense * Number( Math.floor( e.target.value ) ) };
                        sliderInput.angle = current.angle;
                        
                    // DEV_NOTE (!) # Placard.js reponsive web experience internally based on window.onresize, so we MUST dispatch the following: 
                    window.dispatchEvent(new Event('resize'));
        
                });
                
                // DEV_NOTE (!) # the following dispatch setups initial stage through means of GUI
                slider.dispatchEvent(new Event('input'));

            }

    /* === GUI === */
    
    // DEV_NOTE (!) # crucial line that registers "onresize" Event - without this, window resize would not be detected
    if ( setViews({stage, Placard, UserSettings}) ) window.addEventListener('resize', setViews.bind(null, {stage, Placard, UserSettings})) ;

});