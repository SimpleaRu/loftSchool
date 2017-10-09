import './main.css';
const render = require('./ext.hbs');
let leftBarArr =[];
let RightBarArr =[];
let results = document.querySelector('#results');
let avatar = document.querySelector('#avatar');
let insertleftTable = document.querySelector('#insertleftTable');
let insertRightTable = document.querySelector('#insertRightTable');
let leftInput = document.querySelector('#leftInput');
let RightInput = document.querySelector('#RightInput');
let save = document.querySelector('#save');
let storageRightBar;
let storageLeftBar;
let footer = document.querySelector('#footer');
let leftBar = document.querySelector('#leftBar');
let rightBar = document.querySelector('#rightBar');

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
        storageRightBar = JSON.parse(localStorage.getItem('rightBarSave'));
        storageLeftBar = JSON.parse(localStorage.getItem('LeftBarSave'));

       if (storageLeftBar && storageLeftBar.length > 0) {
           leftBarArr =  storageLeftBar.slice();
           addSymbolClass(storageLeftBar, '+');
           rendering(storageLeftBar, insertleftTable);
        }
        else {
            
            leftBarArr = data.items.slice();
            addSymbolClass(leftBarArr, '+');
            rendering(leftBarArr, insertleftTable);
       }

        if (storageRightBar.length > 0) {
            rendering(storageRightBar, insertRightTable);
            RightBarArr = storageRightBar.slice();
        }
        leftInput.value = '';
        RightInput.value = '';
        
    })
    .catch(function (e) {
        alert('Ошибка: ' + e.message);
    });
 
    results.addEventListener('click', (e) => {

        if (e.target.innerHTML == '+' && e.target.nodeName == 'BUTTON' ) {
            let friendDomName = e.target.parentNode.previousElementSibling.innerText;

          for (var i = 0; i < leftBarArr.length; i++) {
              let friendArrName = leftBarArr[i].first_name + ' ' + leftBarArr[i].last_name;
              if (friendDomName == friendArrName ) {
                leftBarArr[i].symbol = 'X';
                RightBarArr.push(leftBarArr[i]);
                leftBarArr.splice(i, 1);

                if (leftInput.value == '' && RightInput.value == '' ) {
                    rendering(leftBarArr, insertleftTable);
                    rendering(RightBarArr, insertRightTable);
                }
                else {
                    leftInput.dispatchEvent(new KeyboardEvent('keyup'));
                    RightInput.dispatchEvent(new KeyboardEvent('keyup'));
                }
              }
          } 
        }

        if (e.target.innerHTML == 'X' && e.target.nodeName == 'BUTTON' ){
            
            let friendDomName = e.target.parentNode.previousElementSibling.innerText; 
            for (var i = 0; i < RightBarArr.length; i++ ) {

                let friendArrName = RightBarArr[i].first_name + ' ' + RightBarArr[i].last_name; 
                if (friendDomName == friendArrName ) {
                    RightBarArr[i].symbol = '+';
                    leftBarArr.push(RightBarArr[i]);
                    RightBarArr.splice(i, 1);

                    if (leftInput.value == '' && RightInput.value == '' ) {
                        
                        rendering(RightBarArr, insertRightTable);
                        rendering(leftBarArr, insertleftTable);
                    }
                    else {
                        leftInput.dispatchEvent(new KeyboardEvent('keyup'));
                        RightInput.dispatchEvent(new KeyboardEvent('keyup'));
                    }
                }
            }
        }
    });

    leftInput.addEventListener('keyup', (e) => {
    rendering( filterArr(leftBarArr, leftInput), insertleftTable);
    });

    RightInput.addEventListener('keyup', (e) => {
        rendering( filterArr(RightBarArr, RightInput), insertRightTable);
        });
    save.addEventListener('click', (e) => {
        let rightBarSave = JSON.stringify(RightBarArr);
        let leftBarSave = JSON.stringify(leftBarArr);
        localStorage.setItem('rightBarSave', rightBarSave);
        localStorage.setItem('LeftBarSave', leftBarSave);
        
    });
 
