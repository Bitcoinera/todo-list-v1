const pool = require('./databasePool');

class ItemTable {
    static getItem() {
        return new Promise((resolve, reject) => {
            pool.query('SELECT todo FROM item', (err, res) => {
                if (err) return reject(err);
                let itemsObject = res.rows;
                let items = itemsObject.map(item => item.todo);

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

class ListTable {

    static storeList(list) {
        return new Promise ((resolve, reject) => {
            pool.query('INSERT INTO list(title) VALUES($1) RETURNING id', [list.title], (err, res) => {
                if (err) return reject(err);

                const listId = res.rows[0].id;

                resolve({ listId });
            });
        })
    }
}

module.exports = {ItemTable, ListTable};