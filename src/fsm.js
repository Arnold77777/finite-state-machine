class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(config == null) throw new Error("config isn\'t set");
        this.config = config; 
        this.robotState = this.config.initial;
        this.historyDepth = 1;
        this.historyCurr = 1;
        this.historyArray = ['normal']; 
        this.robotStateMatrix = ['normal','busy','hungry','sleeping'];
        this.robotEventMatrix = ['study','eat','get_up','get_tired','get_hungry'];
        this.robotCrossMatrix = ['busy', null, null, null, null, null, 'normal', null, null, null, null, 'normal', null, 'sleeping', null, null, null, 'hungry', null, 'hungry'];
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.robotState;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {
        var des = false;
        var currState;
        currState = this.robotState;
        for(let i=0;i<4;i++){
            if(this.robotStateMatrix[i] == state) des = true;
        }
        if(des == true) {
            this.robotState = state;
            
            this.historyArray[this.historyCurr] = state;
            this.historyCurr++;
            this.historyDepth = this.historyCurr; 

        } else {
            throw new Error("Required State doesn\'t exist");
        }
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        var currState;
        currState = this.robotState;

        if(this.config['states'][currState]['transitions'][event] == undefined) {
            throw new Error("Required Event doesn\'t exist for current State");
        }
        this.robotState = this.config['states'][currState]['transitions'][event];
                         
        this.historyArray[this.historyCurr] = this.robotState;
        this.historyCurr++;    
        this.historyDepth = this.historyCurr; 

    }

    reset() {
        this.robotState = this.config.initial;
    }

    getStates(event) {
        if(event == null) {
            return this.robotStateMatrix;
        }
        var currArray = [];
        var j=0;
        for(let i=0; i<4; i++) {            
                if(this.config['states'][this.robotStateMatrix[i]]['transitions'][event] != undefined) {
                    currArray[j] = this.robotStateMatrix[i];
                    j++;
                }         
        }
        return currArray;
    }

    undo() {
        if(this.historyDepth == 1) return false;
        if(this.historyCurr == 1) return false;
        this.historyCurr--; 
        this.robotState = this.historyArray[this.historyCurr - 1];
                 
        return true;  
    }

    redo() {
       if(this.historyDepth == 1) return false;
       if(this.historyCurr == this.historyDepth) return false;
       
       this.robotState = this.historyArray[this.historyCurr];
       this.historyCurr++;
       return true;
    }

    clearHistory() {
        this.historyCurr = 1;
        this.historyDepth = 1;
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
