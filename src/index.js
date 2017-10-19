import './main.css';
var myMap;
let map = document.querySelector('#map');
let form = document.querySelector('#form');
let close = document.querySelector('#close');
let address = document.querySelector('#address');
//let input = document.querySelector('#input');
let send = document.querySelector('#send');
let formContent = document.querySelector('#formContent');
let clickCoords;
let placeName;

/* function geocode(address) {
    return ymaps.geocode(address).then(result => {
        const points = result.geoObjects.toArray();

        if (points.length) {
            return points[0].geometry.getCoordinates();
        }
    });
} */

let clusterer;
new Promise(resolve => ymaps.ready(resolve))
.then(res => {
    myMap = new ymaps.Map('map', {
        center: [55.76, 37.64], // Москва
        zoom: 11
    }, {
        searchControlProvider: 'yandex#search'
    });

    clusterer = new ymaps.Clusterer({
       preset: 'islands#invertedVioletClusterIcons',
       clusterDisableClickZoom: true,
       openBalloonOnClick: true,
       gridSize: 80
    });
    myMap.geoObjects.add(clusterer);

    myMap.events.add('click', function (e) {
        clickCoords = e.get('coords');

        ymaps.geocode(clickCoords).then(function(res) {
            var nearest = res.geoObjects.get(0);
            placeName = nearest.properties.get('name');
            console.log(placeName);
            address.innerHTML = placeName;

        }, 
            function (err) {
                alert('Ошибка');
        });

     form.style.top = e.get('pagePixels')[1] + 'px';
     form.style.left = e.get('pagePixels')[0] + 'px';
     form.style.visibility = 'visible';
    // input.value = '';
     formContent.innerHTML = '';
    }); 
    

    send.addEventListener('click', (e) => {
       
        var myPlacemark = new ymaps.Placemark(clickCoords, {}, { preset:'islands#violetIcon' });
        
        myPlacemark.properties.set({
        //    balloonContentBody:  input.value,
            clusterCaption: 'n01'
        });

        myMap.geoObjects.add(myPlacemark);

        myPlacemark.events.add('click', (e) => {
            clickCoords = e.get('coords');
            form.style.top = e.get('pagePixels')[1] + 'px';
            form.style.left = e.get('pagePixels')[0] + 'px';
            form.style.visibility = 'visible';
            form.style.zIndex = '1000';
            formContent.innerHTML =  myPlacemark.properties.get('balloonContentBody');

            e.preventDefault();
            
        });
            clusterer.add(myPlacemark);
        
    });
     
});

    close.addEventListener('click', (e) => {
        form.style.visibility = 'hidden';
    });

