'use strict';

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10,11];


const backData = async(num) => {
    return new Promise((resolve, reject) => {
        setInterval(() => {
            resolve(num)
        }, 3000);
    });
}


const getData = async() => {
    let i = 0;
    while (arr[i]) {
        let num = await backData(i);
        console.log(num);
        i++;
    }
}

getData();