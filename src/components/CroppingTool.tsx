import { useRef, useState, useTransition } from "react";
import Cropper, { Area } from "react-easy-crop"
import { useAppContext } from "../context/AppContext";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload } from "@fortawesome/free-solid-svg-icons";


export default function CroppingTool() {
    const context = useAppContext();
    const { setCroppedImage, BOARDSIZE, setGameStarted } = context;

    const imageUploadEl = useRef<HTMLInputElement>(null);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null); // base64url string
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [croppedPixels, setCroppedPixels] = useState<Area | null>(null);

    const [isPending, startTransition] = useTransition();

    // get user uploaded image and display on page, to be re-sized
    function handleFileUpload() {
        const file = imageUploadEl.current?.files?.[0];

        if (file) {
        const reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const dataimgurl = event.target?.result;
            if (typeof dataimgurl === "string") {
            setUploadedFile(dataimgurl)
            }
        }
        }
    };

    // crops the image to prepare for game start
    function handleCrop() {
        if (!uploadedFile || !croppedAreaPixels || !croppedPixels) {
            // setError("You must upload an image before starting the game")
            return
        }

        const image = new Image();
        image.src = uploadedFile;
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = BOARDSIZE;
            canvas.height = BOARDSIZE;

            if (!ctx) return // handle error msg?

            ctx.drawImage(
                image,
                croppedPixels.x,
                croppedPixels.y,
                croppedPixels.width,
                croppedPixels.height,
                0,
                0,
                BOARDSIZE,
                BOARDSIZE
            );

            setCroppedImage(canvas);
        };

        startTransition(() => {
            setGameStarted(true);
        });
    }

    function handleClickInput() {
        imageUploadEl.current?.click();
    }

  return (
    <React.Fragment>
        <div className="upload-btn-wrap">
            Select an image to play
            <button className="btn" onClick={handleClickInput}>
                Upload Image
                <FontAwesomeIcon 
                    className="upload-svg" icon={faFileUpload} 
                />
            </button>
        </div>

        <input 
            style={{display: "none"}}
            type='file' 
            accept='image/png, image/jpeg' 
            onChange={() => handleFileUpload()}
            ref={imageUploadEl}
        />
        <div 
            style={{ position: 'relative', width: BOARDSIZE, height: BOARDSIZE }}
            className={isPending ? 'crop-container hide' : 'crop-container show'}
        >
            {uploadedFile && (
                <React.Fragment>
                    <div>Use the tool to crop or resize your image</div>
                    <Cropper
                        showGrid={false}
                        image={uploadedFile}
                        crop={crop}
                        zoom={zoom}
                        aspect={1} // square
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={(croppedArea, croppedPixels) => {
                            setCroppedAreaPixels(croppedArea)
                            setCroppedPixels(croppedPixels)
                        }}
                    />
                </React.Fragment>
            )}
        </div>
        {uploadedFile && 
            <button className='btn' onClick={handleCrop}>Start Game!</button>
        }
    </React.Fragment>
  )
}
