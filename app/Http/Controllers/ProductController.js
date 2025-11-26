export default class ProductController {
  // Display a listing of the resource
  index(req, res) {
    res.send('Index method');
  }

  // Show a single resource
  show(req, res) {
    res.send('Show method');
  }

  // Show form to create a resource
  create(req, res) {
    res.send('Create method');
  }

  // Store a new resource
  store(req, res) {
    res.send('Store method');
  }

  // Show form to edit a resource
  update(req, res) {
    res.send('Update method');
  }

  // Delete a resource
  destroy(req, res) {
    res.send('Destroy method');
  }
}
