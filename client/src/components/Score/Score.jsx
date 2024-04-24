import React, { useRef, useEffect, useState } from "react";
import VexFlow from "vexflow";
import checkHoverNote from "../../utils/checkHoverNote";
import "./Score.css";
import Note from "../../assets/cursorNote.png";

const VF = VexFlow.Flow;
const { Formatter, Renderer, Stave, StaveNote, Voice, StaveConnector } = VF;

const clefWidth = 30;
const timeWidth = 30;

export default function Score({
  newStave,
  setNewStave,
  staveLength,
  timeSig,
  width,
  height,
  setHeight,
  confirmed,
}) {
  const container = useRef();
  const rendererRef = useRef();
  const [currX, setCurrX] = useState(280);
  const [currY, setCurrY] = useState(0);
  const [staves, setStaves] = useState([]);
  const [staveMap, setStaveMap] = useState([]);
  const [newStaves, setNewStaves] = useState([]);
  const [rerenderStave, setRerenderStave] = useState(false);
  const [noteOffset, setNoteOffset] = useState({ x: 0, y: 0 });
  const [showNote, setShowNote] = useState(false);

  const handleCursor = (event) => {
    const rect = container.current.getBoundingClientRect();
    const offsetX = 10; // Adjust this offset as needed
    const offsetY = -20; // Adjust this offset as needed
    const x = event.clientX - rect.left + offsetX;
    const y = event.clientY - rect.top + offsetY;
    setNoteOffset({ x, y });
    setShowNote(true);
  };

  const handleMouseClick = () => {
    setShowNote(false);
  };

  useEffect(() => {
    if (confirmed) {
      if (rendererRef.current == null || rerenderStave) {
        const myNode = document.getElementById("output");
        myNode.innerHTML = "";
        rendererRef.current = new Renderer(
          container.current,
          Renderer.Backends.SVG
        );
      }
      const renderer = rendererRef.current;
      renderer.resize(width, height);
      const context = renderer.getContext();
      context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
      const clefAndTimeWidth = clefWidth + timeWidth;
      const staveWidth = 200;
      let currentX = 0;

      if ((staves.length == 0 && staveMap.length == 0) || rerenderStave) {
        const topStave = new Stave(20, 0, staveWidth);
        const bottomStave = new Stave(20, 150, staveWidth);
        topStave.setWidth(staveWidth + clefAndTimeWidth);
        bottomStave.setWidth(staveWidth + clefAndTimeWidth);
        topStave.addClef("treble");
        bottomStave.addClef("bass");
        topStave.addTimeSignature(timeSig);
        bottomStave.addTimeSignature(timeSig);
        currentX += topStave.getWidth();

        const brace = new StaveConnector(topStave, bottomStave).setType(3);
        const lineLeft = new StaveConnector(topStave, bottomStave).setType(1);
        // const lineRight = new StaveConnector(topStave, bottomStave).setType(6);

        topStave.setContext(context).draw();
        bottomStave.setContext(context).draw();

        // lineRight.setContext(context).draw();
        lineLeft.setContext(context).draw();
        brace.setContext(context).draw();

        setStaves(newStaves);
        if (rerenderStave == false) {
          setStaveMap([
            {
              stave: topStave,
              isLeft: bottomStave,
              currX: 20,
              currY: 0,
              width: staveWidth,
            },
            {
              stave: bottomStave,
              currX: 20,
              currY: 150,
              width: staveWidth,
            },
          ]);
        }
      }
      console.log(staveMap.length);
      console.log(staveMap);
      if (rerenderStave && staveMap.length >= 1) {
        console.log("rerender");
        let i = 1;
        for (i = 1; i < staveMap.length; i++) {
          if (staveMap[i].isLeft) {
            const brace = new StaveConnector(
              staveMap[i].stave,
              staveMap[i].isLeft
            ).setType(3);
            const lineLeft = new StaveConnector(
              staveMap[i].stave,
              staveMap[i].isLeft
            ).setType(1);

            lineLeft.setContext(context).draw();
            brace.setContext(context).draw();
          }
          staveMap[i].stave.setContext(context).draw();
        }
        setRerenderStave(false);
      }

      newStaves.forEach((notes, i) => {
        const processedNotes = notes
          .map((note) => (typeof note === "string" ? { key: note } : note))
          .map((note) =>
            Array.isArray(note)
              ? Array.isArray(note[0])
                ? { keys: note[0], duration: note[1] }
                : { key: note[0], duration: note[1] }
              : note
          )
          .map(({ key, ...rest }) =>
            typeof key === "string"
              ? {
                  key: key.includes("/") ? key : `${key[0]}/${key.slice(1)}`,
                  ...rest,
                }
              : rest
          )
          .map(
            ({ key, keys, duration }) =>
              new StaveNote({
                keys: key ? [key] : keys,
                duration: String(duration),
              })
          );
        Formatter.FormatAndDraw(context, staveMap[i].stave, processedNotes, {
          auto_beam: true,
        });
      });
      if (newStave && (staveLength - 1) % 3 != 0) {
        const topStave = new Stave(
          currX,
          currY,
          staveLength - 1 < 3 ? 200 : 220
        );
        const bottomStave = new Stave(
          currX,
          currY + 150,
          staveLength - 1 < 3 ? 200 : 220
        );
        setCurrX(currX + topStave.getWidth());
        topStave.setContext(context).draw();
        bottomStave.setContext(context).draw();
        setStaveMap([
          ...staveMap,
          {
            stave: topStave,
            currX: currX,
            currY: currY,
            width: staveLength - 1 < 3 ? 200 : 220,
          },
          {
            stave: bottomStave,
            currX: currX,
            currY: currY + 150,
            width: staveLength - 1 < 3 ? 200 : 220,
          },
        ]);
      } else if (newStave && (staveLength - 1) % 3 == 0) {
        const topStave = new Stave(20, currY + 300, 220);
        const bottomStave = new Stave(20, currY + 450, 220);
        topStave.addClef("treble");
        bottomStave.addClef("bass");
        const brace = new StaveConnector(topStave, bottomStave).setType(3);
        const lineLeft = new StaveConnector(topStave, bottomStave).setType(1);
        setCurrX(240);
        setCurrY(currY + 300);
        setHeight(height + 150);
        topStave.setContext(context).draw();
        bottomStave.setContext(context).draw();
        lineLeft.setContext(context).draw();
        brace.setContext(context).draw();
        setStaveMap([
          ...staveMap,
          {
            stave: topStave,
            isLeft: bottomStave,
            currX: 20,
            currY: currY + 300,
            width: 220,
          },
          { stave: bottomStave, currX: 20, currY: currY + 450, width: 220 },
        ]);
      }
      setNewStave(false);
    }
  }, [newStaves, staves, newStave, rerenderStave, confirmed]);

  useEffect(() => {
    if (container.current && staveMap[0]) {
      container.current.addEventListener("mousemove", handleMouseMove);
      container.current.addEventListener("mousedown", handleMouseMove);

      return () => {
        container.current.removeEventListener("mousemove", handleMouseMove);
        container.current.removeEventListener("mousedown", handleMouseMove);
      };
    }
  }, [staves, staveMap]);

  const handleMouseMove = (event) => {
    const boundingRect = container && container.current.getBoundingClientRect();
    const mouseX = event.clientX - boundingRect.left;
    const mouseY = event.clientY - boundingRect.top;

    // Calculate the vertical position of the mouse relative to the stave
    const staffLineHeight = staveMap[0].stave.getSpacingBetweenLines();
    const staffLines = staveMap[0].stave.getYForLine(0);
    const relativeY = mouseY - staffLines;
    let lineIndex = relativeY / staffLineHeight;

    // Calculate the space height (distance between lines)
    const numSpacesBetweenLines = 4; // Assuming 4 spaces between each line
    const spaceHeight = staffLineHeight / numSpacesBetweenLines;
    const relativeSpaceY = relativeY % staffLineHeight;
    let lineHovered = false;
    let spaceHovered = false;

    // Check if the relative space Y position is closer to the space or the line
    if (
      relativeSpaceY < spaceHeight / 2 ||
      relativeSpaceY > staffLineHeight - spaceHeight / 2
    ) {
      lineHovered = true;
    } else {
      spaceHovered = true;
    }

    let spaceIndex = undefined;
    if (lineHovered) {
      lineIndex = Math.round(lineIndex);
    } else if (spaceHovered) {
      spaceIndex = Math.floor(relativeY / spaceHeight);
      lineIndex = undefined;
    }

    let beatIndex = 0;
    let hoveredStaveIndex = -1;
    // Loop through staveMap to find the stave that the mouse is hovering over
    for (let i = 0; i < staveMap.length; i++) {
      const { currX, currY, width, stave } = staveMap[i];
      if (
        mouseX >= currX &&
        mouseX <= currX + width &&
        mouseY >= currY &&
        mouseY <= currY + stave.getHeight()
      ) {
        hoveredStaveIndex = i;

        // Calculate beat index within the hovered stave
        const beatsInBar = timeSig.split("/")[0]; // Assuming 4 beats per bar
        const beatWidth = stave.getWidth() / beatsInBar;
        const relativeMouseX = mouseX - currX; // Adjust mouseX relative to stave position
        beatIndex = Math.floor(relativeMouseX / beatWidth);
        break;
      }
    }

    if (event.type == "mousedown") {
      handleSetNewNote(lineIndex, spaceIndex, beatIndex, hoveredStaveIndex);
    }
  };

  const handleSetNewNote = (
    lineIndex,
    spaceIndex,
    beatIndex,
    hoveredStaveIndex
  ) => {
    const newNote = checkHoverNote(lineIndex, spaceIndex);
    let newListArray = structuredClone(staves);
    let i = 0;
    let newStaveArray = newListArray[hoveredStaveIndex]
      ? newListArray[hoveredStaveIndex]
      : [];

    for (i = 0; i < timeSig[0]; i++) {
      if (i == beatIndex) {
        if (!newStaveArray[i] || newStaveArray[i][1] == "qr") {
          newStaveArray[i] = [newNote, "q"];
        } else {
          const newArray = Array.isArray(newStaveArray[i][0])
            ? newStaveArray[i][0]
            : [newStaveArray[i][0]];
          console.log(newArray);
          newArray.push(newNote);
          newStaveArray[i][0] = newArray;
          console.log(newStaveArray);
        }
      } else if (!newStaveArray) {
        newStaveArray.push(["b/4", "qr"]);
      } else if (!newStaveArray[i]) {
        newStaveArray[i] = ["b/4", "qr"];
      }
    }

    setRerenderStave(true);
    if (newListArray.length == 0) {
      newListArray = [newStaveArray];
    } else {
      i = 0;
      for (i = 0; i < newListArray.length; i++) {
        newListArray[hoveredStaveIndex] = newStaveArray;
      }
    }

    setNewStaves(newListArray);
  };

  return (
    <div
      onMouseMove={handleCursor}
      onClick={handleMouseClick}
      style={{ position: "relative" }}
      ref={container}
      id="output"
    >
      {showNote && (
        <div
          style={{
            position: "absolute",
            left: noteOffset.x - 18,
            top: noteOffset.y + 10,
            pointerEvents: "none", // Ensure the note doesn't interfere with mouse events
          }}
        >
          <img src={Note} className="cursor-image" />
        </div>
      )}
    </div>
  );
}
