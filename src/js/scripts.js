// Массив элементов для сортировки
let arrayNumbers = [];
// HTML-массив элементов
let arrayNumbersHTML = [];
// Задержка
const DELAY_ITERATION = 500; 
// Задержка при перестановке (время на анимацию)
const DELAY_PERMUTATION = 800;
// Задержка для подсветки
const DELAY_HIGHLIGHT = 700;
// Задержка при затухании
const DELAY_ATTENUATION = 300;

// Поле для визуализации массива
const sortField = document.querySelector('#sort-field');
// Поле для ввода массива
const inputArray = document.querySelector('#input-array');
// Кнопка для начала сортировки
const btnSort = document.querySelector('#btn-sort');
// Кнопка для остановки сортировки
const btnStop = document.querySelector('#btn-stop');
// Кнопка для установки массива
const btnSetArray = document.querySelector('#btn-set-array');

// Установить и отобразить массив
setArray();

// Слушатели событий ====================================================

// Слушатель событий для кнопки начала сортировки
btnSort.addEventListener('click', sortArray);
// Слушатель событий для кнопки установки массива
btnSetArray.addEventListener('click', setArray);
// Слушатель событий для кнопки остановки сортировки
btnStop.addEventListener('click', stopSort);

// Функции ====================================================

// Функция для установки массива и его отображения
function setArray() {
    stopSort();
    arrayNumbers = inputArray.value.split(' ');
    for (let key in arrayNumbers) {
        arrayNumbers[key] = Number(arrayNumbers[key]);
    }
    showArray();
}

