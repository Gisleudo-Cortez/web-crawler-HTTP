import { JSDOM } from 'jsdom';

async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL);
    const currentURLObj = new URL(currentURL);

    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages;
    }

    const normalizedCurrentURL = normalizeURL(currentURL);

    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++;
        return pages;
    }

    pages[normalizedCurrentURL] = 1;

    console.log(`actively crawling ${currentURL}`);

    try {
        const resp = await fetch(currentURL);
        
        if (resp.status > 399) {
            console.log(`error in fetch with status code ${resp.status} on page ${currentURL}`);
            return pages;
        }

        const contentType = resp.headers.get('content-type');
        if (!contentType.includes('text/html')) {
            console.log(`non html response, content type ${contentType} on page ${currentURL}`);
            return pages;
        }
        
        const htmlBody = await resp.text();

        const nextURLs = getURLsFromHTML(htmlBody, baseURL);

        for (const nextURL of nextURLs) {
            const updatedPages = await crawlPage(baseURL, nextURL, pages);
            pages = { ...pages, ...updatedPages }; // Merge the updated pages object
        }
    } catch (err) {
        console.log(`error in fetch ${err.message}, on page ${currentURL}`);
    }
    return pages;
}

function normalizeURL(urlString) {
    const urlObj = new URL(urlString);
    const hostpath = `${urlObj.hostname}${urlObj.pathname}`;
    if (hostpath.length > 0 && hostpath.slice(-1) === '/') {
        return hostpath.slice(0, -1);
    }
    return hostpath;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');
    for (const linkElement of linkElements) {
        if (linkElement.href.slice(0, 1) === '/') {
            // relative url
            try {
                const urlObj = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`error with relative url ${err.message}`);
            }
        } else {
            // absolute url
            try {
                const urlObj = new URL(linkElement.href);
                urls.push(urlObj.href);
            } catch (err) {
                console.log(`error with absolute url ${err.message}`);
            }
        }
    }
    return urls;
}

export { normalizeURL, getURLsFromHTML, crawlPage };