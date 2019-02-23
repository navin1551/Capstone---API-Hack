'use strict';

let localSearch;
let stateSearch;

//----------FUNCTION FOR WHEN USER ENTERS CITY AND STATE AND SUBMITS SEARCH--------//
function searchButtonHandle() {
    $('#search-form').on('submit', event => {
        event.preventDefault();
        $('#search-form').hide();
        $('h1').hide();
        $('h3').hide();
        $('#new-search-button').show();
        localSearch = $('#local-search').val();
        stateSearch = $('#state-search').val();
        $('#local-search').val('');
        $('#state-search').val('');
        let imagesPage = displayImagesPage();
        $('.education-level-page').html(imagesPage);
        educationLevelClicker();
        searchNewCityClicker();
    })
}


//---------FUNCTIONS FOR EDUCATION LEVEL SELECTOR SCREEN------------//

//function for when user clicks on either elementary or college student image 
function educationLevelClicker() {
    $('.education-images').on('click', '.apple', function(event) {
        $('.education-images').hide();
        $('.college-results').hide();
        getSchoolDiggerData(localSearch, stateSearch);
    });
    $('.education-images').on('click', '.orange', function(event) {
        $('.education-images').hide();
        $('.school-results').hide();
        getFoursquareData(localSearch);
    });
}

//function for when user clicks the new search button on education level selector screen or results screen
function searchNewCityClicker() {
    $('#new-search-button').on('click', function(event) {
        //$('.education-level-page').html('');
        //$('.results-page').hide();
        //$('#search-form').show();
        //$('h3').show();
        location.reload();
    })
}

//Function to display education level selector screen
function displayImagesPage() {
    return `<section class= "education-images">
        <span>I need a K-12 school</span>
        <img class= "apple image" src= 'https://unixtitan.net/images/apple-clip-ten-4.png' alt='image of apple'/>
        <span>I need a college/university</span>
        <img class= "orange image" src= 'https://cdn.pixabay.com/photo/2016/03/03/17/15/fruit-1234657__340.png' alt='image of orange'/>
    </section>`;
};


//----------FUNCTIONS FOR FOURSQUARE API---------------//

//function to construct query parameters for URL
function formatQueryParams(params) {
    const queryItemsConstruct = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItemsConstruct.join('&');
}

let foursquareBaseURL = "https://api.foursquare.com/v2/venues/search";
let fourSquareClient_id = "0JGSZA4ZMJSTZQYMXUDX3FTJ4VHZZ1PU3TISQ4R4XAPDVMCW";
let fourSquareClient_secret = "0BZDVGOMLQZDCWOAWRFKA0XKQTEBHQPA0PEZZQNI5KBOHK5T";
let limit = 20;

//function to retrieve data using parameters 
function getFoursquareData(query){
    let params = {
        near: query,
        categoryId: '4bf58dd8d48988d1ae941735',
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
        $('#error-message').text('Try Again Later');
    });

}

//function to display Foursquare results to DOM
function displayFourSquareData(responseJson) {
    $('.college-list').empty();
    $('#error-message').empty();
    let venues = responseJson.response.venues;
    if (venues.length > 0) {
        for (let i = 0; i < venues.length; i++) {
            $('.college-list').append(
                `<li><h3>${venues[i].name}</h3>
                <p>${venues[i].location.address}</p>
                </li>`);
                $('.results-page').show();
        }}
    else {
        $('#error-message').text('City Not Found');
    }
};


//--------FUNCTIONS FOR SCHOOL DIGGER API-----------//

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
        console.log(err);
        $('#error-message').text('Try Again Later');
    });

}

//function to display School Digger results to DOM
function displaySchoolDiggerData(responseJson) {
    $('.school-list').empty();
    $('#error-message').empty();
    if (responseJson.schoolList.length > 0) {
        for (let i = 0; i < responseJson.schoolList.length; i++) {
            $('.school-list').append(
                `<li><h3>${responseJson.schoolList[i].schoolName}</h3>
                <a href= "${responseJson.schoolList[i].url}" target= "_blank">Link to school</a>
                <p>${responseJson.schoolList[i].address.street}</p>
                </li>`);
        $('.results-page').show();
        }}
    else {
        $('#error-message').text('City Not Found');
    }

};


$(searchButtonHandle);
