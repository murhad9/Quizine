module.exports = {
    get: (req : any, res : any) => {
        res.send('Welcome to the Colorimage API. This is a test route!');
    },
    surprise: (req : any, res : any) => {
        res.send('Surprise! This is another test route!');
    },
};
