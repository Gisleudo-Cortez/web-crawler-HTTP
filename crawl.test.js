import { normalizeURL, getURLsFromHTML } from './crawl.js';
import { test, expect } from '@jest/globals';


// normalizeURL tests

test('normalizeURL strip protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip trailing slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

test('normalizeURL strip http', () => {
    const input = 'http://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
})

// getURLsFromHTML tests

test('getURLsFromHTML absolute', () => {
    const inputHTMLBody = `
<html>
    <body>
        <a href="https://blog.boot.dev/path/"><span>Go to Boot.dev</span></a>
    </body>
</html>`
    const inputBaseURL = 'https://blog.boot.dev/path/'
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://blog.boot.dev/path/']
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
    const inputHTMLBody = `
<html>
    <body>
        <a href="/path/"><span>Go to Boot.dev</span></a>
    </body>
</html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://blog.boot.dev/path/']
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML both', () => {
    const inputHTMLBody = `
<html>
    <body>
        <a href="https://blog.boot.dev/path1/"><span>Go to Boot.dev path one</span></a>
        <a href="/path2/"><span>Go to Boot.dev path two</span></a>
    </body>
</html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = ['https://blog.boot.dev/path1/', 'https://blog.boot.dev/path2/']
    expect(actual).toEqual(expected)
})

test('getURLsFromHTML Invalid URL', () => {
    const inputHTMLBody = `
<html>
    <body>
        <a href="invalid"><span>Invalid URL</span></a>
    </body>
</html>`
    const inputBaseURL = 'https://blog.boot.dev'
    const actual = getURLsFromHTML(inputHTMLBody, inputBaseURL)
    const expected = []
    expect(actual).toEqual(expected)
})
