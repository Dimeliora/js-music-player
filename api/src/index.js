const express = require('express');

const corsMW = require('./middlewares/cors-middleware');
const albumsRouter = require('./routes/albums.routes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(corsMW);

app.use('/api/albums', albumsRouter);

app.listen(PORT, () => console.log(`Server is up on ${PORT}`));
