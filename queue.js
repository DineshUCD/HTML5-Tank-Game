var Queue = {
  frontIndex: 0,
  rearIndex: 0,
  init: function(array) {
    this.size = array.length;
    this.frontIndex = 0;
    this.rearIndex = array.length;
  },
  isEmpty: function() {
    return (this.frontIndex == this.rearIndex);
  },
  enqueue: function(array, element) {
    array[this.rearIndex++] = element;
  },
  dequeue: function(array) {
    if (this.isEmpty()) {
      return null;
    }
    var result = array[this.frontIndex];
    array.splice(0, 1);
    this.rearIndex--;
    return result;
  },
  peek: function(array) {
    if (this.isEmpty()) {
      return null;
    }
    return array[this.frontIndex];
  },
  remove: function(array, element) {
    var result = null;
    var index = array.indexOf(element);
    if (index < 0)
      return false;
    if (index == this.frontIndex) {
      result = this.dequeue(array);
    } else {
      array.removeAt(element, index);
      this.rearIndex--;
      result = element;
    }
    return result;
  }
} //Queue Class
