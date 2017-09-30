import './main.css';
const render = require('./ext.hbs');
let leftBarArr =[];
let RightBarArr =[];
let results = document.querySelector('#results');
let variable = '+';

function api(method, params) {
    return new Promise((resolve, reject) => {
        VK.api(method, params, data => {
            if (data.error) {
                reject(new Error(data.error.error_msg));
            } else {
                resolve(data.response);
            }
        });
    });
}

const promise = new Promise((resolve, reject) => {
    VK.init({
        apiId: 6198589 
    });

    VK.Auth.login(data => {
        if (data.session) {
            resolve(data);
        } else {
            reject(new Error('Не удалось авторизоваться'));
        }
    }, 16);
}); 

promise
     .then(data => {
        return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100' })
    }) 
    .then(data => {
     let insertleftTable = document.querySelector('#insertleftTable');
       /*  const templateElement = document.querySelector('#user-template');
        const source = templateElement.innerHTML, */
       let template = render({ list: data.items, buttonView: variable });
       insertleftTable.innerHTML = template;
       
    }).then(data => {
       let button = document.querySelectorAll('#leftBar #button');
        for (var i =0; i  < button.length; i++ ) {
            button[i].innerHTML = '+';
     /*        button[i].addEventListener('click', (e)=> {
                console.log(e.target.parentNode.parentNode.innerHTML);
                insertRightTable.innerHTML = rightBar.innerHTML + e.target.parentNode.parentNode.innerHTML;
                e.target.parentNode.parentNode.remove();
            }); */
        } 
        
    })
    .catch(function (e) {
        alert('Ошибка: ' + e.message);
    });
 
    results.addEventListener('click', (e) => {
      
        if (e.target.nodeName == 'BUTTON') {

            console.log(e.target.parentNode.previousElementSibling.innerText);
        }
    })
