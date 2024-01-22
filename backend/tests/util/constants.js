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
  },

  // same pre-confirmation as with user.two
  three: {
    username: 'test.three',
    firstName: 'test',
    lastName: 'three',
    email: 'test.three@gmail.com',
    password: '€x4mp1@',
    emailConfirmed: true,
  },

  // pre-disabled: can also only add directly to DB
  four: {
    username: 'test.four',
    firstName: 'test',
    lastName: 'four',
    email: 'test.four@gmail.com',
    password: 'example',
    emailConfirmed: true,
    isDisabled: true,
  }
};

module.exports = {user};
