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
    for (let tag of array) {
        await page.$$eval(tag, elements => elements.forEach(node => node.remove()));
    }
}