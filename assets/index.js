const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
    wordToBeSearched = wrapper.querySelector(".word .details p"),
    pronounciation = wrapper.querySelector(".word .details span"),
      meaning = wrapper.querySelector(".meaning .details span"),
      example = wrapper.querySelector(".example .details span"),
  synonyms = wrapper.querySelector(".synonym .details .list"),
  volume = wrapper.querySelector(".word i"),
  removeIcon = wrapper.querySelector(".search span"),
  infoText = wrapper.querySelector(".info-text");
let audio;


function checkErr(err){
    if((typeof err === 'undefined') || (err == "")){
       return false; 
    }
    else{
        return true;
    }
}

//Interpretation of the data
function output(res, word){
  
  if(!res.title){
    wrapper.classList.add("active");
    //console.log(JSON.stringify(res))
    
    var phonet = res[0].meanings[0];
    var exampless = res[0].meanings[0].definitions[0].example;
    var synonymss = phonet
    //console.log(JSON.stringify(res[0]))
    var adio;
    try{
        adio = (checkErr(res[0].phonetics[0].audio) ? res[0].phonetics[0].audio : res[0].phonetics[1].audio)
    }catch(e){
        adio = "";
    } 
        
    var audioFile = adio;
    
   
    volume.onclick = () => {
        var playPromise = new Audio(audioFile).play(); 
       
if (playPromise !== undefined) {
  playPromise.then(function() {
  
    
  }).catch(function(error) {
    toastr.options = {
  "closeButton": false,
  "debug": false,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-center",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "3000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
toastr["warning"]("No audio found");
  });
}       
        } 
    
     
    //console.log(JSON.stringify(res[0].phonetics[1]))
    wordToBeSearched.textContent = word;
    pronounciation.innerHTML = `${res[0].meanings[0].partOfSpeech}</br>${res[0].phonetic ? res[0].phonetic : res[0].phonetics[getLen(res[0].phonetics)-1].text}`; 
    meaning.innerHTML = `${phonet.definitions[0].definition}</br>`;
    example.innerHTML = `${exampless ? exampless : "No example found"}`;
   //console.log(res[0].phonetics[1].audio) 
    
    
    if(getLen(synonymss.synonyms) <=0 ){

            synonyms.innerHTML = `No synonyms found`;

        }else{

            synonyms.innerHTML = "";
          //console.log(JSON.stringify(res))

            for (let i = 0; i < getLen(synonymss.synonyms); i++) {

                let tag = `<span onclick="search('${synonymss.synonyms[i]}')"> ${synonymss.synonyms[i]}</span>`;
               
              synonyms.insertAdjacentHTML("beforeend", tag);

            }
        
        }
    
    //console.log(JSON.stringify(res[0].phonetics[1].audio))
    
   //console.log(JSON.stringify(res[0].meanings[0].definitions))
   
   } 
    else{
        infoText.innerHTML = `Can’t find the meaning of <span>"${word}"</span>. Please, try to search for another word.</br>${res.resolution}`;
        
    }
    
}

function getLen(ar){
    return Object.keys(ar).length;
}

function search(word){

    fetchApi(word);

    searchInput.value = word;

}

// fetch api function
function fetchApi(word) {
  infoText.style.color = "#000";
  wrapper.classList.remove("active");
  infoText.innerHTML = `Searching the meaning of <span>"${word}"</span>`;
  let url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
  fetch(url).then(response => response.json()).then(result =>{
  output(result, word);
   }).catch((err) =>{
        wrapper.classList.remove("active");
        infoText.innerHTML = `Can’t find the meaning of <span>"${word}"</span>. Please, try to search for another word.</br>${err}`;
        //console.log(err)

    });

}
document.querySelector("input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchApi(searchInput.value)
  }
 }) 
