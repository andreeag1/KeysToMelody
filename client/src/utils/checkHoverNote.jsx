const checkHoverNote = (lineIndex, spaceIndex) => {
  console.log(lineIndex, spaceIndex);
  const newLineIndex = lineIndex % 15;
  const newSpaceIndex = spaceIndex % 60;
  if (lineIndex) {
    if (newLineIndex == 4) {
      return "e/4";
    } else if (newLineIndex == 3) {
      return "g/4";
    } else if (newLineIndex == 2) {
      return "b/4";
    } else if (newLineIndex == 1) {
      return "d/5";
    } else if (newLineIndex == 0) {
      return "f/5";
    } else if (newLineIndex == -1) {
      return "a/5";
    } else if (newLineIndex == -2) {
      return "c/6";
    } else {
      return "c/6";
    }
  } else {
    if (0 <= newSpaceIndex && newSpaceIndex <= 3) {
      return "e/5";
    } else if (4 <= newSpaceIndex && newSpaceIndex <= 7) {
      return "c/5";
    } else if (8 <= newSpaceIndex && newSpaceIndex <= 11) {
      return "a/4";
    } else if (12 <= newSpaceIndex && newSpaceIndex <= 15) {
      return "f/4";
    } else if (16 <= newSpaceIndex && newSpaceIndex <= 19) {
      return "d/4";
    } else if (20 <= newSpaceIndex && newSpaceIndex <= 23) {
      return "b/3";
    } else if (24 <= newSpaceIndex && newSpaceIndex <= 27) {
      return "g/3";
    } else {
      return "c/6";
    }
  }
};

export default checkHoverNote;
