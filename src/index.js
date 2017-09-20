/* ДЗ 6.1 - Асинхронность и работа с сетью */

/**
 * Функция должна создавать Promise, который должен быть resolved через seconds секунду после создания
 *
 * @param {number} seconds - количество секунд, через которое Promise должен быть resolved
 * @return {Promise}
 */
function delayPromise(seconds) {
    let promise = new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
      promise
      .then(
        () => {
        }
      );    
      return promise;
}

/**
 * Функция должна вернуть Promise, который должен быть разрешен массивом городов, загруженным из
 * https://raw.githubusercontent.com/smelukov/citiesTest/master/cities.json
 * Элементы полученного массива должны быть отсортированы по имени города
 *
 * @return {Promise<Array<{name: String}>>}
 */
function loadAndSortTowns() {
  let towns;
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

export {
    delayPromise,
    loadAndSortTowns
};
