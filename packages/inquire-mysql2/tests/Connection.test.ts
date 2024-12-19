import { describe, it } from 'mocha';
import { expect } from 'chai';

import Connection from '../src/Connection';


describe('Connection Test', () => {

    // Line 29
    it('Should return the correct value for lastId when _lastId is set to a positive integer', () => {
        const mockResource = {} as any;
        const connection = new Connection(mockResource);
        connection['_lastId'] = 42; 
        const lastId = connection.lastId;
        expect(lastId).to.equal(42);
    });
    
    // Line 49    
    it('should convert Date objects in the values array to ISO string format', () => {
        const mockResource = {} as any;
        const connection = new Connection(mockResource);
        const date = new Date('2023-10-05T14:48:00.000Z');
        const request = {
        query: 'SELECT * FROM table WHERE date = ?',
        values: [date]
        };
        const formatted = connection.format(request);
        expect(formatted.values[0]).to.equal(date.toISOString());
    });

    // Line 51
    it('Should handle an empty array by converting it to an empty JSON array string', () => {
        const mockResource = {} as any;
        const connection = new Connection(mockResource);
        const request = {
            query: 'SELECT * FROM table WHERE data = ?',
            values: [[]]
        };
        const formatted = connection.format(request);
        expect(formatted.values[0]).to.equal('[]');
    });

    // Line 53
    it('Should convert a nested object in the values array to a JSON string', () => {
        const mockResource = {} as any;
        const connection = new Connection(mockResource);
        const nestedObject = { key: { nestedKey: 'nestedValue' } };
        const request = {
            query: 'INSERT INTO table (data) VALUES (?)',
            values: [nestedObject]
        };
        const formatted = connection.format(request);
        expect(formatted.values[0]).to.equal(JSON.stringify(nestedObject));
    });

});
