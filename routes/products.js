var express = require('express');
var router = express.Router();
const qs = require('qs');

module.exports = function (db) {
  router
    .route('/products')
    .get((req, res) => {
      res.send(db.get('products').value());
    })
    .post((req, res) => {
      const newProduct = req.body;
      res.send(db.get('products').insert(newProduct).write());
    });

  /**
   * this 'search' must be before 'id' route
   *
   * localhost:3000/api/products/detailSearch?price[val]=259.99
   * localhost:3000/api/products/detailSearch?price[val]=259.99&name[val]=Essential Backpacks
   */
  router.route('/products/search').get((req, res) => {
    const keywords = req.query.keywords;
    const result = db.get('products').filter((_) => {
      const fullText = _.description + _.name + _.color;
      return fullText.indexOf(keywords) !== -1;
    });
    res.send(result);
  });
  /**
   * localhost:3000/api/products/detailSearch?name[val]=Essential Backpacks
   * localhost:3000/api/products/detailSearch?price[val]=300&price[op]=lt
   * localhost:3000/api/products/detailSearch?price[val]=259.9&price[op]=eq&name[val]=Essential Backpacks
   * localhost:3000/api/products/detailSearch?price[val]=300&price[op]=lt&name[val]=Essential Backpacks
   */
  router.route('/products/detailSearch').get((req, res) => {
    const query = qs.parse(req.query);

    const results = db.get('products').filter((_) => {
      return Object.keys(query).reduce((found, key) => {
        const obj = query[key];

        switch (obj.op) {
          case 'lt':
            found = found && _[key] < obj.val;
            break;
          case 'eq':
            found = found && _[key] == obj.val;
            break;
          default:
            found = found && _[key].indexOf(obj.val) !== -1;
            break;
        }
        return found;
      }, true);
    });
    res.send(results);
  });

  router
    .route('/products/:id')
    .patch((req, res) => {
      res.send(
        db.get('products').find({ id: req.params.id }).assign(req.body).write()
      );
    })
    .delete((req, res) => {
      db.get('products').remove({ id: req.params.id }).write();
      res.status().send();
    })
    .get((req, res) => {
      const result = db.get('products').find({ id: req.params.id }).value();
      if (result) {
        res.send(result);
      } else {
        res.status(404).send();
      }

      //res.send(db.get('products').find({ id: req.params.id }).value());
    });

  return router;
};
