const pool = require('./databasePool');

class ItemTable {
    static getItem() {
        return new Promise((resolve, reject) => {
            pool.query('SELECT todo FROM item', (err, res) => {
                if (err) return reject(err);
                console.log(res.rows[0].todo);
                let items = [res.rows[0].todo];

                resolve({ items });
            });
        });
    }

    static storeItem(item) {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO item(todo) VALUES($1) RETURNING id', [item.todo], (err, res) => {
                if (err) return reject(err);

                const itemId = res.rows[0].id;

                resolve({ itemId });
            });
        });
    }
}

module.exports = ItemTable;