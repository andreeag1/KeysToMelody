const checkHoverNote = (lineIndex, spaceIndex) => {
  console.log(lineIndex, spaceIndex);
  if (lineIndex) {
    if (lineIndex == 4) {
      return "e/4";
    } else if (lineIndex == 3) {
      return "g/4";
    } else if (lineIndex == 2) {
      return "b/4";
    } else if (lineIndex == 1) {
      return "d/5";
    } else if (lineIndex == 0) {
      return "f/5";
    } else if (lineIndex == -1) {
      return "a/5";
    } else if (lineIndex == -2) {
      return "c/6";
    }
  } else {
    if (0 <= spaceIndex && spaceIndex <= 3) {
      return "e/5";
    } else if (4 <= spaceIndex && spaceIndex <= 7) {
      return "c/5";
    } else if (8 <= spaceIndex && spaceIndex <= 11) {
      return "a/4";
    } else if (12 <= spaceIndex && spaceIndex <= 15) {
      return "f/4";
    } else if (16 <= spaceIndex && spaceIndex <= 19) {
      return "d/4";
    } else if (20 <= spaceIndex && spaceIndex <= 23) {
      return "b/3";
    } else if (24 <= spaceIndex && spaceIndex <= 27) {
      return "g/3";
    }
  }
};

export default checkHoverNote;
