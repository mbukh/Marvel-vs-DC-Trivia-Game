export const getRandomNonRepeatingNumbers = ({ min, max, count }) => {
    let arr = [];
    while (arr.length < count) {
        let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
        if (arr.indexOf(randomNumber) === -1) {
            arr.push(randomNumber);
        }
    }
    return arr;
};
