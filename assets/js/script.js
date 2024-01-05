//Global Variables
var posterUrl = "";
var search = "";
var localObj = {
    title: "",
    posterLink: "",
    watched: false,
};





//Event Listeners
$('#movieSearchForm').on("submit", function(e)
{
    e.preventDefault();
    $("#saveBtn").attr("style", "visibility: visible;");
    search = $('input').val();
    omdbCall(search);
    // streamingServicesTest(search);
    $('input').val("");
})

$('#saveBtn').on("click", function(e){
    e.preventDefault();
    if(search !== null && search !== ""){
        saveSearch(search,posterUrl);
        populateFavorites();
        $("#saveBtn").attr("style", "visibility: hidden;");
    }
})

$("#clearBtn").on("click",function(e){
    e.preventDefault();
    localStorage.clear();
    clearFavorites();
})


// $("#movieCard").on("click",function(e){
//     e.preventDefault();
//     // search = $(".moviePoster").id;
//     alert();
//     // omdbCall();
// })





//Functions
function hideElement() {
    $(".quote").attr("style", "visibility:hidden");
}

function omdbCall (search){
    var link = "https://www.omdbapi.com/?apikey=17b8058a&t=" + search;
    fetch (link)
    .then((response)=> response.json())
    .then((returned)=>{

        if (returned.Response === "False"){
            //TODO: Let the user know that their movie wasn't found
        } else{
            console.log(returned);
            console.log(returned.Actors);
            console.log(returned.imdbID);
            $('#returned-title').text(returned.Title);
            $('#returned-title').attr("style","visibility:visible;");
            console.log(returned.Poster);
            posterUrl = returned.Poster;
            $('.returned').attr("src", posterUrl);
            $('.returned').attr("style", "visibility:visible;");
            // cb(search, posterUrl);
            $('#saveBtn').attr("style", "visibility:visible;");
            return search = returned.Title;;
        }
    })
    hideElement();
}

async function streamingServicesTest(title){
    var str = title;
    var strArray = str.split(/(\s+)/);
    for (var i = 0; i<strArray.length; i++){
        if (strArray[i] == " ")
        strArray[i] = '%20';
    }
    console.log(strArray.join(""));
    str = strArray.join("");
    var link = "https://streaming-availability.p.rapidapi.com/search/title?title=" + str + '&country=us&show_type=all&output_language=en';
    
    const url = link;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f00aaee43fmsha67ab85a8c221c8p19a26cjsn5127edbb2a6b',
            'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
        }
    };
    
    try {
        const response = await fetch(url, options);
        const output = await response.json();
        $(".streaming-paragraph").attr("style","visibility:visible;");
        $(".streaming-list-ul").empty();
        var outputArray=output;
        console.log(outputArray);
        var streamingInfoArray = outputArray.result[0].streamingInfo.us;
        for (var i = 0; i < streamingInfoArray.length; i++){
            var service = streamingInfoArray[i].service;
            var type = streamingInfoArray[i].streamingType;
            var vidQuality = streamingInfoArray[i].quality;
            var testLine = document.createElement("li");
            testLine.textContent = cleanerService(service) + " " + cleanerType(type) + " in " + vidQuality + " quality";
            document.querySelector(".streaming-list-ul").appendChild(testLine);
            }
        } catch (error) {
             console.error();
            }
}

function saveSearch(movieTitle, movieURL){
    var retArray = JSON.parse(localStorage.getItem("key"));
    
    if (retArray == null){
    //if there's nothing in localStorage, create an array.
    var array = [];

    //Populate localObj with information either passed to function or from global vars
    localObj.title = search;
    localObj.watched = false;
    localObj.posterLink = movieURL;
    
    //place localObj into the array
    array[0]=localObj;

    //give that array to localStorage
    localStorage.setItem("key", JSON.stringify(array));


    }else if (retArray !== null){
        //if there is already an array in localStorage, populate localObj and push it into the returned, local array.

        //Populate localObj with information either passed to function or from global vars
        localObj.title = search;
        alert(search);
        localObj.watched = false;
        localObj.posterLink = movieURL;

        retArray.push(localObj);
        var newString = JSON.stringify(retArray);
        localStorage.setItem("key", newString);
    }
}

function populateFavorites(){
    clearFavorites();
    var retArray = JSON.parse(localStorage.getItem("key"));
    if (retArray == null){
        return;
    }else if (retArray !== null){
        retArray.reverse();
        for (var i = 0; i < retArray.length; i++){
            var url = retArray[i].posterLink
            var movieId = retArray[i].title;
            var moviePoster = document.createElement("img");
            moviePoster.className = "moviePoster";
            moviePoster.id = movieId;
            moviePoster.setAttribute("src",url);
            $("#library").append(moviePoster);
        }
    }
}

function clearFavorites(){
    $("#library").empty();
}

function cleanerService(location){
    if (location == "apple"){
        location = "AppleTV";
        return location;
    }
    if (location == "prime"){
        location = "Amazon Prime";
        return location;
    }
    if (location == "hulu"){
        location = "Hulu";
        return location;
    }
    if (location == "hbo"){
        location = "HBO";
        return location;
    }
    if (location == "britbox"){
        location = "BritBox";
        return location;
    }
    if (location == "curiosity"){
        location = "CuriosityStream";
        return location;
    }
    if (location == "disney"){
        location = "Disney+";
        return location;
    }
    if (location == "iplayer"){
        location = "iPlayer";
        return location;
    }
    if (location == "netflix"){
        location = "Netflix";
        return location;
    }
    if (location == "curiosity"){
        location = "CuriosityStream";
        return location;
    }
    if (location == "paramount"){
        location = "Paramount+";
        return location;
    }
    if (location == "peacock"){
        location = "PeacockTV";
        return location;
    }
    if (location == "starz"){
        location = "Starz";
        return location;
    }
    if (location == "showtime"){
        location = "Showtime";
        return location;
    }
}

function cleanerType(type){

    if (type == "subscription"){
        type = "with a Subscription";
        return type;
    }
    if (type == "free"){
        type = "for Free";
        return type;
    }
    if (type == "buy"){
        type = "as a Purchase";
        return type;
    }
    if (type == "addon"){
        type = "as an Add-on";
        return type;
    }
    if (type == "rent"){
        type = "as a Rental";
        return type;
    }
}

//On Load
populateFavorites();