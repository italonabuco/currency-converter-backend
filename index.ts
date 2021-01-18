import AppController from "./src/app";

const port = process.env.PORT || 5000;

const app = new AppController().express;

app.listen(port, () => {
    console.log(`Server is running at port: ${port}`)
});

