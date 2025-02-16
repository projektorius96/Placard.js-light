import Placard from './src/index';
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
            ]);
        
        }
    
    if ( setViews({stage, Placard, UserSettings}) ) window.addEventListener('resize', setViews.bind(null, {stage, Placard, UserSettings})) ;

});