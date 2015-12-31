

var node = {
  value: null,
  left: null,
  right: null
};

function BinarySearchTree() {
  this._root = null;
}

//add new properties to an existing prototype
BinarySearchTree.prototype = {

  //restore constructor
  constructor: BinarySearchTree,
  add: function (value) {
    var newNode = {
      value: value,
      left: null,
      right: null
    },
        current;

    if (this._root == null) {
      this._root = newNode;
    } else {
      current = this._root;

      while (true) {
        if (value < current.value) {
          if (current.left == null) {
            current.left = newNode;
            break;
          }  else {
            current = current.left;
          }
        } else if (value > current.value) {
          if (current.right == null) {
            current.right = newNode;
            break;
          } else {
            current = current.right;
          }
        } else {
          break;
        }
      }  //while
    } //if-else
  },
  //accepts a value as argument and returns true if the value is
  //present in the tree or false if not
  contains: function (value) {
    var found    = false,
         current = this._root;

    //make sure there is a node to search
    while(!found && current) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      }
      else {
        found = true;
      }
    }

    return found;
  },
  traverse: function(process) {
    //helper function
    function inOrder(node) {
      if (node) {
        if (node.left != null) {
          inOrder(node.left);
        }
        process.call(this, node);
        if (node.right != null) {
          inOrder(node.right);
        }
      }
    }
    inOrder(this._root);
  },
  size: function() {
    var length = 0;
    this.traverse(function(node) { length++; });
    return length;
  },
  toArray: function() {
    var result = [];
    this.traverse(function(node) { result.push(node.value); });
    return result;
  },
  toString: function() {
    return this.toArray().toString();
  }
};
