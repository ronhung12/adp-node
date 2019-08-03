const http = require('http');
const fs = require('fs');
const axios = require('axios');

let isRunning;
let answers= [];

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


async function getTask() {
    const response = await axios.get('https://interview.adpeai.com/api/v1/get-task');
    const {id, operation, left, right} = response.data;
    const answer = calculate(operation, left, right);
    return {id, answer};
}

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

async function postData(answers) {
    let dataJSON = JSON.stringify(answers);
    let response = await axios.post('http://localhost:3000/results', { dataJSON });
    return response;
}

async function runTask() {
    while (isRunning) {
        let result = await getTask();
        await submitTask(result);
        postData();
        await new Promise(resolve => setTimeout(resolve, 1000))
            .catch(error =>console.log(error.message));
    }
}



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
