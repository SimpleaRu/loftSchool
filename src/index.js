import './main.css';
const render = require('../ext.hbs');


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
    .then(() => {
        return api('users.get', { v: 5.68, fields: 'first_name, last_name, photo_100', name_case: 'gen' });
    })
    .then(data => {
        const [user] = data;
     /* 
        headerInfo.innerHTML += `<div><img src=${user.photo_100}></div>`; */
        headerInfo.innerHTML += `Друзья на странице ${user.first_name} ${user.last_name}`;
       

        return api('friends.get', { v: 5.68, fields: 'first_name, last_name, photo_100' })
    });
 /*    .then(data => {
        const templateElement = document.querySelector('#user-template');
        const source = templateElement.innerHTML,
            render = Handlebars.compile(source),
            template = render({ list: data.items });

        results.innerHTML = template;
    })
    .catch(function (e) {
        alert('Ошибка: ' + e.message);
    }); */
/*     .then( (data) => {
    var photo = document.querySelector('#photo');
     var friendList =  document.querySelector('#results');
        for (var i = 0; i < data.items.length; i++) {
            friendList.innerHTML += `<div> <img src=${data.items[i].photo_100}> </div>`;
            friendList.innerHTML += data.items[i].last_name;
        
        }
    }) */

    
    var check =  document.querySelector('#check');

    var source =  document.querySelector('#entry-template').innerHTML;
  
   // var render = Handlebars.compile(source);  
    var context = {title:"some;kj"};
    var template = render(context); 
    
    check.innerHTML = template;

 