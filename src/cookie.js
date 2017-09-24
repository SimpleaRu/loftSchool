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
let deleteButton = document.createElement('button');

filterNameInput.addEventListener('keyup', function() {

         if (filterNameInput.value == '') {
            listTable.innerHTML = ''; 
            for (var key in cookiesParse()) {
                if (cookiesParse()[key]) {
                    listTable.innerHTML = listTable.innerHTML + '<tr> '+'<td>'+ key +'</td>'+'<td>'+ cookiesParse()[key] +'</td>'+'<td>'+'<button id=del>del</button> '+'</td>'+'</tr>';
                } 
            }
        }

        else {

            let trAll = listTable.querySelectorAll('tr'); 
               for(var i = 0; i < trAll.length; i++ ) {
                
                   if((trAll[i].firstElementChild.textContent != filterNameInput.value) && (trAll[i].firstElementChild.nextElementSibling.textContent != filterNameInput.value) )  {
                   
                       trAll[i].remove();
                       
               }
           } 
        }
   
});

addButton.addEventListener('click', () => {
    let addCookies;
    let counter = 0;
    addCookies = addNameInput.value + '=' + addValueInput.value;
    document.cookie = addCookies;

    if (filterNameInput.value == '') { 

        let trAll = listTable.querySelectorAll('tr'); 
 
        for(var i = 0; i < trAll.length; i++ ) { 
            if (trAll[i].firstElementChild.textContent == addNameInput.value && trAll[i].firstElementChild.nextElementSibling.textContent != addValueInput.value  ) {
              //  trAll[i].remove();
              trAll[i].firstElementChild.nextElementSibling.textContent = addValueInput.value;
            }
            if (trAll[i].firstElementChild.textContent == addNameInput.value) {
                counter++;
            }
        }
        console.log(counter);
        if ( counter == 0) {
            
            listTable.innerHTML = listTable.innerHTML + '<tr> '+'<td>'+ addNameInput.value +'</td>'+'<td>'+ addValueInput.value +'</td>'+'<td>'+'<button id=del>del</button> '+'</td>'+'</tr>';  
        }
    
    }
    if (filterNameInput.value != '') {
        let trAll = listTable.querySelectorAll('tr'); 
        
               for(var i = 0; i < trAll.length; i++ ) {

                   if (trAll[i].firstElementChild.textContent == addNameInput.value && trAll[i].firstElementChild.nextElementSibling.textContent != addValueInput.value ) {
                        trAll[i].remove();
                   }
               }
     }

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

listTable.addEventListener('click', (e) => {

    if(e.target.nodeName == 'BUTTON' ) {
        var cookieName = e.target.parentElement.parentElement.firstElementChild.textContent;
     //   console.log(cookieName);
        document.cookie = cookieName + '=;expires=15/02/2010 00:00:00';

        e.target.parentElement.parentElement.remove();
    }
})

 // "username=;expires=15/02/2012 00:00:00"


 