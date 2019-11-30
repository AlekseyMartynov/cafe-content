package main

import (
	"bytes"
	"encoding/binary"
	"io"

	"go4.org/readerutil"
)

func prependXingHeader(mpegSection readerutil.SizeReaderAt, secondsLeft int) io.ReadSeeker {
	// https://www.codeproject.com/articles/8295/mpeg-audio-frame-header#XINGHeader
	// https://chunminchang.github.io/blog/post/estimation-of-mp3-duration

	const sampleRate = 44100
	const samplesInFrame = 1152

	const headerLen = 208
	const flags = 1 | 2

	approxFrameCount := 1 + (secondsLeft * sampleRate / samplesInFrame)
	byteCount := headerLen + mpegSection.Size()

	headerContent := new(bytes.Buffer)
	headerContent.WriteString("Xing")
	binary.Write(headerContent, binary.BigEndian, int32(flags))
	binary.Write(headerContent, binary.BigEndian, int32(approxFrameCount))
	binary.Write(headerContent, binary.BigEndian, int32(byteCount))

	header := make([]byte, headerLen)
	copy(header, []byte{0xFF, 0xFB, 0x50})
	copy(header[36:], headerContent.Bytes())

	multi := readerutil.NewMultiReaderAt(bytes.NewReader(header), mpegSection)

	return io.NewSectionReader(multi, 0, multi.Size())
}
