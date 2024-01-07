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
    streamingServicesTest(search);
    omdbCall(search,setSearch());
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








//Functions

//This lets us set the global variable from within a .then function.
function setSearch(handedTitle){
    search = handedTitle;
}

//This hides an element.
function hideElement() {
    $(".quote").attr("style", "visibility:hidden");
}

//This calls the OMDB API and displays the necessary content to the user.
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
            setSearch(returned.Title);
        }
    })
    hideElement();
}

//This calls the streaming services API as well as delivers the output.
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
        var stringArray =[];
        var streamingInfoArray = outputArray.result[0].streamingInfo.us;
        for (var i = 0; i < streamingInfoArray.length; i++){
            var service = streamingInfoArray[i].service;
            var type = streamingInfoArray[i].streamingType;
            var string = cleanerService(service) + " " + cleanerType(type);
            var service = streamingInfoArray[i].service;
            var type = streamingInfoArray[i].streamingType;
            var testLine = document.createElement("li");
            testLine.textContent = cleanerService(service) + " " + cleanerType(type);
            document.querySelector(".streaming-list-ul").appendChild(testLine);
            stringArray.push(testLine);
            }
        } catch (error) {
             console.error();
            }
}

//This writes certain information from the API calls to localStorage
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
        localObj.watched = false;
        localObj.posterLink = movieURL;
        retArray.push(localObj);
        var newString = JSON.stringify(retArray);
        localStorage.setItem("key", newString);
    }
}

//This function populates the favorites bar, taking information from localStorage and creating tiles for each item.
//It also tags/classifies the new elements appropriately and creates an eventlistenner so they can be used as buttons.
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
    createMovieListener();
}

//This function simply clears the favorites so that it can be re-populated
function clearFavorites(){
    $("#library").empty();

}

//This function cleans up the output of the streaming services API with more quickly recognizeable output.
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

//Same as cleaner function, but for the type of media. 
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

//Since creating a global listener doesn't seem to work for elements created in the code, this function is called when the 
//favorites bar populates.
function createMovieListener(){
    $(".moviePoster").on("click",function(e){
        e.preventDefault();
        search = this.id;
        omdbCall(search,setSearch());
        window.scrollTo(0,0);
    });
}

//On Load
populateFavorites();