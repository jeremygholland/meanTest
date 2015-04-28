var app = angular.module('flapperNews', ['ui.router']);


app.config([
'$stateProvider',
'$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {


    $stateProvider
      .state('home', {
        controller: 'MainCtrl',
      url: '/home',
      templateUrl: '/home.html',
      resolve: {
    postPromise: ['posts', function(posts){
      return posts.getAll();
        }]
      }
    })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: '/posts.html',
        controller: 'PostsCtrl'
      })
      $urlRouterProvider.otherwise('home');
  }]);

app.factory('posts', [ '$http', function($http){
  var o = {
    posts: [],
  }
 o.getAll = function() {
    return $http.get('/posts').success(function(data){
      angular.copy(data, o.posts);
    });
  }

  o.create = function(post) {
  return $http.post('/posts', post).success(function(data){
    o.posts.push(data);
  });
};
      return o;

  }]);

app.controller('MainCtrl', [
  '$scope',
  '$http',
  'posts',
  function($scope, $http, posts){
    $scope.posts = [];
    console.log('yes this is loading');
     $scope.posts = $scope.posts.concat(posts.posts);
     console.log($scope.posts)
   $scope.addPost = function(){
    if(!$scope.title || $scope.title ===''){return;}

    posts.create({
        title: $scope.title, 
        link: $scope.link,
      });
    $scope.title = '';
    $scope.link = '';

   }

   $scope.incrementUpvotes = function(post){
    post.upvotes += 1;
   };


  }]);


app.controller('PostsCtrl', [
  '$scope',
  '$http',
  '$stateParams',
  'posts',
  function($scope, $http, $stateParams, posts){
    $scope.post = posts.posts[$stateParams.id];
  }])
