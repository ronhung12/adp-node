process.env.NODE_ENV = 'test';

let chai = require('chai');
let asserttype = require('chai-asserttype');
let chaiHttp = require('chai-http');


let server = require('../server');

let should = chai.should();
let expect = chai.expect;

chai.use(chaiHttp);
chai.use(asserttype);

describe('Addition function in calculate(12+10)',function(){
    let operation = 'addition', left = 12, right = 10;
    it('result should be a number',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.be.number();
    });
    it ('should return 22',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.equal(22);
    })
});

describe('Subtraction function in calculate(12-10)',function(){
    let operation = 'subtraction', left = 12, right = 10;
    it('result should be a number',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.be.number();
    });
    it ('should return 2',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.equal(2);
    })
});

describe('Multiplication function in calculate(12*10)',function(){
    let operation = 'multiplication', left = 12, right = 10;
    it('result should be a number',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.be.number();
    });
    it ('should return 120',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.equal(120);
    })
});

describe('Division function in calculate(12/10)',function(){
    let operation = 'division', left = 12, right = 10;
    it('result should be a number',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.be.number();
    });
    it ('should return 1.2',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.equal(1.2);
    })
});

describe('Remainder function in calculate(12%10)',function(){
    let operation = 'remainder', left = 12, right = 10;
    it('result should be a number',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.be.number();
    });
    it ('should return 2',function(){
        let answer = server.calculate(operation, left, right);
        expect(answer).to.equal(2);
    })
});

describe('GET Calculation Variables from API', function(){
    it('Should return JSON object', function() {
        chai.request('http://localhost:3000')
            .get('https://interview.adpeai.com/api/v1/get-task')
            .end(function(err,res){
                expect(res.statusCode).to.equal(Object);
                done();
            })
    })

});

describe('POST Calculation to API endpoint', function(){
    it('Should return 200 status', function() {
        chai.request('http://localhost:3000')
            .post('https://interview.adpeai.com/api/v1/submit-task', { id: "adffcb11-44fb-4a55-9796-66ecae3d0e3f", result: 0.70885557714 })
            .end(function(err,res){
                expect(res.statusCode).to.equal(200);
                done();
            })
    })

});

