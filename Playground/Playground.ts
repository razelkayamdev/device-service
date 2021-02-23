/**
 * Playground.
 * run on terminal with `ts-node ./Playground/Playground.ts`
 */

import { Environment } from "../src/Environment/Environment";
import { Cranes } from "../src/Shared/Interfaces";

let array = [{name: 'Razzzzzz', isHappy: false}, {name: 'Raz', isHappy: false}, {name: 'Noa', isHappy: true}];

let filteringFunction = function(value: {name: string, isHappy: boolean}) {
    return value.isHappy == false;
}

let filtered = array.filter((value) => { return value.isHappy == true });
let filtered2 = array.filter(filteringFunction);

console.log(filtered);
console.log(filtered2);

let i = array.findIndex((i => i.name === 'Noa'));

console.log('array:');
console.log(array);
array.splice(i, 1, {name: 'Noa Urbach Elkayam', isHappy: true});

console.log('array after splice:');
console.log(array);

let a: Cranes = {
    identifiers: ["a", "b", "c"]
}
console.log('here we go:');
console.log(a);
let result = a.identifiers.findIndex(value => value == '1')
console.log(result != -1);
result = a.identifiers.findIndex(value => value == 'a')
console.log(result != -1);


class Testing {
    
    private async workAsyncly() {
        let promise = new Promise((resolve, reject) => {
          setTimeout(() => resolve("done!"), 2000)
        });
      
        let result = await promise; 
        console.log(result); // "done!"
    }


    public async wrapper() {
        console.log('start.');
        await this.workAsyncly();
        console.log('end.');
    }
}

let testing = new Testing();
testing.wrapper();



console.log('devices:');
let devices = [{
    id: 'device02',
    crane_id: 'crane101',
    s_n: '5234934889',
    model: 'hawkeye 5',
    description: 'That\’s a great device',
    created: '01/10/2019 13:45:01',
    updated: '01/12/2019 23:32:01',
    deleted: false
}, {
    id: 'device03',
    crane_id: 'crane111',
    s_n: '5234934888',
    model: 'hawkeye 5',
    description: 'That\’s a great device',
    created: '01/10/2019 13:45:02',
    updated: '01/12/2019 23:32:02',
    deleted: true
}];

const newArray = devices.map(({deleted, ...rest}) => rest)
const devicesJson1 = JSON.stringify(devices);
const devicesJson2 = JSON.stringify(newArray);

let e = new Environment();
console.log(e.httpPort);
console.log(e.cranesJsonPath);
console.log(e.devicesJsonPath);