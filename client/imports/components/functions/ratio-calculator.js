_ = lodash;

function redistribute(items) {
  let lockedRatio = 0;
  let unlockedNumber = 0;
  _.each(items, (item) => {
    if (item.locked) lockedRatio += item.ratio;
    else unlockedNumber++;
  });
  let unlockedRatio = (1-lockedRatio)/unlockedNumber;
  if (unlockedRatio < 0) unlockedRatio = 0;
  _.each(items, (item) => {
    if (!item.locked) item.ratio = unlockedRatio;
  });
  return items;
}

function redistributePyramid(items) {
  let lockedRatio = 0;
  let unlockedNumber = 0;
  _.each(items, (item) => {
    if (item.lockedMale) lockedRatio += item.male;
    else unlockedNumber++;
    if (item.lockedFemale) lockedRatio += item.female;
    else unlockedNumber++;
  });
  let unlockedRatio = (1-lockedRatio)/unlockedNumber;
  if (unlockedRatio < 0) unlockedRatio = 0;
  _.each(items, (item) => {
    if (!item.lockedMale) item.male = unlockedRatio;
    if (!item.lockedFemale) item.female = unlockedRatio;
  });
  return items;
}


export { redistribute, redistributePyramid };