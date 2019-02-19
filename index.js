'use strict';

let localSearch;
let stateSearch;

//function for when user enters city and state and clicks search
function searchButtonHandle() {
    $('#search-form').on('submit', event => {
        event.preventDefault();
        localSearch = $('#local-search').val();
        stateSearch = $('#state-search').val();
        //getSchoolDiggerData(localSearch, stateSearch);
        //getFoursquareData(localSearch);
        let imagesPage = displayImagesPage();
        $('.education-level-page').html(imagesPage);
        educationLevelClicker();
    })
}



//---------FUNCTIONS FOR EDUCATION LEVEL SELECTOR IMAGES SCREEN

function educationLevelClicker() {
    $('.elementary-student').on('click', 'education-images', function(event) {
        getSchoolDiggerData(localSearch, stateSearch);
    });
    $('.college-student').on('click', 'education-images', function(event) {
        getFoursquareData(localSearch);
    });
}



//Function to display education images screen
function displayImagesPage() {
    return `<section class= "education-images">
        <img class= "elementary-student image" src= 'https://st4.depositphotos.com/4778169/22039/v/1600/depositphotos_220397300-stock-illustration-cute-indonesian-elementary-school-girl.jpg' alt='cartoon elementary school student'/>
        <img class= "college-student image" src= 'https://png.pngtree.com/element_origin_min_pic/17/03/08/7a539c7a7e796d748efb3d9eacb74570.jpg' alt='cartoon college student'/>
    </section>`
};






//----------FUNCTIONS FOR FOURSQUARE API---------------

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



//--------FUNCTIONS FOR SCHOOL DIGGER API-----------

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
// $(educationLevelClicker);