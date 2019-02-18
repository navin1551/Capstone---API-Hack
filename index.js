'use strict';


//function for when user enters city and state and clicks search
function searchButtonHandle() {
    $('#search-form').on('submit', event => {
        event.preventDefault();
        const localSearch = $('#local-search').val();
        const stateSearch = $('#state-search').val();
        getSchoolDiggerData(localSearch, stateSearch);
        // getZillowData(localSearch);
        getFoursquareData(localSearch);
        $('.results-page').show();
    })
}




//------------FUNCTIONS FOR ZILLOW API-----------

//function to contruct query parameters for URL
const zillowApiKey = 'X1-ZWz183s1miltzf_77v70';

const zillowBaseUrl = 'http://www.zillow.com/webservice/GetRegionChildren.htm'

function formatQueryParams(params) {
    const queryItemsConstruct = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItemsConstruct.join('&');
}

//function to retrieve data using parameters
function getZillowData(query) {
    const params = {
        "zws-id": zillowApiKey,
         state: query,
         city: query
    };
    const queryString = formatQueryParams(params);
    const url = zillowBaseUrl + '?' + queryString;

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        console.log(responseJson)
    })
    .catch(err => {
        $('#error-message').text('City Not Found');
    });
}


//function to display Zillow results to DOM






//----------FUNCTIONS FOR FOURSQUARE API---------------

//function to construct query parameters for URL

let foursquareBaseURL = "https://api.foursquare.com/v2/venues/search";
let fourSquareClient_id = "0JGSZA4ZMJSTZQYMXUDX3FTJ4VHZZ1PU3TISQ4R4XAPDVMCW";
let fourSquareClient_secret = "0BZDVGOMLQZDCWOAWRFKA0XKQTEBHQPA0PEZZQNI5KBOHK5T";
let limit = 20;

//function to retrieve data using parameters 

function getFoursquareData(query){
    let params = {
        near: query,
        categoryId: '4d4b7105d754a06374d81259',
        v: '20190101',
        client_id: fourSquareClient_id,
        client_secret: fourSquareClient_secret,
        limit: limit
    }
    const queryString = formatQueryParams(params);
    const url = foursquareBaseURL + '?' + queryString;

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        console.log(responseJson)
        displayFourSquareData(responseJson)
    })
    .catch(err => {
        $('#error-message').text('City Not Found');
    });

}


//function to display Foursquare results to DOM
function displayFourSquareData(responseJson) {
    $('.amenities-list').empty();
    $('#error-message').empty();
    if (responseJson.venues.length > 0) {
        for (let i = 0; i < responseJson.venues.length; i++) {
            $('.amenities-list').append(
                `<li><h3>${responseJson.venues[i].id}</h3>
                <p>${responseJson.venues[i].name}</p>
                <p>${responseJson.venues[i].location}</p>
                </li>`);
                $('.results-page').show();
        }}
    else {
        $('#error-message').text('City Not Found');
    }
};



//--------FUCTIONS FOR SCHOOL DIGGER API-----------

//function to construct query parameters for URL
let schoolDiggerBaseURL = "https://api.schooldigger.com/v1.1/schools"
let schoolDiggerAppID = 'f8c794b6';
let schoolDiggerAppKey = 'f678d035c2e5dece512f31b27b32266e';

//function to retrieve data using parameters 

function getSchoolDiggerData(city, state){
    let params = {
        st: state,
        city: city,
        appID: schoolDiggerAppID,
        appKey: schoolDiggerAppKey
    }
    const queryString = formatQueryParams(params);
    const url = schoolDiggerBaseURL + '?' + queryString;

    fetch(url)
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error(response.statusText);
    })
    .then(responseJson => {
        console.log(responseJson)
        displaySchoolDiggerData(responseJson)
    })
    .catch(err => {
        $('#error-message').text('City Not Found');
    });

}

//function to display School Digger results to DOM
function displaySchoolDiggerData(responseJson) {
    $('.school-list').empty();
    if (responseJson.schoolList.length > 0) {
        for (let i = 0; i < responseJson.schoolList.length; i++) {
            $('.school-list').append(
                `<li><h3>${responseJson.schoolList[i].schoolName}</h3>
                <a href= "${response.Json.schoolList[i].url}" target= "_blank">Link to school</a>
                <p>${responseJson.schoolList[i].address}</p>
                </li>`);
        $('.results-page').show();
        }}
        else {
            $('#error-message').text('RESULTS NOT FOUND');
        }

};




$(searchButtonHandle);