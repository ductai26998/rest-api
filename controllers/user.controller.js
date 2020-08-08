var User = require('../models/user.model');
var bcrypt = require('bcrypt');
var cloudinary = require('cloudinary').v2;

cloudinary.config({ 
  cloud_name: 'ductai26998', 
  api_key: '744596793339385', 
  api_secret: '_jqie405YJR-Jct1XSBwKkbUUy8' 
});

module.exports.get = async (request, response) => {
  var users = await User.find().lean();
  response.render('users/index', {
    users: users
  });
};

module.exports.search = async (request, response) => {
  var q = request.query.q;
  var users = await User.find().lean();
  var matchedUsers = users.filter(function(user) {
    return user.name.toLowerCase().indexOf(q.toLowerCase()) !== -1;
  });
  response.render('users/index', {
    users: matchedUsers
  });
};

module.exports.create = (request, response) => {
  console.log(request.cookies);
  response.render('users/create');
}

module.exports.postCreate = async (request, response) => {
  if (!request.file) {
    request.body.avatar = "https://hinhanhdephd.com/wp-content/uploads/2020/07/hinh-anh-mat-cuoi-sieu-cute-dang-yeu-14-600x375.jpg";
  } else {
    request.body.avatar = request.file.path.split("\\").slice(1).join("/");
    cloudinary.uploader.upload(request.body.avatar, function(error, result) {
      console.log(result, error)
    });
  }
  request.body.isAdmin = "false";
  request.body.wrongLoginCount = 0;
  request.body.cart = {};
  var hashedPassword = await bcrypt.hash(request.body.password, 10)
  request.body.password = hashedPassword;
  await User.create(request.body);
 
  response.redirect('/users');
};

module.exports.delete = async (request, response) => {
  await User.deleteOne({_id: request.params.id});
  response.redirect('/users');
};

module.exports.profile = async (request, response) => {
  var user = await User.findById(request.params.id).lean();
  response.render('users/profile', {
    id: request.params.id,
    user: user,
    getAvatarUrl: function(url) {
      if (url.indexOf('http') === 0) {
        return url;
      }
      return '/' + url;
    }
  });
};

module.exports.postProfile = async(request, response) => {
  var userId = request.params.id;
  await User.findByIdAndUpdate(userId, request.body);

  response.redirect('/users');
};

module.exports.avatar = (request, response) => {
  response.render('users/avatar', {
    id: request.params.id
  });
}

module.exports.postAvatar = async (request, response) => {
  var id = request.params.id;
  if (!request.file) {
    request.body.avatar = "https://hinhanhdephd.com/wp-content/uploads/2020/07/hinh-anh-mat-cuoi-sieu-cute-dang-yeu-14-600x375.jpg";
  } else {
    request.body.avatar = request.file.path.split("\\").slice(1).join("/");
    cloudinary.uploader.upload(request.body.avatar, function(error, result) {
      console.log(result, error)
    });

    await User.findByIdAndUpdate(id, {avatar: request.body.avatar});
  }
  response.redirect('/users/' + id + '/profile');
};

