// Reddit constructor function to encapsulate HTTP and pagination logic
app.factory('Reddit', function($http) {
  var Reddit = function($url) {
    this.items = [];
    this.busy = false;
    this.after = $url;
  };

  Reddit.prototype.nextPage = function() {
    if (this.busy) return;
    if (this.after == null) return;
    this.busy = true;

    var url = this.after;
      $http.get(url).success(function(data) {
        var items = data.results;
        this.count = data.count
        this.extra = data.extra_data
        this.year = data.year
        this.countries = data.countries
        for (var i = 0; i < items.length; i++) {
          this.items.push(items[i]);
        }
        this.after = data.next;
        this.busy = false;
      }.bind(this));
    
  };

  return Reddit;
});
