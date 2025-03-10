/** 
 * **EXPLAINER** : Herein you define your global user's (developer's) settings
 */
export default class {

    static #snapToGrid = Math.sin(Math.PI/4);

    static init({context}){

        context.snapToGrid = this.#snapToGrid;

        Object.assign(context, {
            global: {
                options: {
                    scalingValue: 4,
                    lineWidth: 4,
                    dashedLineDensity: 1,
                    strokeStyle: 'grey',
                }
            },
        })
    
        return true;

    }

}
