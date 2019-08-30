export const getSelectorFromArray = async (page, array, callback) => {
    for (let selector of array) {
        try {
            return await page.$eval(selector, callback);
        } catch (err) {
            continue;
        }
    }
}

export const removeTags = async (page, array) => {
    const restrictedTags = ['script', 'style', 'link', 'a', 'iframe', 'h1', ...array];
    for (let tag of restrictedTags) {
        await page.$$eval(tag, elements => elements.forEach(node => node.remove()));
    }
}