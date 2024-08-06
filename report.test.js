import { sortPages } from './report.js';
import { test, expect } from '@jest/globals';


// normalizeURL tests

test('sortPages 2 pages', () => {
    const input = {
        'https://blog.boot.dev/path':1,
        'https://blog.boot.dev':3
    }
    const actual = sortPages(input)
    const expected = [
        ['https://blog.boot.dev', 3],
        ['https://blog.boot.dev/path',1]
    ]
    expect(actual).toEqual(expected)
})

test('sortPages 4 pages', () => {
    const input = {
        'https://blog.boot.dev/path': 1,
        'https://blog.boot.dev': 3,
        'https://blog.boot.dev/another-path': 5, // Adding a new URL
        'https://blog.boot.dev/yet-another-path': 7 // Adding another new URL
    }
    const actual = sortPages(input)
    const expected = [
        ['https://blog.boot.dev/yet-another-path', 7],
        ['https://blog.boot.dev/another-path', 5],
        ['https://blog.boot.dev', 3],
        ['https://blog.boot.dev/path', 1]
    ]
    expect(actual).toEqual(expected)
})