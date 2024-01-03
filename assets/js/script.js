var url = "";
var search = "";
function omdbTest (){
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
            url = returned.Poster;
            $('.returned').attr("src", url);
        }
    })
}


$('#first_name2').bind("enterKey",function(e){
    e.preventDefault();
    search = $('input').val();
    omdbTest(search);
    $('input').val("");
 });
 $('#first_name2').keyup(function(e){
     if(e.keyCode == 13)
     {
         $(this).trigger("enterKey");
     }
 });
