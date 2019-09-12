import fetch from 'node-fetch';

export const getSelectorFromArray = async (page, array, callback) => {
    for (let selector of array) {
        try {
            return await page.$eval(selector, callback);
        } catch (err) {
            continue;
        }
    }
}

export const removeTags = async (page, query, array) => {
    const restrictedTags = ['script', 'style', 'input', 'link', 'a', 'iframe', 'h1', ...array];
    for (let tag of restrictedTags) {
        await page.$$eval(`${query} ${tag}`, elements => elements.forEach(node => node.remove()));
    }
}

export const replaceImages = async (page, content, query) => {
    const images = await page.$$eval(`${query} img`, images => images.map(image => ({ outerHTML: image.outerHTML, src: image.src })));
    (await Promise.all(images.map(uploadImage))).forEach(item => {
        content = content.replace(item.old, item.new);
    });

    return content;
}

const uploadImage = async (image) => {
    const response = await fetch(process.env.UPLOAD_API, {
        method: 'POST',
        body: JSON.stringify({ url: image.src })
    });
    const data = await response.json();
    return {
        old: image.outerHTML,
        new: `<img src="${data}" />`,
    }
}