const http = require('http');
const fs = require('fs');
const axios = require('axios');

/**
 * @type {boolean} isRunning - determines if interval should be run
 */
let isRunning;


/**
 * @type {Array} answers - array that stores calculation and if it is correct or not
 */
let answers= [];


/**
 * This is the function that performs arithmetic based off JSON data and pushes calculation to answers array
 *
 * @param {string} operation - arithmetic operators
 * @param {number} left - number to be operated on
 * @param {number} right - number to perform operation
 *
 * @return {number} answer - result of arithmetic operation
 */
calculate =(operation, left, right)=> {
  let answer;
  switch(operation) {
      case "addition":
          answer = left + right;
          break;
      case "subtraction":
          answer = left - right;
          break;
      case "multiplication":
          answer = left * right;
          break;
      case "division":
          answer = left / right;
          break;
      case "remainder":
          answer = left % right;
          break;
      default:
          answer = 'no answer available';
          break;
  }
  answers.push(answer);
  return answer;
};


/**
 * This is an async function that calls a GET request to API to retrieve JSON object of operator,operand, and expression
 * this function will await for the axios GET request before continuing
 *
 * @return {Object} returns JSON object to be posted to API endpoint
 */
async function getTask() {
    const response = await axios.get('https://interview.adpeai.com/api/v1/get-task');
    const {id, operation, left, right} = response.data;
    const answer = calculate(operation, left, right);
    return {id, answer};
}


/**
 * This is an async function that calls a POST request to API to post JSON object of id and answer
 * this function will await for the axios POST request before continuing
 *
 * @return {Object} returns JSON object that will display if id and answer are correct
 */
async function submitTask(result) {
    let response = await axios.post('https://interview.adpeai.com/api/v1/submit-task',{ id: result.id, result: result.answer });
    answers.push(response.data);
    const { status, config } = response;
    switch (status) {
        case 200:
            console.log('Success', config.data);
            break;
        case 400:
            console.log('Incorrect value in result; no ID specified; value is invalid');
            break;
        case 500:
            console.log("ID can't be found");
            break;
        default:
            console.log('There is another issue');
    }
    return response;
}

/**
 * This is an async function that calls a POST request to API to post JSON object of answer and correct status
 * this function will await for the axios POST request before continuing
 *
 * @return {Promise} returns axios promise
 */
async function postData(answers) {
    let dataJSON = JSON.stringify(answers);
    return await axios.post('http://localhost:3000/results', {dataJSON});
}

/**
 * This is an async function that will run the task in synchronous succession to ensure all calls are resolved
 * this function will await multiple functions
 */
async function runTask() {
    while (isRunning) {
        let result = await getTask();
        await submitTask(result);
        postData();
        await new Promise(resolve => setTimeout(resolve, 2000))
            .catch(error =>console.log(error.message));
        if (!isRunning) {
            break;
        }
    }
}

process.on('unhandledRejection', function(err) {
    console.log(err);
});


const server = http.createServer((req,res)=> {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'OPTIONS, POST, GET',
        'Access-Control-Max-Age': 2592000
    };

    const url = req.url;
    const method = req.method;

    if (url === '/') {
        const html = fs.createReadStream(__dirname + '/index.html', 'utf8');
        html.pipe(res);
        // res.writeHead(200, headers, {'Content-Type': 'text/html'});
        // res.write(`${answers}`);
    }

    if (url === '/start' && method === 'GET') {
        isRunning = true;
        runTask();
    }

    if (url === '/end' && method === 'GET') {
        isRunning = false;
    }

    if (url === '/results' && method === 'GET') {
        res.end(`${answers}`);
    }

});

server.listen(3000);

exports.calculate = calculate;

