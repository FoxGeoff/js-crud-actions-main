# Building CRUD Actions in a JavaScript REST API

## Introduction

1. Code: <https://github.com/taylonr/js-crud-actions>

2. Run to build the start code `express js-crud-actions`
3. This project has in addion
4. lowdb - data store file db.json
5. lowdash-id - generates ids for Db records
6. nodemon - auto start

### Task: Creating the API (Module 1)

1. Setting up the project
2. Getting a Product

```javascript
/* file: products.js */
module.exports = function (db) {
  router.get('/products', (req, res) => {
    res.send(db.get('products').value());
  });
  return router;
};
```

1. Creating Records

```javascript
...
  router.post('/products', (req, res) => {
    const newProduct = req.body;
    res.send(db.get('products').insert(newProduct).write());
  });
...
```

1. Working with Specific Records - edit
