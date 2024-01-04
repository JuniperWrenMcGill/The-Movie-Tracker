var posterUrl = "";
var search = "";

//localStorage work
//store a title, poster link, a bool for watched or not watched, and the links to the API calls.

var localObj = {
    title: "",
    posterLink: "",
    watched: false,
};

//Once a user clicks a save button, localObj will be populated and stored locally into an array of other objects

function omdbCall (){
    var link = "https://www.omdbapi.com/?apikey=17b8058a&t=" + search;
    fetch (link)
    .then((response)=> response.json())
    .then((returned)=>{

        if (returned.Response === "False"){
            //Let the user know that their movie wasn't found
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
        }
    })
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
        const result = await response.json();
        // var resultArray = result[0];
        console.log(result.result[0].streamingInfo.us);
        
        for(var i = 0; i < result.result[0].streamingInfo.us.length; i++){
            console.log(result.result[0].streamingInfo.us[i].service);
            var streamService = document.createElement('li');
            streamService.textContent="Streaming location: " + result.result[0].streamingInfo.us[i].service + " Quality: " + result.result[0].streamingInfo.us[i].quality + " Type: " + result.result[0].streamingInfo.us[i].streamingType;
            document.querySelector(".streaming-list").appendChild(streamService);
        }

    } catch (error) {
        console.error(error);
    }
}

function saveSearch(movieTitle, movieURL){
    var retArray = JSON.parse(localStorage.getItem("key"));
    
    if (retArray == null){
    //if there's nothing in localStorage, create an array.
    var array = [];

    //Populate localObj with information either passed to function or from global vars
    localObj.title = movieTitle;
    localObj.watched = false;
    localObj.posterLink = movieURL;
    
    //place localObj into the array
    array[0]=localObj;

    //give that array to localStorage
    localStorage.setItem("key", JSON.stringify(array));


    }else if (retArray !== null){
        //if there is already an array in localStorage, populate localObj and push it into the returned, local array.

        //Populate localObj with information either passed to function or from global vars
        localObj.title = movieTitle;
        localObj.watched = false;
        localObj.posterLink = movieURL;

        retArray.push(localObj);
        var newString = JSON.stringify(retArray);
        localStorage.setItem("key", newString);
    }
}

$('#movieSearchForm').on("submit", function(e)
{
    e.preventDefault();
    search = $('input').val();
    omdbCall();
    // streamingServicesTest(search);
    $('input').val("");
})

$('#saveBtn').on("click", function(e){
    e.preventDefault();
    if(search !== null && search !== ""){
        saveSearch(search,posterUrl);
        populateFavorites();
    }
})

$("#clearBtn").on("click",function(e){
    e.preventDefault();
    localStorage.clear();
    clearFavorites();
})


function populateFavorites(){
    clearFavorites();
    var retArray = JSON.parse(localStorage.getItem("key"));
    if (retArray == null){
        return;
    }else if (retArray !== null){
        retArray.reverse();
        for (var i = 0; i < retArray.length; i++){
            var url = retArray[i].posterLink
            var moviePoster = document.createElement("img");
            moviePoster.className = "moviePoster";
            moviePoster.setAttribute("src",url);
            $("#library").append(moviePoster);
        }
    }
}

function clearFavorites(){
    $("#library").empty();
}

//shows locally stored favorites on load
populateFavorites();