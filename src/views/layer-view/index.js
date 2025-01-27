import setStyling from './index.css.js';

/**
 * > **NOTE** : This `layer` view is direct child of conceptual top-level ViewGroup.Stage web-component 
*/

export const layer_view = (new URL(import.meta.url)).pathname.split('/').at(-2);
customElements.define(layer_view, class extends HTMLCanvasElement {
    
    constructor({name, opacity, hidden, transform = [1 * window.devicePixelRatio, 0, 0, 1 * window.devicePixelRatio, 0, 0]}){

        if ( setStyling.call( super(), {opacity, hidden} ) ) {

            this.name = name;
            this.id = this.name;
            this.transform = transform;
            this.stack = [];

        }

    }

    connectedCallback(){

        const
            canvasLayer = this
            ,
            canvasLayerContext = this.getContext('2d')
            ,
            transform$noTranslation = [...canvasLayer.transform].slice(0, canvasLayer.transform.length-2)
            ,
            [translationX, translationY] = [...canvasLayer.transform].slice(-2)
            ; 

        Object.assign(canvasLayer, {

            add(viewsList = []){

                canvasLayer.stack = [
                    ...viewsList
                ];

                return true;

            }

        }) 

        Object.assign(canvasLayerContext, {

            fillStroke() {

                this.fill();
                this.stroke();

                return true;
                
            }

            ,

            transformLayer() {  

                const context = this;

                context.setTransform( ...transform$noTranslation , ( translationX ) , ( translationY ) )
                if (context.global.options.startAtQ1) context.rotate(-45 * (Math.PI / 180))

                return true;

            }

        });   

    }

}, {extends: 'canvas'})