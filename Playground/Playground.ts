/**
 * Playground.
 * run on terminal with `ts-node ./Playground/Playground.ts`
 */

let array = [{name: 'R', isHappy: false}, {name: 'R', isHappy: false}, {name: 'N', isHappy: true}];

let filteringFunction = function(value: {name: string, isHappy: boolean}) {
    return value.isHappy == false;
}

let filtered = array.filter((value) => { return value.isHappy == true });
let filtered2 = array.filter(filteringFunction);

console.log(filtered);
console.log(filtered2);
