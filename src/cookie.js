/**
 * ДЗ 7.2 - Создать редактор cookie с возможностью фильтрации
 *
 * На странице должна быть таблица со списком имеющихся cookie:
 * - имя
 * - значение
 * - удалить (при нажатии на кнопку, выбранная cookie удаляется из браузера и таблицы)
 *
 * На странице должна быть форма для добавления новой cookie:
 * - имя
 * - значение
 * - добавить (при нажатии на кнопку, в браузер и таблицу добавляется новая cookie с указанным именем и значением)
 *
 * Если добавляется cookie с именем уже существующией cookie, то ее значение в браузере и таблице должно быть обновлено
 *
 * На странице должно быть текстовое поле для фильтрации cookie
 * В таблице должны быть только те cookie, в имени или значении которых есть введенное значение
 * Если в поле фильтра пусто, то должны выводиться все доступные cookie
 * Если дабавляемая cookie не соответсвуте фильтру, то она должна быть добавлена только в браузер, но не в таблицу
 * Если добавляется cookie, с именем уже существующией cookie и ее новое значение не соответствует фильтру,
 * то ее значение должно быть обновлено в браузере, а из таблицы cookie должна быть удалена
 *
 * Для более подробной информации можно изучить код тестов
 *
 * Запрещено использовать сторонние библиотеки. Разрешено пользоваться только тем, что встроено в браузер
 */

/**
 * homeworkContainer - это контейнер для всех ваших домашних заданий
 * Если вы создаете новые html-элементы и добавляете их на страницу, то дабавляйте их только в этот контейнер
 *
 * @example
 * homeworkContainer.appendChild(...);
 */
let homeworkContainer = document.querySelector('#homework-container');
let filterNameInput = homeworkContainer.querySelector('#filter-name-input');
let addNameInput = homeworkContainer.querySelector('#add-name-input');
let addValueInput = homeworkContainer.querySelector('#add-value-input');
let addButton = homeworkContainer.querySelector('#add-button');
let listTable = homeworkContainer.querySelector('#list-table tbody');

filterNameInput.addEventListener('keyup', function() {

         if (filterNameInput.value == '') {
            listTable.innerHTML = ''; 
            for (var key in cookiesParse()) {
                if (cookiesParse()[key]) {
                    addTableline(key, cookiesParse()[key] );
                } 
            }
        }
        else  {
            listTable.innerHTML = ''; 
            let trAll = listTable.querySelectorAll('tr'); 
            for (var key in cookiesParse()) {
             if( isMatching(key, filterNameInput.value) || isMatching(cookiesParse()[key], filterNameInput.value)) {
                 
                 addTableline(key, cookiesParse()[key] );
            }
         } 
    }
});

addButton.addEventListener('click', () => {

    document.cookie = addNameInput.value + '=' + addValueInput.value;
    filterNameInput.dispatchEvent(new KeyboardEvent('keyup'));

});

function cookiesParse() {
        let Str = document.cookie;
        let obj = {};
        let arr = Str.split('; ');
        arr.forEach((item ) => {
            let arr = item.split('=');
            obj[arr[0]] = arr[1];
        });
    return obj; 
}

function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

         if (full.indexOf(chunk) >= 0) {   
          return true;
     }  
     return false;
}

function addTableline (cookieName, cookieValue) {
    listTable.innerHTML = listTable.innerHTML + 
    '<tr> '+'<td>'+ cookieName +'</td>'+
    '<td>' + cookieValue +'</td>'+
    '<td>'+'<button>del</button> '+'</td>'+'</tr>';      
}

listTable.addEventListener('click', (e) => {
    if(e.target.nodeName == 'BUTTON' ) {
        var cookieName = e.target.parentElement.parentElement.firstElementChild.textContent;
        let date = new Date(0);
        document.cookie = `${cookieName}=''; expires=${date}`; 
        filterNameInput.dispatchEvent(new KeyboardEvent('keyup'));
    }
});



 