const pool = require('./databasePool');

class ItemGeneration {
    static storeItem(item) {
        console.log(item);
        pool.query('INSERT INTO item VALUES($1)', [item.todo], (err, res) => {
            if (err) return console.error(err);
        });
    }
}

module.exports = ItemGeneration;