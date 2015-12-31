
var DisjSets = {

  s: null,
  rank: null,

  init: function( numElements ) {
    if (numElements < 0)
      return null;

    this.s = new Array(numElements);
    this.rank = new Array(numElements);
    for (var id = 0; id < numElements; id++) {
      this.s[id] = id;
      this.rank[id] = 0;
    } //for
  },

  find: function( x ) {
    if (x < 0 || x > this.s.length) {
      return null;
    }
    while(x != this.s[x]) {
      this.s[x] = this.s[this.s[x]];
      x = this.s[x];
    }
    return x;
  },

  unionSets: function( root1, root2 ) {
    var i = this.find(root1);
    var j = this.find(root2);

    if(i == j) return;

    if (this.rank[i] < this.rank[j])
      this.s[i] = j;
    else if (this.rank[i] > this.rank[j])
      this.s[j] = i;
    else {
      this.s[j] = i;
      this.rank[i]++;
    }
  }
};
