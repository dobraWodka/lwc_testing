import {createElement} from "lwc";
import SearchBar from "../searchBar";
import getPositionsList from '@salesforce/apex/JobApplicationHelper.getPositionsList';
import getPositionsCount from '@salesforce/apex/JobApplicationHelper.getPositionsCount';
import {CurrentPageReference} from "lightning/navigation";
import {fireEvent, registerListener, unregisterAllListeners} from "c/pubsub";

jest.mock(
  "@salesforce/apex/JobApplicationHelper.getPositionsList",
  () => {
    return {
      default: jest.fn()
    }
  },
  {virtual: true}
);
jest.mock(
  "@salesforce/apex/JobApplicationHelper.getPositionsCount",
  () => {
    return {
      default: jest.fn()
    }
  },
  {virtual: true}
);
jest.mock(
  "c/pubsub",
  () => {
    return {
      registerListener: jest.fn(),
      unregisterAllListeners: jest.fn(),
      fireEvent: jest.fn()
    }
  });
const positions = [
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

let rightNow = new Date();
rightNow.setMinutes(
  new Date().getMinutes() - new Date().getTimezoneOffset()
);
const TODAY = rightNow.toISOString().slice(0,10);

const MAX_POSTED_DATE = new Date("2000-01-01");

const mockPositionCount = require("./data/positionCount.json");
const mockPositionCountEmpty = require("./data/positionCountEmpty.json");
const mockPositionList = require("./data/positionList.json");
const mockPositionListEmpty = require("./data/positionListEmpty.json");

async function flushPromises() {
  return Promise.resolve();
}
afterEach(() => {
  if (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild);
  }
});

jest.useFakeTimers()

describe("c-search-bar", () => {
  it("search is performing", async () => {
    getPositionsCount.mockResolvedValue(mockPositionCount);
    getPositionsList.mockResolvedValue(mockPositionList);

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();

    await flushPromises();

    // expect(element.getCount).toHaveBeenCalled();
    expect(fireEvent).toHaveBeenCalledWith(undefined, "search", {
      allPositions: positions,
      recordsCount: 2,
      currentPage: 1,
      pageSize: 5
    })
  });
  it("displays no records when getList() returns error", async () => {
    getPositionsCount.mockResolvedValue(mockPositionCount);
    getPositionsList.mockRejectedValue({
      body: {
        exceptionType: "System.QueryException",
        isUserDefinedException: false,
        message: "List has no rows for assignment to SObject",
        stackTrace:
          "Class.MyController.insertRecords: line 10, column 1"
      },
      headers: {},
      status: 500,
      ok: false,
      statusText: "Server Error"
    });

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();

    await flushPromises();

    expect(element.error).not.toBe(undefined);
    expect(element.allPositions).toBe(undefined);
  });
  it("displays no records when getCount() returns error", async () => {
    // getPositionsCount.mockResolvedValue(0);
    getPositionsCount.mockRejectedValue({
      body: {
        exceptionType: "System.QueryException",
        isUserDefinedException: false,
        message: "List has no rows for assignment to SObject",
        stackTrace:
          "Class.MyController.insertRecords: line 10, column 1"
      },
      headers: {},
      status: 500,
      ok: false,
      statusText: "Server Error"
    });

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();

    await flushPromises();

    expect(element.error).not.toBe(undefined);
    expect(element.totalRecords).toBe(undefined);
  });
  it("displays no records when getCount() returns 0", async () => {
    getPositionsCount.mockResolvedValue(0);

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();

    await flushPromises();

    expect(element.totalRecords).toBe(0);
    expect(element.allPositions).toEqual([]);
    expect(element.totalPages).toBe(1);
  });

  it("sets initial values on connectedCallback", async ()=> {
    getPositionsCount.mockResolvedValue(mockPositionCount);
    getPositionsList.mockResolvedValue(mockPositionList);

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();

    await flushPromises();

    expect(element.today).toEqual(TODAY);
    expect(element.maxPostedDate).toEqual(MAX_POSTED_DATE);
    expect(registerListener).toHaveBeenCalled();
  });
  it("handles search changing", async ()=> {
    getPositionsCount.mockResolvedValue(mockPositionCount);
    getPositionsList.mockResolvedValue(mockPositionList);

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();
    await flushPromises();

    const inputEls = element.shadowRoot.querySelectorAll("lightning-input");
    inputEls[0].value = "Sales";
    inputEls[0].dispatchEvent(new CustomEvent("change"));

    jest.runAllTimers();
    await flushPromises();
    expect(fireEvent).toHaveBeenCalledWith({
      allPositions: positions,
      recordsCount: 2,
      currentPage: 1,
      pageSize: 5
    });

  });
  it("handles date changing", async ()=> {
    getPositionsCount.mockResolvedValue(mockPositionCount);
    getPositionsList.mockResolvedValue(mockPositionList);

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();
    await flushPromises();

    const dateInputEl = element.shadowRoot.querySelector("lightning-input.date");
    console.log(dateInputEl.value);
    dateInputEl.value = "2020-11-03";
    console.log(dateInputEl.value);
    // dateInputEl.dispatchEvent(new CustomEvent("change"));
    const date = new Date("2020-11-03");

    jest.runAllTimers();
    await flushPromises();
    expect(element.maxPostedDate).toEqual(date);
  });
  it("handles salary changing", async ()=> {
    getPositionsCount.mockResolvedValue(mockPositionCount);
    getPositionsList.mockResolvedValue(mockPositionList);

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();
    await flushPromises();

    const sliderInputEl = element.shadowRoot.querySelectorAll("lightning-slider");
    sliderInputEl[0].value = 1000;
    // sliderInputEl[0].dispatchEvent(new CustomEvent("change"));

    jest.runAllTimers();
    await flushPromises();
    expect(element.minSalary).toBe(1000);
    expect(element.currentPage).toBe(1);
    expect(fireEvent).toHaveBeenCalled();
  });
  it("handles combobox changing", async ()=> {
    getPositionsCount.mockResolvedValue(mockPositionCount);
    getPositionsList.mockResolvedValue(mockPositionList);

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();
    await flushPromises();

    const comboboxEl = element.shadowRoot.querySelector("lightning-combobox");
    comboboxEl.value = 6;
    comboboxEl.dispatchEvent(new CustomEvent("change"));

    jest.runAllTimers();
    await flushPromises();

    expect(element.pageSize).toBe(6);

  });
  it("handles page event", async ()=> {
    getPositionsCount.mockResolvedValue(mockPositionCount);
    getPositionsList.mockResolvedValue(mockPositionList);

    const element = createElement("c-search-bar", {
      is:SearchBar
    });
    document.body.appendChild(element);

    jest.runAllTimers();
    await flushPromises();

    const myEventCallback = registerListener.mock.calls[0][1];
    myEventCallback.call(element, 2);

    jest.runAllTimers();
    await flushPromises();

    expect(element.currentPage).toBe(2);
    expect(fireEvent).toHaveBeenCalled();

  });

})