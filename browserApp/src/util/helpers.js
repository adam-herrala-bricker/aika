// function to sort slices by createdAt (newest first)
export const sortSliceByDate = (a, b) => {
  if (a.createdAt > b.createdAt) {
    return -1;
  } else if (a.createdAt < b.createdAt) {
    return 1;
  } else {
    return 0;
  }
};
