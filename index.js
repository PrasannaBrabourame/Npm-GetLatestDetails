const request = require('request');
const primaryURL = "http://registry.npmjs.org/";

async function callAPI(packageName) {
    return new Promise(async (resolve, reject) => {
        request(`${primaryURL}/${packageName}/latest`, function (error, response, body) {
            if (error !== null) {
                reject(error);
            }
            if (response && response.statusCode === 200) {
                let result = JSON.parse(body);
                let dependency = [];
                if (result.dependencies != undefined)
                    dependency = Object.keys(result.dependencies)
                resolve(dependency);
            }
        });
    });
}

var MainFunction = function (packageName) {
    callAPI(packageName).then(value => {
        let promises = [value];
        value.forEach(element => {
            let dep = callAPI(element);
            if (dep != undefined)
                promises.push(dep);
        });
        return Promise.all(promises);
    }).then(
        (output) => {
            let AllDep = [].concat.apply([], output)
            AllDep = [...new Set(AllDep)];
            console.log(JSON.stringify(AllDep));
        }).catch(err => {
            console.log(err);
        })
}

MainFunction("forever");