import './main.css';
var myMap;
let map = document.querySelector('#map');
let form = document.querySelector('#form');
let close = document.querySelector('#close');
let address = document.querySelector('#address');
let inputName = document.querySelector('#inputName');
let inputPlace = document.querySelector('#inputPlace');
let inputComment = document.querySelector('#inputComment');
let send = document.querySelector('#send');
let formContent = document.querySelector('#formContent');
let clickCoords;
let placeName;
let topCoords;
let leftCoords;
let plasemarksArr = [];
let ardressString;

let clusterer;
new Promise(resolve => ymaps.ready(resolve))
.then(res => {
    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 11
    }, {
        searchControlProvider: 'yandex#search'
    });

    var customItemContentLayout = ymaps.templateLayoutFactory.createClass(
        // Флаг "raw" означает, что данные вставляют "как есть" без экранирования html.
        '<h2 class=ballon_header>{{ properties.balloonContentHeader|raw }}</h2>' +
        '<div class=ballon_body>{{ properties.balloonContentBody|raw }}</div>' +
        '<div class=ballon_footer>{{ properties.balloonContentFooter|raw }}</div>'
    );

    clusterer = new ymaps.Clusterer({
       preset: 'islands#invertedVioletClusterIcons',
       clusterDisableClickZoom: true,
       openBalloonOnClick: true,
       gridSize: 80,
       clusterBalloonContentLayout: 'cluster#balloonCarousel',
       clusterBalloonItemContentLayout: customItemContentLayout
    });

    myMap.geoObjects.add(clusterer);
    clusterer.events.add('click', (e) => {
        
    })

    myMap.events.add('click', function (e) {
         clickCoords = e.get('coords');
         topCoords = e.get('pagePixels')[1] + 'px';
         leftCoords = e.get('pagePixels')[0] + 'px';

         setAdress(clickCoords);
         formRender(e);
    }); 
    
    send.addEventListener('click', (e) => {
    
        var myPlacemark = new ymaps.Placemark(clickCoords, {}, {
             preset:'islands#violetIcon'
             });
        
        let mark = {
             name: inputName.value,
             location: inputPlace.value,
             comment: inputComment.value,
             adress: ardressString,
             coords: clickCoords,
             date:  takeDate()
        }

       myPlacemark.properties.set({
            balloonContentHeader: inputPlace.value,
            balloonContentBody: `<p data-coords='${clickCoords}' id='placemarkCoords'>
                                 <span id='link'>${ardressString}</span> </p>
                                 <p> ${inputComment.value} `,
            balloonContentFooter: takeDate()
        }); 

        myMap.geoObjects.add(myPlacemark);
       plasemarksArr.push(mark);
            formContent.innerHTML +=  formContentBuilder(mark.name, mark.location, mark.comment, mark.date  ); 

        myPlacemark.events.add('click', (e) => {
            
            e.preventDefault();
            var thisPlacemark = e.get('target');
            var coordsTarget = thisPlacemark.geometry.getCoordinates();

            clickCoords = coordsTarget;
            setAdress(clickCoords);

            formRender(e);
            for (var i = 0; i < plasemarksArr.length; i++) {
               if (coordsTarget == plasemarksArr[i].coords ) {
                   
                    formContent.innerHTML +=  formContentBuilder(plasemarksArr[i].name, plasemarksArr[i].location, plasemarksArr[i].comment, plasemarksArr[i].date);
               }
            }
        });
            clusterer.add(myPlacemark); 
            inputName.value = '';
            inputPlace.value = '';
            inputComment.value = '';
    });
     
});

    close.addEventListener('click', (e) => {
        form.style.display = 'none';
    });

function formRender(e, top, left) {
    if( top || left) {
        form.style.top = top;
        form.style.left = left;
    }
    else {
        form.style.top = e.get('pagePixels')[1] + 'px';
        form.style.left = e.get('pagePixels')[0] + 'px';
    }
    form.style.display = 'block';
    form.style.zIndex = '1000';
    inputName.value = '';
    inputPlace.value = '';
    inputComment.value = '';
    formContent.innerHTML = '';
}

function formContentBuilder(name, location, comment, date ) {
 return   `<p class='formCont'><b class='nameColor'> ${name}</b> ${location} ${date} </p> <p class='formCont'> ${comment} </p>`;
}

function takeDate () {
    var now = new Date();
    let year =  now.getFullYear();
    let month = now.getMonth();
    let day =  now.getDate();
    let hour =  now.getHours();
    let muinets =  now.getMinutes();
    let seconds =  now.getSeconds();
        month += 1;
    let string = year+'.'+month+'.'+day+' '+hour +':'+muinets +':'+seconds;
    return string;  
}

function setAdress(coords) {
    ymaps.geocode(coords).then(function(res) {
        var nearest = res.geoObjects.get(0);
        placeName = nearest.properties.get('name');
        console.log(placeName);
        address.innerHTML = placeName;
        ardressString = placeName;
    }, 
        function (err) {
            alert('Ошибка');
    });
}

document.addEventListener('click', (e) => {
    if (e.target.id == 'link') {
      
        myMap.balloon.close();
        formRender(null, e.pageX, e.pageY);
        let coords = e.target.parentNode.dataset.coords;
        console.log(coords);
        let backCoords = coords.split(',');
        let arrBackCoords = backCoords.map((coord) => {
            return +coord;
        });
        clickCoords = arrBackCoords;
        setAdress(clickCoords);

         for (var i = 0; i < plasemarksArr.length; i++) {
   
             if (coords == plasemarksArr[i].coords.join(',') ) {
                formContent.innerHTML +=  formContentBuilder(plasemarksArr[i].name, plasemarksArr[i].location, plasemarksArr[i].comment, plasemarksArr[i].date );  
               
            }
         }
    }
});