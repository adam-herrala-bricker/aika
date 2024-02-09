// variable for all the different display options
// note the range goes [min, max)
// also: could have had the function remove the 's' in the case
// of a 1, but that won't work once multiple languages are supported
export const timeLevels = [
  {
    text: 'seconds ago',
    dem: 1, // denominator
    min: 0,
    max: 60
  },
  {
    text: 'minute ago',
    dem: 60,
    min: 60,
    max: 60*2
  },
  {
    text: 'minutes ago',
    dem: 60,
    min: 60*2,
    max: 60*60
  },
  {
    text: 'hour ago',
    dem: 60*60,
    min: 60*60,
    max: 60*60*2
  },
  {
    text: 'hours ago',
    dem: 60*60,
    min: 60*60*2,
    max: 60*60*24
  },
  {
    text: 'day ago',
    dem: 60*60*24,
    min: 60*60*24,
    max: 60*60*24*2
  },
  {
    text: 'days ago',
    dem: 60*60*24,
    min: 60*60*24*2,
    max: 60*60*24*30 // 30 days is close enough
  },
  // no doing weeks
  {
    text: 'month ago',
    dem: 60*60*24*30,
    min: 60*60*24*30,
    max: 60*60*24*30*2
  },
  {
    text: 'months ago',
    dem: 60*60*24*30,
    min: 60*60*24*30*2,
    max: 60*60*24*365 // again, close enough
  },
  {
    text: 'year ago',
    dem: 60*60*24*365,
    min: 60*60*24*365,
    max: 60*60*24*365*2
  },
  {
    text: 'years ago',
    dem: 60*60*24*365,
    min: 60*60*24*365*2,
    max: Infinity
  }
];