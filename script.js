const API_KEY=`api_key=029278d34bbce87676426771e3d32fda`;

const baseUrl=`https://api.themoviedb.org/3`;

const imgUrl="https://image.tmdb.org/t/p/w500";
const searchUrl=baseUrl+"/search/movie?"+API_KEY;

const genres=[
    {
      "id": 28,
      "name": "Action"
    },
    {
      "id": 12,
      "name": "Adventure"
    },
    {
      "id": 16,
      "name": "Animation"
    },
    {
      "id": 35,
      "name": "Comedy"
    },
    {
      "id": 80,
      "name": "Crime"
    },
    {
      "id": 99,
      "name": "Documentary"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Family"
    },
    {
      "id": 14,
      "name": "Fantasy"
    },
    {
      "id": 36,
      "name": "History"
    },
    {
      "id": 27,
      "name": "Horror"
    },
    {
      "id": 10402,
      "name": "Music"
    },
    {
      "id": 9648,
      "name": "Mystery"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Science Fiction"
    },
    {
      "id": 10770,
      "name": "TV Movie"
    },
    {
      "id": 53,
      "name": "Thriller"
    },
    {
      "id": 10752,
      "name": "War"
    },
    {
      "id": 37,
      "name": "Western"
    }
];


const apiUrl=`${baseUrl}/discover/movie?sort_by=popularity.desc&${API_KEY}`;

const main=document.querySelector("#main");
const form=document.querySelector("#form");
const search=document.querySelector("#search");
const tagsEl=document.querySelector("#tags");

let seletedGenre=[];
setGenre();
function setGenre(){
    tagsEl.innerHTML="";
    genres.forEach(genre => {
        const t=document.createElement("div");
        t.classList.add("tag");
        t.id=genre.id;
        t.innerText=genre.name;
        t.addEventListener("click",()=>{
            if(seletedGenre.length==0){
                seletedGenre.push(genre.id);
            }else{
                if(seletedGenre.includes(genre.id)){
                    seletedGenre.forEach((id,idx) => {
                        if(id==genre.id){
                            seletedGenre.splice(idx,1);
                        }
                    });
                }else{
                    seletedGenre.push(genre.id);
                }
            }
            console.log(seletedGenre);
            getMovies(apiUrl+"&with_genres="+encodeURI(seletedGenre.join(",")));
            highlightSelection();
        })
        tagsEl.append(t);
    });
}


function highlightSelection(){
    let tags=document.querySelectorAll(".tag");
    tags.forEach(tag => {
        tag.classList.remove("highlight");
    });
    clearBtn();
    if(seletedGenre.length!=0){
            seletedGenre.forEach(id => {
            const highlightedTag=document.getElementById(id);
            highlightedTag.classList.add("highlight");
        });
    }
}


function clearBtn(){
    let clrBtn=document.querySelector("#clear");
    if(clrBtn){
        clrBtn.classList.add("highlight");
    }else{
        let clear=document.createElement("div");
        clear.classList.add("tag","highlight");
        clear.id="clear";
        clear.innerText="Clear X";   
        clear.addEventListener("click",()=>{
            seletedGenre=[];
            setGenre();
            getMovies(apiUrl);
        })
        tagsEl.append(clear);
    }
}


getMovies(apiUrl);

function getMovies(url){
    fetch(url).then(res=>res.json()).then(data=>{
        console.log(data);
        if(data.results.length==0){
            main.innerHTML=`<h1 class="noResults">No Results Found</h1>`
        }else{
            showMovies(data.results);
        }
    })
}


function showMovies(data){
    main.innerHTML="";
    data.forEach(movie => {
        const {title,poster_path,vote_average,overview}=movie;
        const movieEl=document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML=`
        <img src="${poster_path?imgUrl+poster_path:"https://via.placeholder.com/1080x1580"}" alt="${title}">

        <div class="movie-info">
            <h3>${title}</h3>
            <span class="${getColor(vote_average)}">${vote_average}</span>
        </div>

        <div class="overview">
            <h3>Overview</h3>
            ${overview}
        </div>
        `
        main.append(movieEl);
    });
}

function getColor(vote){
    if(vote>=8){
        return "green";
    }else if(vote>=5){
        return "orange";
    }else{
        return "red";
    }
}


form.addEventListener("submit",(e)=>{
    e.preventDefault();
    const searchTerm=search.value;

    seletedGenre=[];
    highlightSelection();

    if(searchTerm){
        getMovies(searchUrl+"&query="+searchTerm);
    }else{
        getMovies(apiUrl);
    }
})