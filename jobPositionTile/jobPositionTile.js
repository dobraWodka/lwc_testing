/**
 * Created by yurii.bubis on 10/21/2022.
 */

import {LightningElement, api} from 'lwc';
import Remove_from_selected from "@salesforce/label/c.Remove_from_selected";
import Add_to_selected from "@salesforce/label/c.Add_to_selected";
import Salary from "@salesforce/label/c.Salary";

const CONSTANTS = {
    buttonClassDestructive: "slds-button slds-button_destructive slds-button_stretch slds-m-vertical_x-small",
    buttonClassBrand: "slds-button slds-button_brand slds-button_stretch slds-m-vertical_x-small"
}
export default class JobPositionTile extends LightningElement {
    @api position
    @api showDetails;
    @api selectedPositionsList;
    positionDetails = [];
    buttonLabel;
    buttonClass;
    salaryLabel = Salary;
    utilityRecordFields = ["Id", "Salary__c", "Name"];

    renderedCallback() {
        let alreadySelected = this.selectedPositionsList.some(position => position.Id === this.position.Id);
        if (alreadySelected) {
          this.buttonLabel = Remove_from_selected;
          this.buttonClass = CONSTANTS.buttonClassDestructive;
        } else {
            this.buttonLabel = Add_to_selected;
            this.buttonClass = CONSTANTS.buttonClassBrand;

        }
    }

    selectedPositionHandler(event) {
        event.preventDefault();
        this.showDetails === true ? this.showDetails = false : this.showDetails = true;
        this.positionDetails = [];

        this.createPositionDetails(this.position);
    }

    addPositionToSelected() {
        this.dispatchEvent(new CustomEvent('addtoselected', {
            detail: this.position
        }));
    }
    createPositionDetails(thisPosition) {
        Object.keys(thisPosition).forEach(positionKey => {
            if (!this.utilityRecordFields.includes(positionKey)) {
                const cleanKey = positionKey.replace(/(__c|_)/g, " ") + ":";
                const newObj = {
                    "key": cleanKey,
                    "value": thisPosition[positionKey]
                }
                this.positionDetails.push(newObj);
            }
        });
    }
}