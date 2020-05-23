import React, { useCallback, useEffect, useRef, useState } from 'react';
import lzString from 'lz-string';
import { FormattedMessage } from 'react-intl';

import BrushColorPicker from 'components/BrushColorPicker';
import { DrawingColor } from 'components/BrushColorPicker/BrushColorPicker';
import BrushTypePicker from 'components/BrushTypePicker';
import { BrushType } from 'components/BrushTypePicker/BrushTypePicker';
import CanvasActions from 'components/Canvas/CanvasActions';
import { Canvas } from '../CanvasCommon.style';
import { drawLine, drawPaint, fillContext, Line, Paint, Point, resetCanvas } from '../utils';
import {
  CanvasContainer,
  CanvasButtons,
  PadStepDone,
  RightButtons,
  StyledTimerIcon,
  WhiteHeader,
} from './CanvasDraw.style';
import { getBrushAttributes } from './utils';

interface Props {
  finished: boolean;
  canvasWidth: number;
  canvasHeight: number;
  roundDuration: number;
  saveStep: (values: { sentence?: string; drawing?: string }) => void;
}

const CanvasDraw: React.FC<Props> = ({
  canvasWidth,
  canvasHeight,
  finished,
  saveStep,
  roundDuration,
}) => {
  const [color, setColor] = useState<DrawingColor>(DrawingColor.BLACK);
  const [brushType, setBrushType] = useState<BrushType>(BrushType.THIN);
  const [isPainting, setIsPainting] = useState(false);
  const drawing = useRef<Paint>([]);
  const [currentLine, setCurrentLine] = useState<Line | null>(null);
  const [mousePosition, setMousePosition] = useState<Point | undefined>(undefined);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [
    selectedBrushColor,
    selectedBrushRadius,
    isFillDrawSelected,
    pointCursor,
  ] = getBrushAttributes(color, brushType);
  const [archivedPaint, setArchivedPaint] = useState<Paint | null>(null);
  const cursorPosition =
    brushType === BrushType.FILL ? 19 : Math.round(selectedBrushRadius * Math.sqrt(2));

  const setBrushColor = (newColor: DrawingColor) => {
    setColor(newColor);
    if ([BrushType.THIN_ERASER, BrushType.THICK_ERASER].includes(brushType)) {
      setBrushType(BrushType.THIN);
    }
  };

  const getCoordinates = (event: MouseEvent | TouchEvent): Point | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    const rect = canvas.getBoundingClientRect();

    if ('changedTouches' in event) {
      return {
        x: event.changedTouches[0].pageX - rect.left - window.scrollX,
        y: event.changedTouches[0].pageY - rect.top - window.scrollY,
      };
    }

    return {
      x: event.pageX - rect.left - window.scrollX,
      y: event.pageY - rect.top - window.scrollY,
    };
  };

  const startPaint = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const coordinates = getCoordinates(event);
      if (coordinates) {
        if (isFillDrawSelected) {
          fillContext(coordinates, canvasRef, selectedBrushColor);
          drawing.current = drawing.current.concat({
            point: coordinates,
            color: selectedBrushColor,
            type: 'fill',
          });
          return;
        }

        setIsPainting(true);
        setMousePosition(coordinates);
        drawLine(coordinates, coordinates, selectedBrushColor, selectedBrushRadius, canvasRef);
        setCurrentLine({
          points: [coordinates],
          brushColor: selectedBrushColor,
          brushRadius: selectedBrushRadius,
          type: 'line',
        });
      }
    },
    [selectedBrushColor, selectedBrushRadius, isFillDrawSelected],
  );

  const paint = useCallback(
    (event: MouseEvent | TouchEvent) => {
      if (isPainting && currentLine) {
        event.preventDefault();
        const newPosition = getCoordinates(event);
        if (mousePosition && newPosition) {
          drawLine(mousePosition, newPosition, selectedBrushColor, selectedBrushRadius, canvasRef);
          setMousePosition(newPosition);
          setCurrentLine({
            ...currentLine,
            points: currentLine.points.concat(newPosition),
          });
        }
      }
    },
    [isPainting, mousePosition, selectedBrushColor, selectedBrushRadius, currentLine],
  );

  const exitPaint = useCallback(() => {
    if (isPainting) {
      setIsPainting(false);
      setMousePosition(undefined);
      if (currentLine) {
        drawing.current = drawing.current.concat(currentLine);
      }
      setCurrentLine(null);
    }
  }, [currentLine, isPainting]);

  const handleClearAndArchive = () => {
    setArchivedPaint(drawing.current);
    handleClear();
  };

  const handleClear = () => {
    // Do not use clearRect because a cleared canvas is black transparent
    resetCanvas(canvasRef);
    drawing.current = [];
  };

  const handleUndo = () => {
    if (drawing.current.length === 0 && archivedPaint) {
      drawing.current = archivedPaint;
      drawPaint(archivedPaint, canvasRef);
      setArchivedPaint(null);
      return;
    }

    const paintToRedraw = drawing.current.slice(0, -1);
    handleClear();
    drawing.current = paintToRedraw;
    drawPaint(paintToRedraw, canvasRef);
  };

  const saveDrawing = useCallback(
    (drawing: string) => {
      if (saveStep) {
        saveStep({ drawing });
      }
    },
    [saveStep],
  );

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('touchstart', startPaint);
    return () => {
      canvas.removeEventListener('mousedown', startPaint);
      canvas.removeEventListener('touchstart', startPaint);
    };
  }, [startPaint]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('touchmove', paint);
    return () => {
      canvas.removeEventListener('mousemove', paint);
      canvas.removeEventListener('touchmove', paint);
    };
  }, [paint]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);
    canvas.addEventListener('touchend', exitPaint);
    canvas.addEventListener('touchcancel', exitPaint);
    return () => {
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
      canvas.removeEventListener('touchend', exitPaint);
      canvas.removeEventListener('touchcancel', exitPaint);
    };
  }, [exitPaint]);

  useEffect(() => {
    if (!roundDuration || finished) return;

    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;

    const timeout = setTimeout(() => {
      const saveData = canvas.toDataURL('image/png');
      const compressed = lzString.compressToBase64(saveData);
      saveDrawing(compressed);
    }, roundDuration * 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [canvasWidth, canvasHeight, saveDrawing, roundDuration, finished]);

  useEffect(() => {
    handleClear();
  }, []);

  return (
    <>
      <CanvasContainer>
        <Canvas
          pointCursor={pointCursor}
          cursorPosition={cursorPosition}
          ref={canvasRef}
          height={canvasHeight}
          width={canvasWidth}
        />
        {finished && (
          <PadStepDone>
            <StyledTimerIcon />
            <WhiteHeader>
              <FormattedMessage id="wordToDrawing.timesUp" />
            </WhiteHeader>
          </PadStepDone>
        )}
      </CanvasContainer>

      {!finished && (
        <CanvasButtons>
          <BrushColorPicker color={color} setColor={setBrushColor} />
          <RightButtons>
            <CanvasActions onClear={handleClearAndArchive} onUndo={handleUndo} />
            <BrushTypePicker brushType={brushType} setBrushType={setBrushType} />
          </RightButtons>
        </CanvasButtons>
      )}
    </>
  );
};

export default CanvasDraw;
