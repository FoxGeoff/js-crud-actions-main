# Building CRUD Actions in a JavaScript REST API

## Introduction

1. Code: <https://github.com/taylonr/js-crud-actions>

2. Run to build the start code `express js-crud-actions`
3. This project has in addion
4. lowdb - data store file db.json
5. lowdash-id - generates ids for Db records
6. nodemon - auto start
7. Design - <https://digital.gov/>

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

1. Ref <https://app.pluralsight.com/course-player?clipId=44e5e0db-4243-49d4-8d60-1874abe5744b>
2. Two parts: Load the product then edit and update the product
3. In the  public/javascript/updat.js file

### Task: Delete (clip 3:8 summary)

1. Tips for Delete: product-id(input) > delete(submit) > /api/products:id(http)
2. public/javascript/delete.js file

## Kanban Task: Searching Data (Module #4)

### Task: Creating a full-text search (clip4:2)

1. Ref: <https://app.pluralsight.com/course-player?clipId=f8243b74-8890-4532-9715-7100b9f2c786>

2. Add new route '/products/search' to routes/products.js'

```javascript
  /* this 'search' must be before 'id' route  */
  router.route('/products/search').get((req, res) => {
    const keywords = req.query.keywords;
    const result = db.get('products').filter((_) => {
      const fullText = _.description + _.name + _.color;
      return fullText.indexOf(keywords) !== -1;
    });
    res.send(result);
  });
  ```

### Task: Creating detail searches (clip4:3)

1. run `npm i -s qs`
2. Add `const qs = require('qs');`

```javascript
...
/**
   * localhost:3000/api/products/detailSearch?price[val]=259.99
   * localhost:3000/api/products/detailSearch?price[val]=259.99&name[val]=Essential Backpacks
   */
  router.route('/products/detailSearch').get((req, res) => {
    const query = qs.parse(req.query);

    const results = db.get('products').filter((_) => {
      return Object.keys(query).reduce((found, key) => {
        const obj = query[key];
        found = found && _[key] == obj.val;
        return found;
      }, true);
    });
...
```
