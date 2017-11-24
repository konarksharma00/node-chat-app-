var expect = require('expect');

var {generateMessage} = require('./message');

describe('generateMessage',()=>{
    it('should generate a message',()=>{
        var from = 'konark'
        var text = 'sharma'

        var message = generateMessage(from, text);

        expect(message).toInclude({from,text});
        expect(message.createdAt).toBeA('number');

    })
})