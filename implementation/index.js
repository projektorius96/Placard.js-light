import AxesHelper from './axes-helper';
import RightTriangle from './right-triangle';

export default function setView({stage, Placard, UserSettings}){

    const 
        CONDITIONS = {
            isMobile : screen.orientation.type.includes('portrait')
        }
        ,
        { setAngle, degToRad } = Placard.Helpers.Trigonometry
        ;

    Placard
    .init({stage})
    .on((context)=>{

        if ( UserSettings.init({context}) ) {

            // DEV_NOTE # scale twice as big, if mobile device is detected :
            CONDITIONS.isMobile ? context.global.options.scalingValue *= 2 : screen.orientation.type.includes('portrait') * 1 ;

            let canvas = context.canvas;
            
            switch (canvas.name) {

                case 'right-triangle' :

                    context.setTransform(...setAngle(45), stage.grid.X_IN_MIDDLE, stage.grid.Y_IN_MIDDLE);
                    context.scale(-1, -1)
                        RightTriangle.draw({context, Placard, options: {
                            dashed: true
                        }});

                break;

                case 'grid' :

                    stage.layers.grid.add([
                        Placard.Views.Grid.draw({
                            canvas, 
                            options: {
                                lineWidth: 1,
                            }}
                        )
                        ,
                    ]);

                break;

                case 'axes-helper' :

                    context.setTransform(...setAngle(0), stage.grid.X_IN_MIDDLE, stage.grid.Y_IN_MIDDLE); // # Layer-level transformation
                        AxesHelper.draw({context, Placard});
                
                break;

            endswitch:;}

        endif:;}
        
    endon:;})
    
    return true;

}