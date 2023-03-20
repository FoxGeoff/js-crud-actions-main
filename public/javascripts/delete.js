const productId = '';
document.getElementById('delete').onclick = function () {
  this.productId = document.getElementById('product-id').value;

  if (this.productId === '') {
    window.alert('The product id cannot be blank');
  } else {
    axios
      .delete(`api/products/${this.productId}`)
      .then(processResults(this.productId))
      .catch((error) => {
        if (error) {
          errorOccured(error);
        }
      });
  }
};
/* TODO: http */
function processResults({ id }) {
  document.getElementById('product-id').textContent = '';
  window.alert(`Product with id: ${id} deleted`);
}
/* TODO: http */
function errorOccured(error) {
  if (error.response.status === 500) {
    window.alert(`Something went wrong on the server`);
  }
  if (error.response.status === 404) {
    window.alert(`Product with id ${this.productId} not found`);
  }
}
