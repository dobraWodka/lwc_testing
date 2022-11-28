/**
 * Created by yurii.bubis on 10/27/2022.
 */

import {LightningElement, track, wire} from 'lwc';
import {fireEvent, registerListener, unregisterAllListeners} from "c/pubsub";
import { CurrentPageReference } from "lightning/navigation";


export default class PaginatorParent extends LightningElement {
    @track error;
    @track allPositions;
    selectedPositions = [];
    @wire(CurrentPageReference) pageRef;
    connectedCallback() {
        registerListener("changepositionpresence", this.handleChangePositionPresence, this);
        registerListener("search", this.handleSearch, this);
        registerListener("clearallpositions", this.clearAllPositions, this);
    }
    disconnectedCallback() {
        unregisterAllListeners(this);
    }
    handleSearch(event) {
        this.allPositions = event.allPositions;
    }
    sendSelected() {
        fireEvent(this.pageRef, "addposition", this.selectedPositions);
    }
    handleChangePositionPresence(event) {
        const position = event.detail;
        let alreadySelected = this.selectedPositions.some(pos => pos.Id === position.Id);
        if (!alreadySelected) {
            this.selectedPositions = [...this.selectedPositions, position];
        } else {
            this.selectedPositions = this.selectedPositions.filter(item => item.Id !== position.Id);
        }
        this.sendSelected();
    }
    clearAllPositions() {
        this.selectedPositions = [];
    }
}