const express = require('express');

const { corsMW } = require('./middlewares/corsMW');
const { albumsRouter } = require('./routes/albums.routes');

const PORT = process.env.port || 3000;

const app = express();

app.use(express.json());
app.use(corsMW);
app.use('/api/albums', albumsRouter);

app.listen(PORT, () => console.log(`Server is up on ${PORT}`));