// DnD part
results.addEventListener('mousedown', function(e) {
      
function getStartBar (e) {
    let startBar = null;
     startBar = e.target.closest("#leftBar") || e.target.closest("#rightBar");
    return startBar;
}
let startBar = getStartBar (e) ;
if (startBar) {

}
   let  dragableStr = e.target.closest("#tableString");
    
    if (dragableStr) {
        var coords = getCoords(dragableStr);
        var shiftX = e.pageX - coords.left;
        var shiftY = e.pageY - coords.top;
    
                function getCoords(elem) { 
                    var box = elem.getBoundingClientRect();
                    return {
                        top: box.top + pageYOffset,
                        left: box.left + pageXOffset
                    };
                }

                function move(e) {
                    var xPosition, yPosition;
                     dragableStr.style.left = e.pageX - shiftX + 'px';
                     xPosition = dragableStr.style.left;
                     dragableStr.style.top = e.pageY - shiftY + 'px';
                     yPosition = dragableStr.style.top; 
                     return {
                        startX: xPosition,
                        startY: yPosition
                    } ;
                }
                            
                document.onmousemove = function(e) {

                    dragableStr.style.position = 'absolute';
                    dragableStr.style.zIndex = '1000';
                    move(e);
                  }
    
                  results.addEventListener('mouseup', function(e) {
                      
                      dragableStr.style.position = 'static';
                        document.onmousemove = null;
                        dragableStr.hidden = true;
                       let  temp = document.elementFromPoint(e.clientX, e.clientY) 
                        dragableStr.hidden = false;
         
                        if (temp.closest("#rightBar") && startBar.id == 'leftBar') {
                           let  friendDomName = dragableStr.firstElementChild.nextElementSibling.innerText;
                            for (var i = 0; i < leftBarArr.length; i++) {
                             let friendArrName = leftBarArr[i].first_name + ' ' + leftBarArr[i].last_name;
                            
                              if (friendDomName == friendArrName ) {
                                leftBarArr[i].symbol = 'X';
                                RightBarArr.push(leftBarArr[i]);
                                leftBarArr.splice(i, 1);
                
                                if (leftInput.value == '' && RightInput.value == '' ) {
                                    rendering(leftBarArr, insertleftTable);
                                    rendering(RightBarArr, insertRightTable);
                                }
                                else {
                                    leftInput.dispatchEvent(new KeyboardEvent('keyup'));
                                    RightInput.dispatchEvent(new KeyboardEvent('keyup'));
                                }
                              } 
                            }
                        }
                        if (temp.closest("#leftBar") && startBar.id == 'rightBar') {
                             let  friendDomName = dragableStr.firstElementChild.nextElementSibling.innerText;
                             for (var i = 0; i < RightBarArr.length; i++) {
                              let friendArrName = RightBarArr[i].first_name + ' ' + RightBarArr[i].last_name;
                             
                               if (friendDomName == friendArrName ) {
                                RightBarArr[i].symbol = '+';
                                 leftBarArr.push(RightBarArr[i]);
                                 RightBarArr.splice(i, 1);
                 
                                 if (leftInput.value == '' && RightInput.value == '' ) {
                                     rendering(leftBarArr, insertleftTable);
                                     rendering(RightBarArr, insertRightTable);
                                 }
                                 else {
                                     leftInput.dispatchEvent(new KeyboardEvent('keyup'));
                                     RightInput.dispatchEvent(new KeyboardEvent('keyup'));
                                 }
                               } 
                             } 
                         }
                          dragableStr = null;
                      });
              }
     
    }); 

function rendering(sourse, container) {

    let template = render({ list: sourse});
    container.innerHTML = template;
    console.log(leftBarArr.length, RightBarArr.length);
}

function addSymbolClass(arr, sym) {
    for(var i = 0; i < arr.length; i++) {
        arr[i].symbol = sym;
    }
}

function filterArr (array, inputValue) {
    let FilterArr = [];
    for (var i = 0; i < array.length; i++ ) {
        if(isMatching(array[i].first_name, inputValue.value) || isMatching(array[i].last_name, inputValue.value) ) {
          
            FilterArr.push(array[i]); 
      }
    }
   return  FilterArr;
}

function isMatching(full, chunk) {
    full = full.toLowerCase();
    chunk = chunk.toLowerCase();

         if (full.indexOf(chunk) >= 0) {   
          return true;
     }  
     return false;
}