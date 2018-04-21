package main

import (
	"encoding/binary"
	"gopkg.in/gorilla/mux.v1"
	"io"
	// "log"
	"net/http"
	"os"
	"path"
	"strconv"
	"time"
)

const documentRoot = "/yadisk/cafe-content"

func streamMpeg(res http.ResponseWriter, req *http.Request) {
	mpegPath, tocPath := formatPaths(mux.Vars(req))

	mpegFile, err := os.Open(mpegPath)
	if err != nil {
		http.NotFound(res, req)
		return
	}

	defer mpegFile.Close()
	// defer log.Println("MPEG file closed")

	mpegFileInfo, err := mpegFile.Stat()
	if err != nil {
		http.NotFound(res, req)
		return
	}

	startSecond, _ := strconv.Atoi(req.URL.Query().Get("s"))
	if startSecond < 0 {
		startSecond = 0
	}

	mpegPos := posFromToc(tocPath, startSecond)
	mpegSize := mpegFileInfo.Size()
	if mpegPos < 0 || mpegPos > mpegSize {
		http.NotFound(res, req)
		return
	}

	h := res.Header()
	h.Set("Cache-Control", "no-cache")
	h.Set("Content-Type", "audio/mpeg")

	section := io.NewSectionReader(mpegFile, mpegPos, mpegSize-mpegPos)
	rated := newBlockingRatedReader(section, 16384, 15)
	http.ServeContent(res, req, "audio.mp3", time.Time{}, rated)
}

func formatPaths(vars map[string]string) (mpegPath string, tocPath string) {
	chapter := vars["chapter"]
	prefix := path.Join(documentRoot, "tracks", vars["year"], vars["date"])
	return path.Join(prefix, chapter+".mp3"), path.Join(prefix, "toc_"+chapter)
}

func posFromToc(tocPath string, startSecond int) int64 {
	file, fileError := os.Open(tocPath)
	if fileError != nil {
		return -1
	}

	defer file.Close()

	section := io.NewSectionReader(file, 4*int64(startSecond), 4)
	readResult := uint32(0)
	readError := binary.Read(section, binary.LittleEndian, &readResult)

	if readError != nil {
		return -1
	}

	return int64(readResult)
}

func main() {
	router := mux.NewRouter()
	router.HandleFunc(`/{year:\d{4}}/{date:\d{4}-\d{2}-\d{2}}/{chapter:\d}.mp3`, streamMpeg)
	http.ListenAndServe(":9000", router)
}
