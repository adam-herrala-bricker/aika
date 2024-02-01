const badToken = '1111111111111111111';
const expiredUserTwoToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjM0MzJlZWQ0LWNkMDgtNDAyOS1iNmQ1LWFlM2FhMzFmNzdmMSIsInVzZXJuYW1lIjoidGVzdC50d28iLCJpYXQiOjE3MDYxNjc5NzZ9.sdKr0md5Glze4mQtRQnCZDVYZSymg-oipuT2CxE31v0';
const invalidId = '8333c83b-273a-479c-95d6-2c7da850deb1';

const user = {
  zero: {
    username: 'test.zero',
    firstName: 'test',
    lastName: 'zero',
    email: 'test.zero@example.com',
    password: 'example'
  },

  one: {
    username: 'test.one',
    firstName: 'test',
    lastName: 'one',
    email: 'test.one@example.com',
    password: 'example'
  },

  // note: user two already has confirmed email
  // this is only possible to add with a direct query to the DB
  two: {
    username: 'test.two',
    firstName: 'test',
    lastName: 'two',
    email: 'test.two@example.com',
    password: 'example',
    emailConfirmed: true
  },

  // same pre-confirmation as with user.two
  three: {
    username: 'test.three',
    firstName: 'test',
    lastName: 'three',
    email: 'test.three@example.com',
    password: '€x4mp1@',
    emailConfirmed: true,
  },

  // pre-disabled: can also only add directly to DB
  four: {
    username: 'test.four',
    firstName: 'test',
    lastName: 'four',
    email: 'test.four@example.com',
    password: 'example',
    emailConfirmed: true,
    isDisabled: true,
  },

  // a second emailConfirmed user, like user.two
  // used to test different permissions than user.two
  five: {
    username: 'test.five',
    firstName: 'test',
    lastName: 'five',
    email: 'test.five@example.com',
    password: 'example',
    emailConfirmed: true,
  },

  // same as user.two and user.five
  six: {
    username: 'test.six',
    firstName: 'test',
    lastName: 'six',
    email: 'test.six@example.com',
    password: 'example',
    emailConfirmed: true,
  }
};

const slice = {
  valid: {
    zero: {
      title: 'slice zero',
      text: 'this slice only has a title and text'
    },

    one: {
      title: 'title only slice'
    },

    two: {
      text: 'and this slice only has text'
    },

    three: {
      title: 'public slice',
      isPublic: true
    },

    four: {
      title: 'milestone slice',
      text: 'and what a milestone it was',
      isMilestone: true
    },

    five: {
      title: 'slice five',
      text: 'just another ordinary slice'
    },

    six: {
      title: '',
      text: 'here the title is an empty string, likely to happen in the real world'
    },

    seven: {
      title: 'empty text',
      text: ''
    }
  },

  invalid: {
    titleTooLong: {
      title: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
    },

    textTooLong: {
      text: 'STATELY, PLUMP BUCK MULLIGAN CAME FROM THE STAIRHEAD, bearing a bowl of lather on which a mirror and a razor lay crossed. A yellow dressing gown, ungirdled, was sustained gently-behind him by the mild morning air. He held the bowl aloft and intoned: —Introibo ad altare Dei. Halted, he peered down the dark winding stairs and called up coarsely: —Come up, Kinch. Come up, you fearful jesuit. Solemnly he came forward and mounted the round gunrest. He faced about and blessed gravely thrice the tower, the surrounding country and the awaking mountains. Then, catching sight of Stephen Dedalus, he bent towards him and made rapid crosses in the air, gurgling in his throat and shaking his head. Stephen Dedalus, displeased and sleepy, leaned his arms on the top of the staircase and looked coldly at the shaking gurgling face that blessed him, equine in its length, and at the light untonsured hair, grained and hued like pale oak.'
    },

    stringMilestone: {
      isMilestone: 'indeed'
    },

    stringPublic: {
      isPublic: 'quite'
    }
  }
};


const stream = {
  zero: {
    name: 'streamZero'
  },

  one: {
    name: 'streamOne'
  },

  two: {
    name: 'streamTwo'
  },

  three: {
    name: 'streamThree'
  },

  four: {
    name: 'streamFour'
  }
};

module.exports = {
  badToken,
  expiredUserTwoToken,
  invalidId,
  slice,
  stream,
  user
};
