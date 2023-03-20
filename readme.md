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
/* file: products.js - list all records */
...
module.exports = function (db) {
  router.get('/products', (req, res) => {
    res.send(db.get('products').value());
  });
  return router;
...
};
```

1. Creating Records

```javascript
/* create */
...
  router.post('/products', (req, res) => {
    const newProduct = req.body;
    res.send(db.get('products').insert(newProduct).write());
  });
...
```

```javascript
/* edit */
...
  router.patch('/products/:id', (req, res) => {
    res.send(
      db.get('products').find({ id: req.params.id }).assign(req.body).write()
    );
  });
```

1. Working with Specific Records - edit

```javascript
/* delete */
...
  router.delete('/products/:id', (req, res) => {
    db.get('products').remove({ id: req.params.id }).write();
    res.status().send();
  });
...
```

1. Working with Specific Records - delete

```javascript
/* GET a specific record */
...
  router.get('/products/:id', (req, res) => {
    res.send(db.get('products').find({ id: req.params.id }).value());
  });
...
```

1. Working with Specific Records - list

### Task: re-factor the class

```Javascript
/* Original */
module.exports = function (db) {
  router.get('/products', (req, res) => {
    res.send(db.get('products').value());
  });

  router.post('/products', (req, res) => {
    const newProduct = req.body;
    res.send(db.get('products').insert(newProduct).write());
  });

  router.patch('/products/:id', (req, res) => {
    res.send(
      db.get('products').find({ id: req.params.id }).assign(req.body).write()
    );
  });

  router.delete('/products/:id', (req, res) => {
    db.get('products').remove({ id: req.params.id }).write();
    res.status().send();
  });

  router.get('/products/:id', (req, res) => {
    res.send(db.get('products').find({ id: req.params.id }).value());
  });

  return router;
};
```

```Javascript
/* re-factored class */
var express = require('express');
var router = express.Router();

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
  }).get((req, res) => {
    res.send(db.get('products').find({ id: req.params.id }).value());
  });

  return router;
};
```

## Kanban Task: Connecting the Front End (module #3)

1. Getting a list of products

```javascript
/* file:read.js */
document.getElementById('load').onclick = function () {
  const req = new XMLHttpRequest();
  req.open('GET', '/api/products');
  req.onload = function () {
    const data = JSON.parse(req.response);
    console.log(data);
    addList({ data });
  };
  req.send(); //call API

};
```

1. Using a library for requests -axios (http library)

```javascript

document.getElementById('load').onclick = function () {
  const value = document.getElementById('product-id').value;
  if (value === '') {
    axios.get('/api/products').then(addList);
  } else {
    axios.get(`api/products/${value}`).then(addSingle);
  }
```

Task: Handle missing Records (clip)

```javascript
/* file: routes/products.js */
  .delete((req, res) => {
    db.get('products').remove({ id: req.params.id }).write();
    res.status().send();
  }).get((req, res) => {     //<= here
    const result = db.get('products').find({ id: req.params.id }).value()
    if(result) {
      res.send(result);
    } else {
      res.status(404).send();
    }
```

```javascript
/* public/javascript/read.js */
document.getElementById('load').onclick = function () {
  const value = document.getElementById('product-id').value;
  if (value === '') {
    axios.get('/api/products').then(addList);
  } else {
    axios
      .get(`api/products/${value}`)
      .then(addSingle)
      .catch((error) => {
        if (error.response.status === 404) {
          notFound();
        }
      });
  }
...
```

### Task: Creating a New Product (clip 3:6)

1. in public/javascript/create.js

```Javascript
document.getElementById("submit").onclick = function (evt) {
  evt.preventDefault();
  const formData =  new FormData(document.querySelector("form"));

  axios.post("/api/products", {
    name: formData.get("name"),
    price: formData.get("price"),
    quantity: formData.get("quantity"),
    description: formData.get("description"),
    color: formData.get("color"),

  }).then(processResults);
};
```

### Task: Updating an Existing Product (clip 3:7)