// Функция для задержки
function delay(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// Функция для заполнения HTML-поля элементами массива
function showArray() {
    // Отчистить HTML-элемент массива
    sortField.innerHTML = '';
    arrayNumbersHTML = [];

    for (let i = 0; i < arrayNumbers.length; i++) {
        const elem = document.createElement('div');
        elem.classList.add('sort-elem');
        elem.id = 'elem-' + i;

        const elemLine = document.createElement('div');
        elemLine.classList.add('sort-elem-line');
        elemLine.style.height = arrayNumbers[i] + 'px';
        elemLine.id = 'elem-line-' + i;

        const elemFlash = document.createElement('div');
        elemFlash.id = 'flash-' + i;

        elemLine.append(elemFlash);
        elem.append(elemLine);

        const elemNum = document.createElement('span');
        elemNum.classList.add('sort-elem-num');
        elemNum.innerHTML = arrayNumbers[i];
        elemNum.id = 'elem-num-' + i;

        elem.append(elemNum);

        sortField.append(elem);
        arrayNumbersHTML.push({
            line: document.querySelector(`#elem-line-${i}`),
            num: document.querySelector(`#elem-num-${i}`)
        });
    } 
} 

// Функция, начинающая сортировку
function sortArray() {
    // Остановить прошлую сортировку
    stopSort();

    // Тип сортировки
    const sortType = document.querySelector('input[name="sort-type"]:checked').value;

    switch (sortType) {
        case 'bubble':
            bubbleSorting();
            break;
        case 'selection':
            selectionSorting();
            break;
        case 'fast':
            fastSorting();
            break;
        case 'insertion':
            insertionSorting();
            break;
        case 'shaker':
            shakerSorting();
            break;
    
        default:
            break;
    }
}

// Функция для подстветки элементов
// Принимает: массив HTML-элементов
async function highlightElems(elems) {
    for (const elem of elems) {
        elem.line.classList.add('light');
    }

    return delay(DELAY_HIGHLIGHT); 
}

// Функция для затухания элементов
// Принимает: массив HTML-элементов
async function attenuationElems(elems) {
    for (const elem of elems) {
        elem.line.classList.remove('light');
    }

    return delay(DELAY_ATTENUATION); 
}

// Функция для подстветки элементов зеленым
// Принимает: массив HTML-элементов
async function highlightElemsGreen(elems) {
    for (const elem of elems) {
        elem.line.classList.add('light-green');
    }

    return delay(DELAY_HIGHLIGHT); 
}

// Функция для затухания элементов зеленым
// Принимает: массив HTML-элементов
async function attenuationElemsGreen(elems) {
    for (const elem of elems) {
        elem.line.classList.remove('light-green');
    }

    return delay(DELAY_ATTENUATION); 
}

// Функция для перестановки элементов с индексами ind1 и ind2
async function swapPlaces(ind1, ind2) {
    await hideNumbers([arrayNumbersHTML[ind1], arrayNumbersHTML[ind2]]);
    arrayNumbersHTML[ind1].num.innerHTML = arrayNumbers[ind1];
    arrayNumbersHTML[ind2].num.innerHTML =  arrayNumbers[ind2];
    showNumbers([arrayNumbersHTML[ind1], arrayNumbersHTML[ind2]]);

    arrayNumbersHTML[ind1].line.style.height = arrayNumbers[ind1] + 'px';
    arrayNumbersHTML[ind2].line.style.height = arrayNumbers[ind2] + 'px';

    const elemFlashUp = document.querySelector(`#flash-${ind2}`);
    elemFlashUp.classList.remove('sort-elem-flash-up');
    elemFlashUp.classList.remove('sort-elem-flash-down');

    const elemFlashDown = document.querySelector(`#flash-${ind1}`);
    elemFlashDown.classList.remove('sort-elem-flash-down');
    elemFlashDown.classList.remove('sort-elem-flash-up');

    // Задержка при добавлении стилей
    setTimeout(() => {
        elemFlashUp.classList.add('sort-elem-flash-up');
        elemFlashDown.classList.add('sort-elem-flash-down');
    }, 100);
 
    return delay(DELAY_PERMUTATION);
}

// Функция для установки элемента на определенное место
async function setPlaces(ind) {
    await hideNumbers([arrayNumbersHTML[ind]]);
    arrayNumbersHTML[ind].num.innerHTML = arrayNumbers[ind];
    showNumbers([arrayNumbersHTML[ind]]);

    // Начальная длина
    let lastHeight = arrayNumbersHTML[ind].line.style.height;
    lastHeight = lastHeight.substring(0, lastHeight.length - 2);

    arrayNumbersHTML[ind].line.style.height = arrayNumbers[ind] + 'px';

    const elemFlash = document.querySelector(`#flash-${ind}`);
    elemFlash.classList.remove('sort-elem-flash-down');
    elemFlash.classList.remove('sort-elem-flash-up');
    if (Number(lastHeight) > arrayNumbers[ind]) {
        elemFlash.classList.add('sort-elem-flash-down');
    } else if (Number(lastHeight) < arrayNumbers[ind]) {
        elemFlash.classList.add('sort-elem-flash-up');
    }
 
    return delay(DELAY_PERMUTATION);
}

// Установить стиль с подстветкой (для отсортированных элементов)
// Принимает: массив HTML-элементов
function setSortedStyle(elems) {
    for (const elem of elems) {
        elem.line.classList.add('sorted');
    }
}

// Функция для добавления темного стиля
// Принимает: массив HTML-элементов
function setDarkStyle(elems) {
    for (const elem of elems) {
        elem.line.classList.add('dark');
    }
}; 

// Функция для удаления темного стиля
// Принимает: массив HTML-элементов
function removeDarkStyle(elems) {
    for (const elem of elems) {
        elem.line.classList.remove('dark');
    }
}; 

// Функция для скрытия чисел
// Принимает: массив HTML-элементов
async function hideNumbers(elems) {
    for (const elem of elems) {
        elem.num.classList.add('hide');
    }
    return delay(500);
}

// Функция для отображения чисел
// Принимает: массив HTML-элементов
function showNumbers(elems) {
    for (const elem of elems) {
        elem.num.classList.remove('hide');
    }
}

// Функция остановки сортировки 
function stopSort() {
    // Отчистить все timeout
    let id = window.setTimeout(function() {}, 0);

    while (id--) {
        window.clearTimeout(id); // will do nothing if no timeout with id is present
    }

    // Удалить все стили для выделения блоков
    for (const key in arrayNumbersHTML) {
        arrayNumbersHTML[key].line.classList.remove('dark');
        arrayNumbersHTML[key].line.classList.remove('light');
        arrayNumbersHTML[key].line.classList.remove('sorted');
    }
}

// Функция для перестановки элементов относительно среднего 
// Для быстрой сортировки
// Принимает: смещение, массив, индекс среднего элемента
async function replaceElementRelativeAverage(offset, array, averageInd) {

    // Массив HTML-элементов с числами
    const arrayElemsNumber = []

    for (let key in array) {
        const ind = Number(key) + offset;
        arrayElemsNumber.push(arrayNumbersHTML[ind]); 
    }
    // Погасить числа
    hideNumbers(arrayElemsNumber);
    await delay(500);
    // Поменять числа
    for (let key in array) {
        const ind = Number(key) + offset;
        arrayNumbersHTML[ind].num.innerHTML = array[key];     
    }
    // Зажечь числа
    showNumbers(arrayElemsNumber);       

    // Зажечь средний элемент
    await highlightElemsGreen([arrayNumbersHTML[averageInd + offset]]);

    for (let key in array) {
        const ind = Number(key) + offset;

        // Начальная длина
        let lastHeight = arrayNumbersHTML[ind].line.style.height;
        lastHeight = lastHeight.substring(0, lastHeight.length - 2);

        // Установка новой высоты
        arrayNumbersHTML[ind].line.style.height = array[key] + 'px';

        // Получение элемента для выспышки
        const elemFlash = document.querySelector(`#flash-${ind}`);
        // Удаление старых стилей у элемента вспышки
        elemFlash.classList.remove('sort-elem-flash-down');
        elemFlash.classList.remove('sort-elem-flash-up');
        
        // Задержка при добавлении стилей
        if (Number(lastHeight) > array[key]) {
            setTimeout(() => {
                elemFlash.classList.add('sort-elem-flash-down');
            }, 100)
        } else if (Number(lastHeight) < array[key]) {
            setTimeout(() => {
                elemFlash.classList.add('sort-elem-flash-up');
            }, 100) 
        }
    }

    await delay(1000);
    // Погасить средний элемент
    await attenuationElemsGreen([arrayNumbersHTML[averageInd + offset]]);

    return delay(300);
}

// Функция для сортировки пузырьком
async function bubbleSorting() {
    for (let i = arrayNumbers.length; i > 0; i--) {
        for (let j = 0; j < i - 1; j++) {
            await highlightElems([arrayNumbersHTML[j], arrayNumbersHTML[j + 1]]);
            await attenuationElems([arrayNumbersHTML[j], arrayNumbersHTML[j + 1]]);

            if (arrayNumbers[j] > arrayNumbers[j + 1]) {

                const buff = arrayNumbers[j]; 
                arrayNumbers[j] = arrayNumbers[j + 1];
                arrayNumbers[j + 1] = buff;
            
                await swapPlaces(j, j + 1);
            }
            await delay(DELAY_ITERATION);
        }
        setSortedStyle([arrayNumbersHTML[i - 1]]);
    }
}

// Функция для сортировки выборкой
async function selectionSorting() {
    for (let i = 0; i < arrayNumbers.length - 1; i++) {
        let indMin = i;
        await highlightElems([arrayNumbersHTML[indMin]]);

        for (let j = i + 1; j < arrayNumbers.length; j++) {

            await highlightElems([arrayNumbersHTML[j]]);

            if (arrayNumbers[j] < arrayNumbers[indMin]) {
                await attenuationElems([arrayNumbersHTML[indMin]]);
                setDarkStyle([arrayNumbersHTML[indMin]]);
                indMin = j; 
                await highlightElems([arrayNumbersHTML[indMin]]);
            } else {
                await attenuationElems([arrayNumbersHTML[j]]);
                setDarkStyle([arrayNumbersHTML[j]]);
            }
            await delay(DELAY_ITERATION);
        }
        if (indMin !== i) {
            const buff = arrayNumbers[indMin];
            arrayNumbers[indMin] = arrayNumbers[i];
            arrayNumbers[i] = buff;

            
            await swapPlaces(i, indMin);
        }
        await attenuationElems([arrayNumbersHTML[indMin]]);
        removeDarkStyle(arrayNumbersHTML);

        setSortedStyle([arrayNumbersHTML[i]]); 
    }
    setSortedStyle([arrayNumbersHTML[arrayNumbersHTML.length - 1]]); 
}

// Функция для быстрой сортировки
async function fastSorting() {
    // Рекурсивная функция для сортировки массива
    // Принимает: массив, смещение внутри оригинального массива
    async function sortArrayFast(array, offset) {
        let leftArray = [];
        let rightArray = [];
        const averageValue = array[0]; // Среднее число, относительно которого будем делить массив
    
        // Подсветить элементы, с которыми работаем
        let arrayElemsForLight = [];
        for (let i = 0; i < array.length; i++) {
            arrayElemsForLight.push(arrayNumbersHTML[i + offset]);
        } 
        await highlightElems(arrayElemsForLight);

        // Разделение массива на две части
        for (let i = 1; i < array.length; i++) {
            if (array[i] > averageValue) {
                rightArray.push(array[i]);
            } else {
                leftArray.push(array[i]);
            }
        } 

        // Переместить элементы относительного среднего
        await replaceElementRelativeAverage(offset, [...leftArray, averageValue, ...rightArray], leftArray.length);
        // Погасить эти элементы
        await attenuationElems(arrayElemsForLight);

        // Если части массива по длине больше, чем 1, то продолжим деление 
        // для каждой из частей
        const lengthLeft = leftArray.length;
        if (leftArray.length > 1) { 
            leftArray = await sortArrayFast(leftArray, 0 + offset)
        }
        if (rightArray.length > 1) { 
            rightArray = await sortArrayFast(rightArray, lengthLeft + 1 + offset)
        }
    
        // Возвращаем: развернутый левый массив, среднее число, развернутый правый массив
        return [...leftArray, averageValue, ...rightArray];
    }

    arrayNumbers = await sortArrayFast(arrayNumbers, 0);
    setSortedStyle(arrayNumbersHTML);
}

// Функция для шейкерной сортировки
async function shakerSorting() {
    let left = 0; // начало массива
    let right = arrayNumbers.length - 1; // конец массива
    while (left < right) {
        // Перемещение большего элемента в конец (прямое направление)
        for (let i = left; i < right; i++) {
            await highlightElems([arrayNumbersHTML[i], arrayNumbersHTML[i + 1]]);
            await attenuationElems([arrayNumbersHTML[i], arrayNumbersHTML[i + 1]]);

            if (arrayNumbers[i] > arrayNumbers[i + 1]) {
                const buff = arrayNumbers[i]; 
                arrayNumbers[i] = arrayNumbers[i + 1];
                arrayNumbers[i + 1] = buff;

                await swapPlaces(i, i + 1);
            }

            await delay(DELAY_ITERATION);
        }
        setSortedStyle([arrayNumbersHTML[right]]);
        right--;
        // Перемещение меньшего элемента в начало (обратное направление)
        for (let i = right; left < i; i--) {
            await highlightElems([arrayNumbersHTML[i], arrayNumbersHTML[i - 1]]);
            await attenuationElems([arrayNumbersHTML[i], arrayNumbersHTML[i - 1]]);

            if (arrayNumbers[i] < arrayNumbers[i - 1]) {
                const buff = arrayNumbers[i]; 
                arrayNumbers[i] = arrayNumbers[i - 1];
                arrayNumbers[i - 1] = buff;

                await swapPlaces(i - 1, i);
            }
            await delay(DELAY_ITERATION);
        }
        setSortedStyle([arrayNumbersHTML[left]]);
        left++;
    }
}

// Функция для сортировки вставками 
async function insertionSorting() {

    for (let i = 1; i < arrayNumbers.length; i++) {
        const temp = arrayNumbers[i];
        j = i - 1;

        await highlightElems([arrayNumbersHTML[j]]);
        await attenuationElems([arrayNumbersHTML[j]]);

        let wasReplace = false;
        while (j >= 0 && arrayNumbers[j] > temp) {
            arrayNumbers[j + 1] = arrayNumbers[j];

            await setPlaces(j + 1);

            j--;
            if (!wasReplace) {
                wasReplace = true;
            }

            await delay(DELAY_ITERATION);
        }
        
        arrayNumbers[j + 1] = temp;
        if (wasReplace) {
            await setPlaces(j + 1);
            await highlightElemsGreen([arrayNumbersHTML[j + 1]]);
            await attenuationElemsGreen([arrayNumbersHTML[j + 1]]);
        }

        setSortedStyle([arrayNumbersHTML[i - 1]]);
    }
    setSortedStyle([arrayNumbersHTML[arrayNumbers.length - 1]]);
}
