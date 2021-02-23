# Device Service
a `NodeJs` and `typescript` application that handles devices that go on cranes, a.k.a `device-service`.

### Installation
* Make sure to have NodeJS installed by calling `brew install node` or log on to `https://nodejs.org/en/download/` for more installation options.
* Make sure to install `typescript` by running `npm install -g typescript`

### Environment 
Make sure to create and populate a `.env` file. The file should be located at the root folder of the project.
Please see `.env.example` for reference. You can also copy it and drop the `.exmaple` suffix.
**Attention**: The application comes with default JSON files (`cranes.json` and `device.json`) located at `device-service/Database`, which match the example `.env` file.

### Deployment
* To deploy the application on your machine run `npm run build`
* To deploy the application, regradless of tests passing or failing, run `npm start`.
* To test the application, without deploying it, run `npm test`.

### Requests
You can use the `POSTMAN` file, located at `device-service/Playground/PostmanRequests/device-service.postman_collection` for requests.
