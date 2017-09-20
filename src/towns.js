/**
 * ДЗ 6.2 - Создать страницу с текстовым полем для фильтрации городов
 *
 * Страница должна предварительно загрузить список городов из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * и отсортировать в алфавитном порядке.
 *
 * При вводе в текстовое поле, под ним должен появляться список тех городов,
 * в названии которых, хотя бы частично, есть введенное значение.
 * Регистр символов учитываться не должен, то есть "Moscow" и "moscow" - одинаковые названия.
 *
 * Во время загрузки городов, на странице должна быть надпись "Загрузка..."
 * После окончания загрузки городов, надпись исчезает и появляется текстовое поле.
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 *
 * *** Часть со звездочкой ***
 * Если загрузка городов не удалась (например, отключился интернет или сервер вернул ошибку),
 * то необходимо показать надпись "Не удалось загрузить города" и кнопку "Повторить".
 * При клике на кнопку, процесс загруки повторяется заново
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */

let homeworkContainer = document.querySelector('#homework-container');
 
    var towns;
    
/**
 * Функция должна загружать список городов из https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * И возвращать Promise, которой должен разрешиться массивом загруженных городов
 *
 * @return {Promise<Array<{name: string}>>}
 */
function loadTowns() {

    return new Promise (function (resolve) {
        var xhr = new XMLHttpRequest();
        
         xhr.open('GET', 'https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json', true);
         xhr.send();
         xhr.addEventListener('load', () => {    
            towns = xhr.response;
            towns = JSON.parse(towns);
            towns.sort(function (a, b) {
                if (a.name > b.name) return 1;
                if (a.name < b.name) return -1;   
            })

                resolve(towns);
         });
 
    });
   
}

    loadTowns()
          .then((response) => {
            homeworkContainer.appendChild(filterInput);
            loadingBlock.innerText = '';
            return loadTowns(response);

        }).then((response) => {
            homeworkContainer.appendChild(filterResult);

         filterInput.addEventListener('keyup', function() {
            inputText = filterInput.value;
            filterResult.innerHTML = '';

            for (var i = 0; i < response.length; i++) {
                  
                if (isMatching(response[i].name, inputText)) {

                   filterResult.innerHTML = filterResult.innerHTML + '<p>' +  response[i].name + '</p>';
                
                }
                if (inputText == '') {
                    filterResult.innerHTML = '';
                }
              }

            });    
        });

/**
 * Функция должна проверять встречается ли подстрока chunk в строке full
 * Проверка должна происходить без учета регистра символов
 *
 * @example
 * isMatching('Moscow', 'moscow') // true
 * isMatching('Moscow', 'mosc') // true
 * isMatching('Moscow', 'cow') // true
 * isMatching('Moscow', 'SCO') // true
 * isMatching('Moscow', 'Moscov') // false
 *
 * @return {boolean}
 */
function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

        if (full.indexOf(chunk) >= 0) {
                
          return true;
     }  
     return false;
}

let loadingBlock = homeworkContainer.querySelector('#loading-block');
let filterBlock = homeworkContainer.querySelector('#filter-block');
let filterInput = homeworkContainer.querySelector('#filter-input');
let filterResult = homeworkContainer.querySelector('#filter-result');
let townsPromise;
var inputText;


export {
    loadTowns,
    isMatching
};
