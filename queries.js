const pool = require('./databasePool');

class ItemTable {
    static getItem() {
        pool.query('SELECT todo FROM item', (err, res) => {
            if (err) return console.error(err);
            console.log(res.rows[0].todo);
            return res.rows[0].todo;
        });
    }

    static storeItem(item) {
        pool.query('INSERT INTO item(todo) VALUES($1)', [item.todo], (err, res) => {
            if (err) return console.error(err);
        });
    }
}

module.exports = ItemTable;