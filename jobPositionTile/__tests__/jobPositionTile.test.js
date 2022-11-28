import {createElement} from "lwc";
import JobPositionTile from "../jobPositionTile";
import Remove_from_selected from "@salesforce/label/c.Remove_from_selected";
import Add_to_selected from "@salesforce/label/c.Add_to_selected";

const POSITION =  {
    "attributes": {
      "type": "Position__c",
      "url": "/services/data/v55.0/sobjects/Position__c/a057Q0000056qrYQAQ"
    },
    "Id": "a057Q0000056qrYQAQ",
    "OwnerId": "0057Q000006wnhGQAQ",
    "IsDeleted": false,
    "Name": "Trainee Salesforce Engineer",
    "CreatedDate": "2022-10-18T06:38:26.000+0000",
    "CreatedById": "0057Q000006wnhGQAQ",
    "LastModifiedDate": "2022-10-28T06:36:02.000+0000",
    "LastModifiedById": "0057Q000006wnhGQAQ",
    "SystemModstamp": "2022-10-28T06:36:02.000+0000",
    "LastViewedDate": "2022-10-28T06:36:02.000+0000",
    "LastReferencedDate": "2022-10-28T06:36:02.000+0000",
    "Salary__c": 3300,
    "Required_Skills__c": "Apex, JavaScript",
    "Description__c": "Best job ma brudda",
    "HR_Manager__c": "0057Q000006wnhGQAQ",
    "HR_Name__c": "YuriiBubis",
    "Responsibilities__c": null
  };
const SELECTED_POSITIONS = [
  {
    "attributes": {
      "type": "Position__c",
      "url": "/services/data/v55.0/sobjects/Position__c/a057Q0000056qrYQAQ"
    },
    "Id": "a057Q0000056qrYQAQ",
    "OwnerId": "0057Q000006wnhGQAQ",
    "IsDeleted": false,
    "Name": "Trainee Salesforce Engineer",
    "CreatedDate": "2022-10-18T06:38:26.000+0000",
    "CreatedById": "0057Q000006wnhGQAQ",
    "LastModifiedDate": "2022-10-28T06:36:02.000+0000",
    "LastModifiedById": "0057Q000006wnhGQAQ",
    "SystemModstamp": "2022-10-28T06:36:02.000+0000",
    "LastViewedDate": "2022-10-28T06:36:02.000+0000",
    "LastReferencedDate": "2022-10-28T06:36:02.000+0000",
    "Salary__c": 3300,
    "Required_Skills__c": "Apex, JavaScript",
    "Description__c": "Best job ma brudda",
    "HR_Manager__c": "0057Q000006wnhGQAQ",
    "HR_Name__c": "YuriiBubis",
    "Responsibilities__c": null
  },
  {
    "attributes": {
      "type": "Position__c",
      "url": "/services/data/v55.0/sobjects/Position__c/a057Q0000056sgCQAQ"
    },
    "Id": "a057Q0000056sgCQAQ",
    "OwnerId": "0057Q000006wnhGQAQ",
    "IsDeleted": false,
    "Name": "Junior Salesforce Engineer",
    "CreatedDate": "2022-10-18T09:02:20.000+0000",
    "CreatedById": "0057Q000006wnhGQAQ",
    "LastModifiedDate": "2022-10-28T06:36:02.000+0000",
    "LastModifiedById": "0057Q000006wnhGQAQ",
    "SystemModstamp": "2022-10-28T06:36:02.000+0000",
    "LastViewedDate": "2022-10-28T06:36:02.000+0000",
    "LastReferencedDate": "2022-10-28T06:36:02.000+0000",
    "Salary__c": 4000,
    "Required_Skills__c": "Apex, JavaScript, REST, SOQL",
    "Description__c": "Event better position than Trainee",
    "HR_Manager__c": "0057Q000006wnhGQAQ",
    "HR_Name__c": "YuriiBubis",
    "Responsibilities__c": null
  }
];
const CONSTANTS = {
  buttonClassDestructive: "slds-button slds-button_destructive slds-button_stretch slds-m-vertical_x-small",
  buttonClassBrand: "slds-button slds-button_brand slds-button_stretch slds-m-vertical_x-small"
}

afterEach(() => {
  if (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

async function flushPromises() {
  return Promise.resolve();
}
function elementSetup(position = {}) {
  const element = createElement("c-job-position-tile", {
    is:JobPositionTile
  });
  element.position = position;
  element.selectedPositionsList = SELECTED_POSITIONS;
  document.body.appendChild(element);

  const a = element.shadowRoot.querySelector("a");
  a.click();
  return element;
}

describe("c-job-position-tile", () => {
  it("sets button color and label to Remove", async () => {
    const element = elementSetup(POSITION);
    await flushPromises();

    expect(element.showDetails).toBe(true);

    const buttonEl = element.shadowRoot.querySelector(`button`);
    expect(buttonEl.className).toBe(CONSTANTS.buttonClassDestructive);
    expect(buttonEl.textContent).toBe(Remove_from_selected);
  });

  it("sets button color and label to Add", async () => {
    const element = elementSetup();
    await flushPromises();

    expect(element.showDetails).toBe(true);

    const buttonEl = element.shadowRoot.querySelector(`button`);
    expect(buttonEl.className).toBe(CONSTANTS.buttonClassBrand);
    expect(buttonEl.textContent).toBe(Add_to_selected);
  });

  it("dispatches event", async () => {
    const element = elementSetup();
    await flushPromises();
    const addPositionToSelected = jest.fn();

    element.addEventListener("addtoselected", addPositionToSelected);
    const buttonEl = element.shadowRoot.querySelector(`button`);
    buttonEl.click();
    await flushPromises();

    expect(addPositionToSelected).toHaveBeenCalled();

  });

})
