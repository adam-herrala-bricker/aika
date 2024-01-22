const user = {
  zero: {
    username: 'test.zero',
    firstName: 'test',
    lastName: 'zero',
    email: 'test.zero@gmail.com',
    password: 'example'
  },

  one: {
    username: 'test.one',
    firstName: 'test',
    lastName: 'one',
    email: 'test.one@gmail.com',
    password: 'example'
  },

  // note: user two already has confirmed email
  // this is only possible to add with a direct query to the DB
  two: {
    username: 'test.two',
    firstName: 'test',
    lastName: 'two',
    email: 'test.two@gmail.com',
    password: 'example',
    emailConfirmed: true
  }
};

module.exports = {user};
