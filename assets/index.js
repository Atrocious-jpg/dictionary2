const wrapper = document.querySelector(".wrapper"),
  searchInput = wrapper.querySelector("input"),
    wordToBeSearched = wrapper.querySelector(".word .details p"),
    pronounciation = wrapper.querySelector(".word .details span"),
      meaning = wrapper.querySelector(".meaning .details span"),
      example = wrapper.querySelector(".example .details span"),
  synonyms = wrapper.querySelector(".synonym .details span"),
  volume = wrapper.querySelector(".word i"),
  removeIcon = wrapper.querySelector(".search span"),
  infoText = wrapper.querySelector(".info-text");
let audio;

//Interpretation of the data
function output(res, word){
  
  if(!res.title){
    wrapper.classList.add("active");
    var audioFile = res[0].phonetics[0].audio
    var phonet = res[0].meanings[0];
    var exampless = res[0].meanings[0].definitions[0].example;
    var synonymss = phonet.definitions[0]
    volume.onclick = () => {
        audio = new Audio(audioFile);
        audio.play();
    }
     
    //console.log(JSON.stringify(res))
    wordToBeSearched.textContent = word;
    pronounciation.innerHTML = `${res[0].meanings[0].partOfSpeech}</br>${res[0].phonetics[getLen(res[0].phonetics)-1].text}`; 
    meaning.innerHTML = `${phonet.definitions[0].definition}</br>`;
    example.innerHTML = `${exampless ? exampless : "No example found"}`;
    
    
    if(synonymss.synonyms[0] == undefined){

            synonyms.innerHTML = `No synonyms found`;

        }else{

            synonyms.innerHTML = "";

            for (let i = 0; i < 5; i++) {

                let tag = `<span onclick="search(‘${synonymss.synonyms[i]}‘)">${synonymss.synonyms[i]},</span>`;

                tag = i == 4 ? tag = `<span onclick="search(‘${synonymss.synonyms[i]}‘)">${synonymss.synonyms[4]}</span>` : tag;

                synonyms.insertAdjacentHTML("beforeend", tag);

            }

        }
    
    
   console.log(JSON.stringify(res[0].meanings[0].definitions))
   
   } 
    else{
        infoText.innerHTML = `Can’t find the meaning of <span>"${word}"</span>. Please, try to search for another word.</br>${res.resolution}`;
        console.log(JSON.stringify(res))
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

        infoText.innerHTML = `Can’t find the meaning of <span>"${word}"</span>. Please, try to search for another word.`;
        console.log(err)

    });

}
document.querySelector("input").addEventListener("keypress", function(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    fetchApi(searchInput.value)
  }
 }) 
