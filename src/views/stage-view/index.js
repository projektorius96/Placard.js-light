import setStyling from './index.css.js';

/**
 * > **NOTE** : This `stage` view is top-level ViewGroup web-component
 */

export const stage_view = (new URL(import.meta.url)).pathname.split('/').at(-2);
customElements.define(stage_view, class extends HTMLDivElement {
    
    constructor({container = document.body, id = 'stage', scale = 20}){

        setStyling.call(super());

        this.id = id;
        this.scale = scale;

        if (container !== document.body){
            container.prepend(this);
        } else {
            document.body.prepend(this);
        }

        return this;

    }

    connectedCallback(){
        this.setAttribute('readonly:width', Math.floor(this.clientWidth * window.devicePixelRatio))  ;
        this.setAttribute('readonly:height', Math.floor(this.clientHeight * window.devicePixelRatio));
    }

}, {extends: 'div'})