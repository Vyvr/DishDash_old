package file_service

import (
	"io"
	"os"
	"path/filepath"
)

func DeleteImageFolder(imagePath string) error {
	dir := filepath.Dir(imagePath)

	// Check if the path is directly under 'images' or 'images/posts' to avoid deleting these parent directories
	if dir == "images" || dir == "images/posts" || dir == "." {
		return os.ErrInvalid
	}

	// Remove the directory and all its contents
	err := os.RemoveAll(dir)
	if err != nil {
		return err
	}
	return nil
}

func CopyFile(src, dst string) error {
    // Open the source file for reading
    sourceFile, err := os.Open(src)
    if err != nil {
        return err
    }
    defer sourceFile.Close()

    // Create the destination file for writing
    destinationFile, err := os.Create(dst)
    if err != nil {
        return err
    }
    defer destinationFile.Close()

    // Use io.Copy to copy the contents from the source to the destination
    _, err = io.Copy(destinationFile, sourceFile)
    if err != nil {
        return err
    }

    // Set the same permissions as the source file
    sourceInfo, err := os.Stat(src)
    if err != nil {
        return err
    }
    err = os.Chmod(dst, sourceInfo.Mode())
    if err != nil {
        return err
    }

    return nil
}

