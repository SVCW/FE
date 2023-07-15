import React, { useRef, useState } from 'react';
import { storage_bucket } from './../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
const Test = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [images, setImages] = useState([]);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef(null);
    console.log(images);
    const handleClick = (e) => {
        if (e.target === fileInputRef.current || e.target.parentNode === fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = async (e) => {
        setIsLoading(true);
        const fileList = e.target.files;
        const newImages = [];

        for (let i = 0;i < fileList.length;i++) {
            const file = fileList[i];
            const imageUrl = URL.createObjectURL(file);
            newImages.push({ file, url: imageUrl });

            try {
                const fileRef = ref(storage_bucket, file.name);
                const uploadTask = uploadBytesResumable(fileRef, file);

                uploadTask.on('state_changed', (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setUploadProgress(progress);
                });

                const snapshot = await uploadTask;

                if (snapshot.state === 'success') {
                    const downloadURL = await getDownloadURL(snapshot.ref);
                    const updatedImages = [...newImages];
                    updatedImages[i].url = downloadURL;
                    setImages((prevImages) => [...prevImages, ...updatedImages]);
                }
            } catch (error) {
                console.log(error);
            }
        }

        setIsLoading(false);
        setUploadProgress(0);
    };
    const handleImageDelete = (index) => {
        setImages((prevImages) => {
            const updatedImages = [...prevImages];
            updatedImages.splice(index, 1);
            return updatedImages;
        });
    };

    return (
        <div>
            {/* <input type="file" multiple onChange={handleImageChange} className="inputfile" /> */}
            <div>
                <form>
                    <fieldset className="upload_dropZone text-center mb-3 p-4" onClick={handleClick}>
                        <legend className="visually-hidden">Image uploader</legend>
                        <svg className="upload_svg" width={60} height={60} aria-hidden="true">
                            <use href="#icon-imageUpload" />
                        </svg>
                        <p className="small my-2">Drag &amp; Drop background image(s) inside dashed region<br /><i>or</i></p>
                        <input
                            id="upload_image_background"
                            ref={fileInputRef}
                            data-post-name="image_background"
                            data-post-url="https://someplace.com/image/uploads/backgrounds/"
                            className="position-absolute invisible"
                            type="file"
                            multiple
                            onChange={handleImageChange}
                            accept="image/jpeg, image/png, image/svg+xml"
                        />
                        <label className="btn btn-upload mb-3" htmlFor="upload_image_background">Choose file(s)</label>
                        <div className="upload_gallery d-flex flex-wrap justify-content-center gap-3 mb-0" />
                    </fieldset>

                </form>
                <svg style={{ display: 'none' }}>
                    <defs>
                        <symbol id="icon-imageUpload" clipRule="evenodd" viewBox="0 0 96 96">
                            <path d="M47 6a21 21 0 0 0-12.3 3.8c-2.7 2.1-4.4 5-4.7 7.1-5.8 1.2-10.3 5.6-10.3 10.6 0 6 5.8 11 13 11h12.6V22.7l-7.1 6.8c-.4.3-.9.5-1.4.5-1 0-2-.8-2-1.7 0-.4.3-.9.6-1.2l10.3-8.8c.3-.4.8-.6 1.3-.6.6 0 1 .2 1.4.6l10.2 8.8c.4.3.6.8.6 1.2 0 1-.9 1.7-2 1.7-.5 0-1-.2-1.3-.5l-7.2-6.8v15.6h14.4c6.1 0 11.2-4.1 11.2-9.4 0-5-4-8.8-9.5-9.4C63.8 11.8 56 5.8 47 6Zm-1.7 42.7V38.4h3.4v10.3c0 .8-.7 1.5-1.7 1.5s-1.7-.7-1.7-1.5Z M27 49c-4 0-7 2-7 6v29c0 3 3 6 6 6h42c3 0 6-3 6-6V55c0-4-3-6-7-6H28Zm41 3c1 0 3 1 3 3v19l-13-6a2 2 0 0 0-2 0L44 79l-10-5a2 2 0 0 0-2 0l-9 7V55c0-2 2-3 4-3h41Z M40 62c0 2-2 4-5 4s-5-2-5-4 2-4 5-4 5 2 5 4Z" />
                        </symbol>
                    </defs>
                </svg>
            </div>

            <div className="image-container">
                {images.map((image, index) => (
                    <div className="image-item" key={index}>
                        <img src={image.url} alt={`Image ${index}`} className="image-preview" />
                        <button className="delete-button" onClick={() => handleImageDelete(index)}>
                            <span>&times;</span>
                        </button>
                    </div>
                ))}
            </div>

            {isLoading && (
                <div>
                    <div className="progress-bar-container">
                        <div className="progress-bar" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                    <div className="progress-percentage">{uploadProgress}%</div>
                </div>
            )}

            {images.length > 0 && (
                <div>
                    <h4>Image URLs:</h4>
                    <ul>
                        {images.map((image, index) => (
                            <li key={index}>{image.url}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};


export default Test;