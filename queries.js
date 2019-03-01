const pool = require('./databasePool');

class ItemTable {
    static getItem() {
        return new Promise((resolve, reject) => {
            pool.query('SELECT todo FROM item', (err, res) => {
                if (err) return reject(err);
                let itemsObject = res.rows;
                let items = itemsObject.map(item => item.todo);

                resolve({items});
            });
        });
    }

    static storeItem(item) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT INTO item(todo, list) VALUES($1, $2) ON CONFLICT ON CONSTRAINT same_todo
            DO NOTHING RETURNING id`, [item.todo, item.list], (err, res) => {
                if (err) return reject(err);

                if (res.rows[0]) {
                    const itemId = res.rows[0].id;

                    resolve({itemId});
                }
            });
        });
    }

    static deleteItem(todo) {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE FROM item WHERE todo = $1`, [todo], (err, res) => {
                if (err) return reject(err);

                resolve();
            })
        })
    }
}

class ListTable {

    static getLists() {
        return new Promise ((resolve, reject) => {
            pool.query(`SELECT title FROM list`, (err, res) => {
                if (err) return reject(err);

                let listsObject = res.rows;
                let lists = listsObject.map(list => list.title);

                resolve({lists});
            })
        })
    }

    static storeList(list) {
        return new Promise ((resolve, reject) => {
            pool.query(`INSERT INTO list(title) VALUES($1) ON CONFLICT ON CONSTRAINT same_title
            DO NOTHING RETURNING id`, [list.title], (err, res) => {
                if (err) return reject(err);
                
                if (res.rows[0]) {
                    const listId = res.rows[0].id;

                    resolve({listId});
                }
            });
        })
    }

    static getItemsOfList({list}) {
        return new Promise ((resolve, reject) => {
            pool.query(`SELECT todo FROM item WHERE item.list = $1`, [list], (err, res) => {
                if (err) return reject(err);

                let itemsObject = res.rows;
                let itemsOfList = itemsObject.map(item => item.todo);

                resolve({itemsOfList});
            })
        })
    }
}

module.exports = {ItemTable, ListTable};