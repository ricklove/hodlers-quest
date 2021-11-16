export async function delay(timeout) {
    return await new Promise((resolve) => {
        setTimeout(resolve, timeout);
    });
}
//# sourceMappingURL=delay.js.map