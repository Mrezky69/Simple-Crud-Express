const cors = require('cors');
const app = require('./app');
const sequelize = require('./config/db');

app.use(cors());

const PORT = process.env.PORT || 5000;

sequelize.sync({ force: false, alter: false })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch(err => console.log(err));
