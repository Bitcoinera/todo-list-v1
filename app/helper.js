const ListTable = require('./tables').ListTable;
const ItemTable = require('./tables').ItemTable;
const pool = require('../databasePool');

const getItemsOfList = ({list}) => {
    return new Promise ((resolve, reject) => {
        pool.query(`SELECT todo FROM item WHERE item.list = $1`, [list], (err, res) => {
            if (err) return reject(err);

            let itemsObject = res.rows;
            let itemsOfList = itemsObject.map(item => item.todo);

            resolve({itemsOfList});
        })
    })
}

module.exports = getItemsOfList;