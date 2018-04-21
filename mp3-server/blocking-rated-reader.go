package main

import (
	"io"
	// "log"
	"time"
)

type blockingRatedReader struct {
	innerReader    io.ReadSeeker
	bytesPerSecond int
	initialBurst   int

	ratedStart time.Time
	ratedRead  float64
}

func newBlockingRatedReader(reader io.ReadSeeker, bytesPerSecond int, initialBurstFactor int) io.ReadSeeker {
	return &blockingRatedReader{
		innerReader:    reader,
		bytesPerSecond: bytesPerSecond,
		initialBurst:   initialBurstFactor * bytesPerSecond,
	}
}

func (b *blockingRatedReader) Read(p []byte) (n int, err error) {
	const gran = 4

	wantRead := b.bytesPerSecond / gran

	if b.initialBurst > 0 || wantRead > len(p) {
		wantRead = len(p)
	}

	actualRead, readError := b.innerReader.Read(p[:wantRead])

	if b.initialBurst > 0 {
		b.initialBurst -= actualRead
		// log.Printf("Burst: %d", actualRead)
	} else {
		if b.ratedStart.IsZero() {
			b.ratedStart = time.Now()
		}

		b.ratedRead += float64(actualRead)

		for {
			debt := b.ratedRead - time.Now().Sub(b.ratedStart).Seconds()*float64(b.bytesPerSecond)
			if debt <= 0 {
				break
			}
			// log.Printf("Debt: %f", debt)
			time.Sleep(time.Second / gran)
		}
	}

	return actualRead, readError
}

func (b *blockingRatedReader) Seek(offset int64, whence int) (int64, error) {
	return b.innerReader.Seek(offset, whence)
}
