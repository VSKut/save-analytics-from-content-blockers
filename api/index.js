import express from "express";
import config from "../config";
const cors = require('cors')
import { info, error } from "../src/logger";
import { enableDefaultProxy } from "../src/proxy/configured-domains";

let app = express();
app.disable("x-powered-by");
app.use(cors());

app.use("/robots.txt", (_, res) => res.status(200).set("Content-Type", "text/plain").send(
    'User-agent: *\nDisallow: /'
));

enableDefaultProxy(app);

app.use("/", (_, res) => res.status(200).set("Content-Type", "text/html").send(
    '<html><head><title>200</title><meta charset="UTF-8"/><meta name="robots" content="noindex, nofollow"></head>' +
    '<body><noscript></noscript>It works!</body></html>'
));

app.use((err, _, res, next) => { // Express error handler
    if (res.headersSent) {
        return next(err);
    }
    error(err);
    return res.status(500).send({ error: "An error ocurred. Error info was logged." });
});

app.listen(config.httpPort, function onReady () {
    info(`Analytics proxy web server is listening on port ${ config.httpPort }`);
});
