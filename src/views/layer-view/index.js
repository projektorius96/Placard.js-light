import setStyling from './index.css.js';

/**
 * > **NOTE** : This `layer` view is direct child of conceptual top-level ViewGroup.Stage web-component 
*/

export const layer_view = (new URL(import.meta.url)).pathname.split('/').at(-2);
customElements.define(layer_view, class extends HTMLCanvasElement {
    
    constructor({name, opacity, hidden, isSkewed}){

        if ( setStyling.call( super(), {opacity, hidden} ) ) {

            this.name = name;
                this.id = this.name;
            this.isSkewed = isSkewed;
            this.stack = [];

        }

        return this;

    }

    connectedCallback(){

        const
            canvasLayer = this
            ,
            canvasLayerContext = canvasLayer.getContext('2d')
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

        });   

    }

}, {extends: 'canvas'})