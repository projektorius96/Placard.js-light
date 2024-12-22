import Ring from './ring';
import Wireframe from './wireframe';
import RightTriangle from './right-triangle';

import Placard from '../src'
import UserSettings from '../user-settings';

export default function (stage){

    const { setAngle, degToRad } = Placard.Helpers.Trigonometry;

    Placard
    .init({stage, stageScale: 20 /* <=== # thumb of rule is between 15-20 (in relative units) */})
    .on((context)=>{

        if ( UserSettings.init({context}) ) {

            let canvas = context.canvas;
            
            switch (canvas.name) {

                /* === GRID === */
                case 'grid' :
                    stage.layers.grid.addViews([

                        Placard.Views.Grid.draw({
                            canvas: stage.layers.grid, 
                            options: {
                                lineWidth: 2,
                            }}
                        )
                        ,

                    ])
                break;

                /* === ORIGIN === */
                case 'origin':

                    // DEV_NOTE (A) # Mocking the 'right-triangle' scenario where the current transformation matrix is as follows:..
                    context.setTransform(...setAngle(-45), stage.grid.X_IN_MIDDLE, stage.grid.Y_IN_MIDDLE/2);
                    stage.layers[canvas.name].addViews([
                        void function() {

                            // Calculate the midpoint of the viewport
                            const 
                                midX = stage.grid.X_IN_MIDDLE
                                ,
                                midY = stage.grid.Y_IN_MIDDLE
                            ;

                            context.save();

                            // Considering mocked (A) to be reset before following `rotation-about-origin` combination as defined below:..
                            context.resetTransform();

                            /* === rotation-about-origin === */
                            
                                // Translate to the rotation origin (midpoint of viewport)
                                context.translate(midX, midY);

                                // Apply rotation
                                context.rotate( degToRad( -45 ) );

                                // // Translate back by the shape's offset
                                context.translate(-midX, -midY);

                            /* === rotation-about-origin === */

                            // Draw the shape
                            const rectWidth = 30;
                            const rectHeight = 30;
                            context.fillStyle = 'black';
                            context.fillRect(midX - rectWidth / 2, midY - rectHeight / 2, rectWidth, rectHeight);

                            context.restore(); // Restore the state
                        }()
                        ,
                    ])
                break;

                /* === RIGHT-TRIANGLE === */
                case 'right-triangle' :
                    // DEV_NOTE # The line below control grouped (i.e. Layer-level) matrix transformation:
                    context.setTransform(...setAngle(-45), stage.grid.X_IN_MIDDLE, stage.grid.Y_IN_MIDDLE);

                    stage.layers[canvas.name].addViews([
                        RightTriangle.draw({context})
                        ,
                    ])
                break;
                
                /* === WIREFRAMES === */
                case stage.layers.wireframe.name :
                    stage.layers.wireframe.addViews([
                        Wireframe.draw({context})
                        ,
                    ])
                break;

                /* === RING === */
                case stage.layers.ring.name :
                    // DEV_NOTE # The line below control grouped (i.e. Layer-level) matrix transformation:
                    context.setTransform(...setAngle(0), stage.grid.X_IN_MIDDLE, stage.grid.Y_IN_MIDDLE);
                    
                    stage.layers.ring.addViews([
                        Ring.draw({context})
                        ,
                    ])
                break ;

            endswitch:;}

        endif:;}
        
    endon:;})

    return true;

}