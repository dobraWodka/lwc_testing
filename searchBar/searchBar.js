/**
 * Created by yurii.bubis on 10/28/2022.
 */

import {api, LightningElement, wire, track} from 'lwc';
import getPositionsList from '@salesforce/apex/JobApplicationHelper.getPositionsList';
import getPositionsCount from '@salesforce/apex/JobApplicationHelper.getPositionsCount';
import {CurrentPageReference} from "lightning/navigation";
import {fireEvent, registerListener, unregisterAllListeners} from "c/pubsub";
import Page_size from "@salesforce/label/c.Page_size";
import Minimal_salary from "@salesforce/label/c.Minimal_salary";
import Publication_date from "@salesforce/label/c.Publication_date";
import Search_by_position_name from "@salesforce/label/c.Search_by_position_name";


export default class SearchBar extends LightningElement {
    searchKey;
    @api maxPostedDate;
    @api minSalary;
    @api today;
    @api pageSize = 5;
    currentPage = 1;
    @api totalRecords;
    @api allPositions;
    @api error;
    @api totalPages;
    pageSizeLabel = Page_size;
    minSalaryLabel = Minimal_salary;
    publicationDateLabel = Publication_date;
    searchLabel = Search_by_position_name;
    @wire(CurrentPageReference) pageRef;

    get comboboxOptions() {
        return [
            { label: '5', value: '5' },
            { label: '6', value: '6' },
            { label: '7', value: '7' },
            { label: '8', value: '8' },
            { label: '9', value: '9' },
            { label: '10', value: '10' }
        ];
    }
    connectedCallback() {
        registerListener("page", this.handlePage, this);
        let rightNow = new Date();
        rightNow.setMinutes(
            new Date().getMinutes() - new Date().getTimezoneOffset()
        );
        this.today = rightNow.toISOString().slice(0,10);
        this.maxPostedDate = new Date("2000-01-01");
        this.performSearch();
    }

    handlePage(event) {
        this.currentPage = event;
        this.performSearch(0);
    }
    handleComboboxChange(event) {
        this.pageSize = event.detail.value;
        this.currentPage = 1;
        this.performSearch();
    }

    handleSearchChange(event) {
        if (this.searchKey !== event.target.value) {
            this.searchKey = event.target.value;
            this.currentPage = 1;
            this.performSearch(600);
        }
    }
    handleSliderChange(event) {
        this.minSalary = event.detail.value;
        this.currentPage = 1;
        this.performSearch(600);
    }
    handleDateChange(event) {
        this.maxPostedDate = new Date(event.detail.value);
        this.currentPage = 1;
        this.performSearch();
    }
    performSearch(delay = 0) {
        setTimeout(() => {
            this.getCount();
        }, delay);
    }
    getCount() {
        getPositionsCount({
            searchString: this.searchKey,
            salary: this.minSalary,
            maxPostedDate: this.maxPostedDate
        })
            .then(recordsCount => {
                console.log("recordsCount", recordsCount);
                this.totalRecords = recordsCount;
                console.log("this.totalRecords", this.totalRecords);
                if (recordsCount !== 0 && !isNaN(recordsCount)) {
                    this.totalPages = Math.ceil(recordsCount / this.pageSize);
                    this.getList();
                } else {
                    this.allPositions = [];
                    this.totalPages = 1;
                    this.totalRecords = 0;
                }
            })
            .catch(error => {
                this.error = error;
                this.totalRecords = undefined;
            });
    }

    getList() {
        getPositionsList({
            pageNumber: this.currentPage, pageSize: this.pageSize, searchString: this.searchKey,
            salary: this.minSalary, maxPostedDate: this.maxPostedDate
        })
            .then(positionList => {
                this.allPositions = positionList;
                this.error = undefined;
                this.fireSearchEvent();
                this.currentPage = 1;
            })
            .catch(error => {
                this.error = error;
                this.allPositions = undefined;
            });
    }
    fireSearchEvent() {
        fireEvent(this.pageRef, "search", {
            allPositions: this.allPositions,
            recordsCount: this.totalRecords,
            currentPage: this.currentPage,
            pageSize: this.pageSize
        });
    }

    disconnectedCallback() {
        unregisterAllListeners(this);
    }
}