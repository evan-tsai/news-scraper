export const getSelectorFromArray = async (page, array, callback) => {
    for (let selector of array) {
        try {
            return await page.$eval(selector, callback);
        } catch (err) {
            continue;
        }
    }
}